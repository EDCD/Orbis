const express = require('express');
const models = require('../models');
const Op = require('sequelize').Op;

const router = express.Router();
const {User, Ship, sequelize} = models;

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
		return res.json({success: false, error: 'User already exists.'});
	}
	try {
		user = await User.create({
			email: req.body.email,
			username: req.body.username,
			password: req.body.password
		});
	} catch (err) {
		if (err instanceof models.Sequelize.UniqueConstraintError) {
			console.info('User already exists.');
			return res.json({success: false, error: 'User already exists.'});
		}
		console.error(err);
		console.error(err.message);
	}

	return res.json({success: true, user: 'created'});
});

router.post('/profile/:name', (req, res) => {
	const username = req.params.name === 'me' && req.user ? req.user.username : req.params.name;
	let {order, field, search, ship} = req.body;
	if (!req.body.pageSize || req.body.pageSize > 100) {
		req.body.pageSize = 10;
	}
	const query = {
		where: {
			'author.username': username
		},
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
			'author',
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
		attributes: ['id', 'username']
	})
		.then(users => res.json(users))
		.catch(err => {
			console.error(err);
			res.status(500).end();
		});
});


module.exports = router;
