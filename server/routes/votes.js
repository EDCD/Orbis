const express = require('express');
const _ = require('lodash');
const models = require('../models');

const router = express.Router();

function isAuthenticated(req, res, next) {
	if (req.user) {
		return next();
	}
	return res.status(401).json({
		error: 'User not authenticated'
	});
}

const {ShipVote} = models;

router.post('/', isAuthenticated, (req, res) => {
	const author = req.user;

	return ShipVote.upsert({
		userId: author.keycloakId,
		shipId: req.body.shipId,
		vote: req.body.vote
	}).then(async created => {
		const count = await ShipVote.sum('vote', {
			where: {
				shipId: req.body.shipId
			}
		});
		return res.json({created, count});
	});
});

module.exports = router;
