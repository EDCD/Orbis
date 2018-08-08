const express = require('express');
const models = require('../models');
const RateLimit = require('express-rate-limit');
const {keycloak} = require('../keycloak');
const {Ship, ShipVote} = models;
const router = express.Router();

const addLimiter = new RateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 20, // Limit each IP to 20 requests per windowMs
	delayMs: 1000, // Disable delaying - full speed until the max limit is reached
	delayAfter: 5,
	message: 'Too many builds uploaded. Please try again later.'
});

const batchAddLimiter = new RateLimit({
	windowMs: 60 * 60 * 1000, // 15 minutes
	max: 1, // Limit each IP to 20 requests per windowMs
	message: 'Too many builds uploaded. Please try again later.'
});

const {Op} = require('sequelize');

router.post('/', (req, res) => {
	const {order, field, search} = req.body;
	const query = {
		order: [[field || 'createdAt', order || 'DESC']],
		limit: req.body.pageSize,
		offset: req.body.offset,
		attributes: ['id', 'updatedAt', 'createdAt', 'shortid', 'title', 'description', 'author', 'proxiedImage', 'coriolisShip']
	};
	if (search && search.key && search.value) {
		query.where = {};
		query.where[search.key] = {
			[Op.iLike]: `%${search.value}%`
		};
	}
	return Ship.findAndCountAll(query)
		.then(async ships => {
			const promises = [];
			ships.rows.forEach(ship => {
				promises.push(
					ShipVote.sum('vote', {
						where: {
							shipId: ship.id
						}
					})
				);
			});
			const data = await Promise.all(promises);
			for (const i in data) {
				if (isNaN(data[i])) {
					data[i] = 0;
				}
				ships.rows[i].likes = data[i];
			}
			return res.json(ships);
		})
		.catch(err => {
			console.error(err);
			res.status(500).end();
		});
});

const allowedUpdates = ['imageURL', 'description', 'title'];

router.get('/:id', (req, res) =>
	Ship.find({
		where: {shortid: req.params.id},
		attributes: ['id', 'updatedAt', 'createdAt', 'shortid', 'title', 'description', 'author', 'imageURL', 'proxiedImage', 'coriolisShip']
	})
		.then(ships => {
			if (!ships) {
				return res.json({});
			}
			ships.allowedToEdit = false;
			if (req.user) {
				if (req.user.id === ships.id) {
					ships.allowedToEdit = true;
				}
			}
			return res.json(ships);
		})
		.catch(err => {
			console.error(err);
			res.status(500).end();
		})
);

function isAuthenticated(req, res, next) {
	if (req.user || req.session) {
		return next();
	}

	return res.status(401).json({
		error: 'User not authenticated'
	});
}

const isAdmin = req => req.user.admin === true;

router.delete('/:id', keycloak.protect(), async (req, res) => {
	const data = req.params;
	const ship = await Ship.find({
		where: {
			id: data.id
		}
	});
	if (req.user && ship) {
		const isadmin = isAdmin(req);
		if (req.user.id === ship.author.id || isadmin) {
			await ShipVote.destroy({
				where: {
					shipId: data.id
				}
			});
			await Ship.destroy({
				where: {
					id: data.id
				}
			});
			return res.json({
				success: true
			});
		}
		return res.status(403).json({success: false});
	}
	return res.status(403).json({success: false});
});

router.post('/update', keycloak.protect(), async (req, res) => {
	if (!req.body || !req.body.updates) {
		return res.status(400).end();
	}
	const data = req.body;
	const ship = await Ship.find({
		where: {
			id: data.id
		}
	});
	if (req.user && ship) {
		const isadmin = isAdmin(req);
		if (req.user.id === ship.author.id || isadmin) {
			for (const update in data.updates) {
				if (!Object.prototype.hasOwnProperty.call(data.updates, update)) {
					continue;
				}
				if (allowedUpdates.indexOf(update) === -1) {
					continue;
				}
				ship[update] = data.updates[update];
				if (update === 'imageURL') {
					ship.proxiedImage = `${process.env.IMGPROXY_BASE_URL}/{OPTIONS}/${data.updates[update]}`;
				}
				console.log(data.updates[update]);
			}
			return ship.save()
				.then(ship => res.json({
					success: true,
					id: ship.id,
					body: data,
					ship: 'created',
					link: `https://orbis.zone/build/${ship.shortid}`
				})
				);
		}
		return res.status(403).json({});
	}
	return res.status(500).json({});
});

router.post('/add', keycloak.protect(), addLimiter, async (req, res) => {
	if (!req.body) {
		return res.status(400).end();
	}
	const data = JSON.parse(JSON.stringify(req.body));
	data.author = req.user === undefined ? {username: 'Anonymous'} : req.user;
	const ship = await Ship.create(data);
	return res.json({
		success: true,
		id: ship.id,
		ship: 'created',
		link: `https://orbis.zone/build/${ship.shortid}`
	});
});

router.post('/add/batch', keycloak.protect(), batchAddLimiter, async (req, res) => {
	if (!req.body) {
		return res.status(400).end();
	}
	let promises = [];
	const data = JSON.parse(JSON.stringify(req.body));
	for (const build in data) {
		data[build].author = req.user;
		promises.push(Ship.findOrCreate({
			where: {
				author: {
					username: req.user.username
				},
				title: data[build].title,
				ShipName: data[build].ShipName,
				description: data[build].description
			},
			defaults: data[build]
		}));
	}
	return Promise.all(promises)
		.then(datas => {
			const returnObj = [];
			for (const s of datas) {
				returnObj.push({
					success: true,
					id: s.id,
					ship: 'created',
					link: `https://orbis.zone/build/${s.shortid}`
				});
			}
			return res.json({totalCreated: returnObj.length, data: returnObj});
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({error: err.message});
		});
});

module.exports = router;
