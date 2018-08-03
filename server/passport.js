const passport = require('passport');

const Strategy = require('@exlinc/keycloak-passport');
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
	clientID: process.env.KEYCLOAK_CLIENT_ID,
	clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
	callbackURL: `/api/auth/cb`
});

passport.use(
	'keycloak',
	new Strategy(kcConfig,
		(accessToken, refreshToken, profile, done) => {
			// This is called after a successful authentication has been completed
			// Here's a sample of what you can then do, i.e., write the user to your DB
			// User.findOrCreate({ email: profile.email }, (err, user) => {
			User.findOrCreate({email: profile.email}, (err, user) => {
				if (err) {
					console.error(err);
					return done(null, false, {error: err.message});
				}
				user.keycloakId = profile.keycloakId;
				user.username = profile.username;
				user.badges = user.badges || {};
				user.save((err, savedUser) => done(err, savedUser));
			});
			return done(null, profile);
		}
	)
);

module.exports = passport;
