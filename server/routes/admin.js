const express = require('express');
const models = require('../models');
const {keycloak} = require('../keycloak');

const {Ship, ShipVote, User} = models;

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
	User.find({
		where: {
			id: body.id
		}
	})
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

router.post('/ships', keycloak.protect('Admin'), (req, res) => {
	let {order, field, search} = req.body;
	console.log(field);
	console.log(order);
	const query = {
		order: [[field || 'createdAt', order || 'DESC']],
		limit: req.body.pageSize,
		offset: req.body.offset,
		attributes: ['id', 'updatedAt', 'createdAt', 'shortid', 'title', 'description', 'author', 'likes', 'proxiedImage', 'coriolisShip']
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

router.post('/ship/update', keycloak.protect('Admin'), (req, res) => {
	const body = req.body;
	if (!req.body || !body.id) {
		return res.status(400).json({});
	}
	Ship.find({
		where: {
			id: body.id
		}
	})
		.then(ship => {
			for (const i in body) {
				if (!Object.prototype.hasOwnProperty.call(body, i)) {
					continue;
				}
				console.log(`${i}: ${ship[i]} => ${body[i]}`);
				ship[i] = body[i];
			}
			if (body.delete === true) {
				ShipVote.destroy({
					where: {
						shipId: body.id
					}
				});
				Ship.destroy({
					where: {
						id: body.id
					}
				});
			} else {
				ship.save();
			}
		});
	return res.status(200).json({});
});

module.exports = router;
