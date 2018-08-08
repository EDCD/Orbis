const Keycloak = require('keycloak-connect');
const session = require('express-session');
const models = require('./models');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const {sequelize, User} = models;
const sessionStore = new SequelizeStore({
	db: sequelize,
	checkExpirationInterval: 15 * 60 * 1000,
	expiration: 7 * 24 * 60 * 60 * 1000
});

const keycloak = new Keycloak({store: sessionStore/*, scope: 'offline_access'*/}, null);

const getUserInfo = (req, res, next) => {
	if (req.session) {
		return next();
	}
	if (!req.kauth || !req.kauth.grant) {
		return next();
	}
	if (!req.kauth.grant.access_token || !req.kauth.grant.access_token.content) {
		return next();
	}
	const profile = req.kauth.grant.access_token.content;
	return User.findOrCreate({
		where: {email: profile.email}, defaults: {
			keycloakId: profile.sub,
			username: profile.preferred_username
		}
	}).spread((user, created) => {
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

module.exports = {keycloak, getUserInfo};
// const rp = require('request-promise-native');
//
// class Keycloak {
// 	constructor(baseUrl, clientId, realm, username, password, clientSecret, managementRealmId) {
// 		this.baseUrl = baseUrl;
// 		this.clientId = clientId;
// 		this.realm = realm;
// 		this.clientSecret = clientSecret;
// 		this.managementRealmId = managementRealmId;
// 		this.username = username;
// 		this.password = password;
// 		this.getToken(username, password);
// 	}
//
// 	getToken(username, password) {
// 		return rp(`${this.baseUrl}/auth/realms/${this.realm}/protocol/openid-connect/token`, {
// 			form: {
// 				username,
// 				password,
// 				client_id: this.clientId,
// 				client_secret: this.clientSecret,
// 				grant_type: 'password'
// 			},
//
// 			method: 'POST',
// 			json: true
// 		})
// 			.then(data => {
// 				this.accessToken = data.access_token;
// 				return data;
// 			})
// 			.catch(err => {
// 				console.error(err);
// 				return err;
// 			});
// 	}
//
// 	async userHasRole(userId, roleId) {
// 		await this.getToken(this.username, this.password);
// 		return rp(`${this.baseUrl}/auth/admin/realms/${this.realm}/users/${userId}/role-mappings/clients/${this.managementRealmId}`, {
// 			headers: {
// 				Authorization: `bearer ${this.accessToken}`
// 			},
// 			json: true
// 		})
// 			.then(data => {
// 				return data.find(e => e.id === roleId);
// 			})
// 			.catch(err => {
// 				console.error(err);
// 				return err;
// 			});
// 	}
// }

// module.exports = new Keycloak(process.env.KEYCLOAK_HOST, 'realm-management', 'Orbis', process.env.KEYCLOAK_USER, process.env.KEYCLOAK_PW, process.env.KEYCLOAK_MANAGEMENT_SECRET, process.env.KEYCLOAK_MANAGEMENT_ID);
