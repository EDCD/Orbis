const express = require('express');
const models = require('../models');
const { keycloak } = require('../app');
const Sequelize = require('sequelize');

const { Announcement } = models;
const { Op } = Sequelize;

const router = express.Router();

function isAuthenticated(req, res, next) {
	if (req.user) {
		return next();
	}
	if (
		Object.keys(req.kauth).length === 0 &&
		req.kauth.constructor === Object
	) {
		return res.status(401).json({
			error: 'User not authenticated'
		});
	}
	if (req.kauth) {
		return next();
	}
	return res.status(401).json({
		error: 'User not authenticated'
	});
}

router.get('/', (req, res) => {
	res.status(200).end();
});

router.get('/announcement', (req, res) => {
	const query = {
		where: {
			expiresAt: {
				[Op.gt]: Date.now()
			}
		}
	};
	if (!req.query.showInCoriolis) {
		req.query.showInCoriolis = false;
	}
	query.where.showInCoriolis = JSON.parse(req.query.showInCoriolis) === true;
	return Announcement.findAll(query)
		.then(data => res.json(data))
		.catch(err => {
			console.error(err);
			return res.json([]);
		});
});

// Start authentication request
// options [optional], extra authentication parameters
router.get('/auth', keycloak.protect(), (req, res) => {
	res.redirect('/');
});

router.get('/logout', (req, res) => {
	console.log(req.user);
	req.logout();
	res.redirect('/');
});

router.get('/checkauth', isAuthenticated, (req, res) => {
	return res.status(200).json({
		status: 'Login successful!',
		accessToken: req.kauth.grant.access_token.token,
		user: req.user,
		admin: req.user.admin
	});
});

router.get('/checkauth/admin', keycloak.protect('Admin'), (req, res) => {
	return res.status(200).json({
		status: 'Login successful!',
		accessToken: req.kauth.grant.access_token.token,
		admin: req.user.admin
	});
});

module.exports = router;
