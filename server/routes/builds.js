const express = require('express');
const models = require('../models');
const _ = require('lodash');
const RateLimit = require('express-rate-limit');
const { secured, securedAdmin } = require('../app');
const { Ship, ShipVote, sequelize, User } = models;
const router = express.Router();

const addLimiter = new RateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 20, // Limit each IP to 20 requests per windowMs
	message: 'Too many builds uploaded. Please try again later.'
});

const batchAddLimiter = new RateLimit({
	windowMs: 60 * 60 * 1000, // 15 minutes
	max: 1, // Limit each IP to 20 requests per windowMs
	message: 'Too many builds uploaded. Please try again later.'
});

const { Op } = require('sequelize');

const isAdmin = req => req.user && req.user.admin === true;

router.post('/', (req, res) => {
	let { order, field, search, ship, category } = req.body;
	if (!req.body.pageSize || req.body.pageSize > 100) {
		req.body.pageSize = 10;
	}
	let id = '';
	if (req.user && req.user.id) {
		id = req.user.id;
	}
	const query = {
		order: [[field || 'createdAt', order || 'DESC']],
		limit: req.body.pageSize,
		where: {
			[Op.or]: [
				{
					privacy: 'public'
				},
				{
					privacy: 'owner',
					userId: id
				},
				{
					sharedAccounts: {
						[Op.contains]: [id]
					}
				}
			]
		},
		offset: req.body.offset,
		attributes: [
			'id',
			'updatedAt',
			'createdAt',
			'shortid',
			'category',
			'title',
			'forgeShip',
			'description',
			// [sequelize.json('coriolisShip.url'), 'url'],
			'Ship',
			'userId',
			'likes',
			'proxiedImage'
		],
		include: [{ model: User, as: 'User' }]
	};
	if (search && search.key && search.value) {
		query.where[search.key] = {
			[Op.iLike]: `%${search.value}%`
		};
	}
	if (ship) {
		query.where['ShipName'] = ship;
	}
	if (category) {
		query.where['category'] = category;
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

router.get('/featured', (req, res) => {
	return Ship.findAll({
		where: {
			featured: true,
			featuredon: {
				[Op.lt]: new Date(
					new Date().getTime() + 7 * 24 * 60 * 60 * 1000
				).toISOString()
			}
		},
		attributes: [
			'id',
			'updatedAt',
			'createdAt',
			'shortid',
			'category',
			'featured',
			'title',
			'description',
			[sequelize.json('coriolisShip.url'), 'url'],
			'Ship',
			'likes',
			'proxiedImage'
		]
	})
		.then(ships => {
			if (!ships) {
				return res.json({});
			}
			return res.json(ships);
		})
		.catch(err => {
			console.error(err);
			res.status(500).end();
		});
});

router.get('/liked/:shipId', (req, res) => {
	if (!req.user) {
		return res.status(403).json({ message: 'Not logged in' });
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
			return res.json({ vote: vote.vote });
		})
		.catch(err => {
			console.error(err);
			res.status(500).end();
		});
});

router.post('/liked/batch', (req, res) => {
	if (!req.user) {
		return res.status(403).json({ message: 'Not logged in' });
	}
	if (!req.body.ids) {
		return res.status(400).json({ message: 'No IDs listed' });
	}
	return ShipVote.findAll({
		where: {
			shipId: {
				[Op.in]: req.body.ids
			},
			userId: req.user.keycloakId
		},
		attributes: ['shipId', 'vote']
	})
		.then(vote => {
			if (!vote) {
				return res.json({});
			}
			vote = JSON.parse(JSON.stringify(vote));
			return res.json(vote);
		})
		.catch(err => {
			console.error(err);
			res.status(500).end();
		});
});

const allowedUpdates = [
	'imageURL',
	'description',
	'title',
	'privacy',
	'sharedAccounts',
	'sharedAccountUsernames',
	'category'
];

router.get('/:id', (req, res) =>
	Ship.find({
		where: { shortid: req.params.id },
		attributes: [
			'id',
			'updatedAt',
			'createdAt',
			'category',
			'shortid',
			'title',
			'description',
			'forgeShip',
			'privacy',
			'sharedAccounts',
			'sharedAccountUsernames',
			'imageURL',
			'url',
			'proxiedImage',
			'coriolisShip'
		],
		include: [{ model: User, as: 'User' }]
	})
		.then(ships => {
			if (!ships) {
				return res.json({});
			}
			if (
				!isAdmin(req) &&
				ships.privacy === 'owner' &&
				ships.authorId !== req.user.id
			) {
				return res
					.status(403)
					.json({ message: 'No permission to view' });
			}
			if (
				!isAdmin(req) &&
				ships.privacy === 'shared' &&
				!ships.sharedAccounts.includes(req.user.id)
			) {
				return res
					.status(403)
					.json({ message: 'No permission to view' });
			}
			ships = JSON.parse(JSON.stringify(ships));
			ships.allowedToEdit = false;
			if (req.user) {
				const isadmin = isAdmin(req);
				if (req.user.id === ships.User.id || isadmin) {
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

router.delete('/:id', secured, async (req, res) => {
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
		return res.status(403).json({ success: false });
	}
	return res.status(403).json({ success: false });
});

const cats = [
	'Combat',
	'Mining',
	'Trading',
	'Exploration',
	'Smuggling',
	'Passenger Liner',
	'PvP'
];

router.post('/update', secured, async (req, res) => {
	if (!req.body || !req.body.updates) {
		return res.status(400).end();
	}
	const data = req.body;
	const ship = await Ship.find({
		where: {
			id: data.id
		},
		include: [{ model: User, as: 'User' }]
	});
	if (req.user && ship) {
		const isadmin = isAdmin(req);
		if (req.user.id === ship.User.id || isadmin) {
			for (const update in data.updates) {
				if (
					!Object.prototype.hasOwnProperty.call(data.updates, update)
				) {
					continue;
				}
				if (allowedUpdates.indexOf(update) === -1) {
					continue;
				}
				if (
					update === 'category' &&
					cats.indexOf(data.updates[update]) === -1
				) {
					continue;
				}
				ship[update] = data.updates[update];
				if (update === 'imageURL') {
					ship.proxiedImage = `${
						process.env.IMGPROXY_BASE_URL
					}/resize?url=${data.updates[update]}&width={{WIDTH}}`;
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

router.post('/add', secured, addLimiter, async (req, res) => {
	if (!req.body) {
		return res.status(400).end();
	}
	const data = JSON.parse(JSON.stringify(req.body));
	console.log(Object.keys(req.user));
	data.userId = req.user.id;
	const ship = await Ship.create({ ...data });
	return res.json({
		success: true,
		id: ship.id,
		ship: 'created',
		link: `https://orbis.zone/build/${ship.shortid}`
	});
});

router.post('/add/batch', secured, batchAddLimiter, async (req, res) => {
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
			return res.json({
				totalCreated: returnObj.length,
				data: returnObj
			});
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({ error: err.message });
		});
});

module.exports = router;
