const express = require('express');
const models = require('../models');
const Op = require('sequelize').Op;

const router = express.Router();
const { User, Ship, sequelize } = models;

router.post('/register', async (req, res) => {
	if (!req.body) {
		return res.status(400).end();
	}
	let user = await User.find({
		where: {
			[Op.or]: [
				{
					email: req.body.email
				},
				{
					username: req.body.username
				}
			]
		}
	});
	if (user) {
		return res.json({ success: false, error: 'User already exists.' });
	}
	try {
		user = await User.create({
			email: req.body.email,
			nickname: req.body.username,
			password: req.body.password
		});
	} catch (err) {
		if (err instanceof models.Sequelize.UniqueConstraintError) {
			console.info('User already exists.');
			return res.json({ success: false, error: 'User already exists.' });
		}
		console.error(err);
		console.error(err.message);
	}

	return res.json({ success: true, user: 'created' });
});

router.post('/profile/:name', (req, res) => {
	const username =
		req.params.name === 'me' && req.user
			? req.user.username
			: req.params.name;
	let { order, field, search, ship } = req.body;
	if (!req.body.pageSize || req.body.pageSize > 100) {
		req.body.pageSize = 10;
	}
	let id = '';
	console.log(req.user)
	if (req.user && req.user.user_id) {
		id = req.user.user_id;
	}
	const query = {
		order: [[field || 'createdAt', order || 'DESC']],
		limit: req.body.pageSize,
		offset: req.body.offset,
		attributes: [
			'shortid',
			'title',
			'description',
			'forgeShip',
			'Ship',
			'likes',
			'url',
			'proxiedImage'
		],
		include: [
			{
				model: User,
				attributes: ['nickname']
			}
		],
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
		}
	};
	if (search && search.key && search.value) {
		query.where[search.key] = {
			[Op.iLike]: `%${search.value}%`
		};
	}

	if (ship) {
		query.where['ShipName'] = ship;
	}

	return Ship.findAndCountAll(query)
		.then(ships => res.json(ships))
		.catch(err => {
			console.error(err);
			res.status(500).end();
		});
});

router.get('/list', (req, res) => {
	return User.findAndCountAll({
		attributes: ['id', 'nickname']
	})
		.then(users => res.json(users))
		.catch(err => {
			console.error(err);
			res.status(500).end();
		});
});

module.exports = router;
