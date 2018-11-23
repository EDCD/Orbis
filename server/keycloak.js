const models = require('./models');
const { User } = models;
const UsernameGenerator = require('username-generator');

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

const getUserInfo = (req, res, next) => {
	if (req.user) {
		return next();
	}
	if (
		!req.kauth ||
		!req.kauth.grant ||
		!req.kauth.grant.access_token ||
		!req.kauth.grant.access_token.content
	) {
		return next();
	}
	const profile = req.kauth.grant.access_token.content;
	if (validateEmail(profile.preferred_username)) {
		profile.preferred_username = UsernameGenerator.generateUsername();
	}
	return User.findOrCreate({
		where: { email: profile.email },
		defaults: {
			keycloakId: profile.sub,
			username: profile.preferred_username
		}
	})
		.spread((user, created) => {
			if (created) {
				console.info(`Created user ${user.username}`);
			}
			req.user = user.get();
			return next();
		})
		.catch(err => {
			console.error(err);
			return next();
		});
};

module.exports = { getUserInfo };
