const express = require('express');
const models = require('../models');
const _ = require('lodash');
const RateLimit = require('express-rate-limit');
const {keycloak} = require('../keycloak');
const {Ship, ShipVote, sequelize} = models;
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

const isAdmin = req => req.user.admin === true;

router.post('/', (req, res) => {
	let {order, field, search} = req.body;
	const query = {
		order: [[field || 'createdAt', order || 'DESC']],
		limit: req.body.pageSize,
		offset: req.body.offset,
		attributes: [
			'id',
			'updatedAt',
			'createdAt',
			'shortid',
			'title',
			'description',
			[sequelize.json('author.username'), 'username'],
			'Ship',
			'likes',
			'url',
			'proxiedImage'
		]
	};
	if (search && search.key && search.value) {
		query.where = {};
		query.where[search.key] = {
			[Op.iLike]: `%${search.value}%`
		};
	}
	return Ship.findAndCountAll(query)
		.then(async ships => {
			return res.json(ships);
		})
		.catch(err => {
			console.error(err);
			res.status(500).end();
		});
});

router.get('/liked/:shipId', (req, res) => {
	if (!req.user) {
		return res.status(403).end();
	}
	return ShipVote.find({
		where: {
			shipId: req.params.shipId,
			userId: req.user.keycloakId
		},
		attributes: ['vote']
	})
		.then(vote => {
			if (!vote) {
				return res.json({});
			}
			vote = JSON.parse(JSON.stringify(vote));
			return res.json({vote: vote.vote});
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
		attributes: [
			'id',
			'updatedAt',
			'createdAt',
			'shortid',
			'title',
			'description',
			[sequelize.json('author.username'), 'username'],
			[sequelize.json('author.id'), 'authorId'],
			'imageURL',
			'url',
			'proxiedImage',
			'coriolisShip'
		]
	})
		.then(ships => {
			if (!ships) {
				return res.json({});
			}
			ships = JSON.parse(JSON.stringify(ships));
			ships.allowedToEdit = false;
			if (req.user) {
				const isadmin = isAdmin(req);
				if (req.user.id === ships.authorId || isadmin) {
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
					ship.proxiedImage = `${process.env.IMGPROXY_BASE_URL}/{OPTIONS}/${
						data.updates[update]
					}`;
				}
				console.log(data.updates[update]);
			}
			return ship.save().then(ship =>
				res.json({
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

router.post(
	'/add/batch',
	keycloak.protect(),
	batchAddLimiter,
	async (req, res) => {
		if (!req.body) {
			return res.status(400).end();
		}
		let promises = [];
		const data = JSON.parse(JSON.stringify(req.body));
		for (const build in data) {
			data[build].author = req.user;
			promises.push(
				Ship.findOrCreate({
					where: {
						author: {
							username: req.user.username
						},
						title: data[build].title,
						ShipName: data[build].ShipName,
						description: data[build].description
					},
					defaults: data[build]
				})
			);
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
	}
);

module.exports = router;
