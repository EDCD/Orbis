const express = require('express');
const models = require('../models');
const {keycloak} = require('../keycloak');

const {Ship, User} = models;

const router = express.Router();

function isAuthenticated(req, res, next) {
	if (req.user) {
		return next();
	}
	return res.status(401).json({
		error: 'User not authenticated'
	});
}

router.get('/users', keycloak.protect('Admin'), (req, res) => {
	return User.findAll()
		.then(data => res.json(data))
		.catch(err => {
			console.error(err);
			return res.json({});
		});
});

router.post('/user/update', keycloak.protect('Admin'), (req, res) => {
	const body = req.body;
	if (!req.body || !body.id) {
		return res.status(400).json(req.body);
	}
	User.find({where: {
		id: body.id
	}})
		.then(user => {
			for (const i in body) {
				if (!Object.prototype.hasOwnProperty.call(body, i)) {
					continue;
				}
				console.log(`${i}: ${user[i]} => ${body[i]}`);
				user[i] = body[i];
			}
		});
	return res.status(200).json({});
});

module.exports = router;
