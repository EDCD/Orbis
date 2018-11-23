const express = require('express');
const models = require('../models');
const crypto = require('crypto');

const { User } = models;
const router = express.Router();

function isAuthenticated(req, res, next) {
	if (req.session) {
		return next();
	}
	return res.status(401).json({
		error: 'User not authenticated'
	});
}

const verifyPatreon = req => {
	// Compare their hmac signature to our hmac signature
	// (hmac = hash-based message authentication code)
	const theirSignature = req.get('X-Patreon-Signature');

	const payload = JSON.stringify(req.body);
	const secret = process.env.PATREON_WEBHOOK_SECRET;
	const ourSignature = `${crypto
		.createHmac('md5', secret)
		.update(payload)
		.digest('hex')}`;
	console.log(theirSignature);
	console.log(ourSignature);
	return crypto.timingSafeEqual(
		Buffer.from(theirSignature),
		Buffer.from(ourSignature)
	);
};

router.get('/', (req, res) => {
	res.status(200).end();
});

router.post('/patreon', (req, res) => {
	if (!verifyPatreon(req)) {
		return res.status(403).end();
	}
	console.log(req.body);
	User.find({
		where: {
			email: req.body.included[1].attributes.email
		}
	})
		.then(async user => {
			if (user) {
				const badge = req.body.included[2].attributes.title;
				user.badges = { current: badge };
				await user.save();
			}
		})
		.catch(err => {
			console.error(err);
			return res.status(500).end();
		});
	return res.status(200).end();
});

module.exports = router;
