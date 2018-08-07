const passport = require('passport');

const Strategy = require('@exlinc/keycloak-passport');
const refresh = require('passport-oauth2-refresh');
const config = require('@exlinc/keycloak-passport/configuration');
const Sequelize = require('sequelize');
const models = require('./models');

const {User} = models;
const {Op} = Sequelize;

const kcConfig = new config({
	host: process.env.KEYCLOAK_HOST,
	realm: process.env.KEYCLOAK_REALM,
	clientID: process.env.KEYCLOAK_CLIENT_ID,
	clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
	callbackURL: `/api/auth/cb`
});
kcConfig.update({
	host: process.env.KEYCLOAK_HOST,
	realm: process.env.KEYCLOAK_REALM,
	authorizationParams: {scope: 'offline_access'},
	clientID: process.env.KEYCLOAK_CLIENT_ID,
	clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
	callbackURL: `/api/auth/cb`
});

const strategy = new Strategy(kcConfig,
	(accessToken, refreshToken, profile, done) => {
		// This is called after a successful authentication has been completed
		// Here's a sample of what you can then do, i.e., write the user to your DB
		// User.findOrCreate({ email: profile.email }, (err, user) => {
		return User.findOrCreate({
			where: {email: profile.email}, defaults: {
				keycloakId: profile.keycloakId,
				username: profile.username
			}
		}).spread((user, created) => {
			if (created) {
				console.info(`Created user ${user.username}`);
			}
			return done(null, user.get());
		})
			.catch(err => {
				if (err) {
					console.error(err);
					return done(null, false, {error: err.message});
				}
			});
	}
);

passport.use('keycloak', strategy);

refresh.use(strategy);

module.exports = passport;

exports.refresh = refresh;
