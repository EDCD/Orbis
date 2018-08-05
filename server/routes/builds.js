const express = require('express');
const models = require('../models');

const {Ship, ShipVote} = models;
const router = express.Router();
const passport = require('../passport');
const kc = require('../keycloak');

router.post('/', (req, res) => {
	const {order, field} = req.body;
	return Ship.findAndCountAll({
		// Order: [[field || 'updatedAt', order || 'DESC']],
		limit: req.body.pageSize,
		offset: req.body.offset,
		attributes: ['id', 'updatedAt', 'createdAt', 'shortid', 'title', 'description', 'author', 'proxiedImage', 'coriolisShip']
	})
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
		attributes: ['id', 'updatedAt', 'createdAt', 'shortid', 'title', 'description', 'author', 'imageURL', 'coriolisShip']
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
	if (req.user) {
		return next();
	}

	return res.status(401).json({
		error: 'User not authenticated'
	});
}

const isAdmin = req => req.user.admin === true;

router.delete('/:id', isAuthenticated, async (req, res) => {
	const data = req.params;
	const ship = await Ship.find({
		where: {
			id: data.id
		}
	});
	if (req.user) {
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

router.post('/update', isAuthenticated, async (req, res) => {
	if (!req.body || !req.body.updates) {
		return res.status(413).end();
	}
	const data = req.body;
	const ship = await Ship.find({
		where: {
			id: data.id
		}
	});
	if (req.user) {
		const isadmin = isAdmin(req);
		if (req.user.id === ship.author.id || isadmin) {
			for (const update in data.updates) {
				if (!data.updates.hasOwnProperty(update)) {
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
});

router.post('/add', isAuthenticated, async (req, res) => {
	if (!req.body) {
		return res.status(413).end();
	}
	const data = JSON.parse(JSON.stringify(req.body));
	data.author = req.user === undefined ? {username: 'Anonymous'} : req.user;
	const ship = await Ship.create(data);
	return res.json({
		success: true,
		id: ship.id,
		body: data,
		ship: 'created',
		link: `https://orbis.zone/build/${ship.shortid}`
	});
});

module.exports = router;
