const express = require('express');
const models = require('../models');
const Sequelize = require('sequelize');
const passport = require('passport');
const { secured, securedAdmin } = require('../app');

const { Announcement } = models;
const { Op } = Sequelize;

const router = express.Router();

function isAuthenticated(req, res, next) {
	if (req.user) {
		return next();
	}
	return res.status(401).json({
		error: 'User not authenticated'
	});
}

router.get('/', (req, res) => {
	res.status(200).json(req.user);
});

router.get(
	'/auth',
	passport.authenticate('auth0', {
		scope: 'openid email profile app_metadata user_metadata roles'
	}),
	function(req, res) {
		res.redirect('/');
	}
);

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get(
	'/callback',
	passport.authenticate('auth0', { failureRedirect: '/api/auth' }),
	(req, res) => {
		if (!req.user) {
			throw new Error('user null');
		}
		res.redirect('/');
	}
);

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
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

router.get('/checkauth', secured, (req, res) => {
	return res.status(200).json({
		status: 'Login successful!',
		user: req.user,
		admin: req.user.admin
	});
});

router.get('/checkauth/admin', securedAdmin, (req, res) => {
	return res.status(200).json({
		status: 'Login successful!',
		user: req.user,
		admin: req.user.admin
	});
});

module.exports = router;
