const express = require('express');
const models = require('../models');
const Op = require('sequelize').Op;

const router = express.Router();
const {User, Ship} = models;

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

router.get('/profile/:name', (req, res) => {
	const username = req.params.name === 'me' && req.user ? req.user.username : req.params.name;
	const query = {
		where: {
			'author.username': username
		},
		limit: req.query.pageSize,
		offset: req.query.offset,
		attributes: [
			'id',
			'updatedAt',
			'createdAt',
			'shortid',
			'title',
			'description',
			'author',
			'Ship',
			'likes',
			'url',
			'proxiedImage'
		]
	};
	return Ship.findAndCountAll(query)
		.then(ships => res.json(ships))
		.catch(err => {
			console.error(err);
			res.status(500).end();
		});
});

module.exports = router;
