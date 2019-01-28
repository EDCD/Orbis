const express = require('express');
const _ = require('lodash');
const models = require('../models');

const router = express.Router();

function isAuthenticated(req, res, next) {
	if (req.session) {
		return next();
	}
	return res.status(401).json({
		error: 'User not authenticated'
	});
}

const { ShipVote } = models;

router.post('/', isAuthenticated, (req, res) => {
	const author = req.user;
	if (!author) {
		return res.status(403).end();
	}
	if (!req.body) {
		return res.status(400).end();
	}
	return ShipVote.upsert({
		userId: author.id,
		shipId: req.body.shipId,
		vote: req.body.vote
	})
		.then(async created => {
			const count = await ShipVote.sum('vote', {
				where: {
					shipId: req.body.shipId
				}
			});
			return res.json({ created, count });
		})
		.catch(err => {
			console.error(err);
			return res.status(500).end();
		});
});

module.exports = router;
