const express = require('express');
const models = require('../models');
const {keycloak} = require('../keycloak');

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
	res.status(200).end();
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
	return res.status(200).json({status: 'Login successful!', accessToken: req.kauth.grant.access_token.token});
});

module.exports = router;
