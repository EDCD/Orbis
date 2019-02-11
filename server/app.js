const path = require('path');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const models = require('./models');
const responseTime = require('response-time');
const Keycloak = require('keycloak-connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api-spec.json');
const SQLiteStore = require('connect-sqlite3')(session);
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

Auth0Strategy.prototype.authorizationParams = function(options) {
	var options = options || {};

	var params = {};
	if (options.connection && typeof options.connection === 'string') {
		params.connection = options.connection;
	}
	if (options.audience && typeof options.audience === 'string') {
		params.audience = options.audience;
	}
	if (options.prompt && typeof options.prompt === 'string') {
		params.prompt = options.prompt;
	}
	if (options.login_hint && typeof options.login_hint === 'string') {
		params.login_hint = options.login_hint;
	}

	if (options.scope && typeof options.scope === 'string') {
		params.scope = options.scope;
	}

	return params;
};

const strategy = new Auth0Strategy(
	{
		domain: process.env.AUTH0_DOMAIN,
		clientID: process.env.AUTH0_CLIENT_ID,
		issuer: 'auth.willb.info',
		scope: 'openid email profile app_metadata user_metadata roles',
		clientSecret: process.env.AUTH0_CLIENT_SECRET,
		callbackURL:
			process.env.AUTH0_CALLBACK_URL ||
			'http://localhost:3030/api/callback'
	},
	function(accessToken, refreshToken, extraParams, profile, done) {
		// accessToken is the token to call Auth0 API (not needed in the most cases)
		// extraParams.id_token has the JSON Web Token
		// profile has all the information from the user
		models.User.findOrCreate({
			where: { id: profile.id },
			defaults: {
				nickname: profile.nickname,
				admin: profile._json.app_metadata.admin || false,
				email: profile.emails[0].value
			}
		})
			.spread((user, created) => {
				if (created) {
					console.info(`Created user ${user.nickname}`);
					console.info(JSON.stringify(user));
				}
			})
			.catch(err => {
				console.error(err);
			});
		return done(null, profile);
	}
);
passport.use(strategy);

const { Ship } = models;

process.on('unhandledRejection', (reason, p) => {
	console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', reason => {
	console.error('Uncaught exception:', reason);
});

const app = express();
app.use(responseTime());
if (process.env.NODE_ENV === 'production') {
	app.set('trust proxy', true);
}
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: true }));
app.options('*', cors({ credentials: true, origin: true }));
// Uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

const sessionStore = new SequelizeStore({
	db: models.sequelize
});

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			secure: process.env.NODE_ENV === 'production'
		},
		proxy: process.env.NODE_ENV === 'production',
		store: sessionStore,
		rolling: true
	})
);

sessionStore.sync();

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

function secured(req, res, next) {
	if (req.user) {
		return next();
	}
	req.session.returnTo = req.originalUrl;
	res.redirect('/api/unauthorized');
}

function securedAdmin(req, res, next) {
	if (
		req.user &&
		req.user._json &&
		req.user._json.app_metadata &&
		req.user._json.app_metadata.admin === true
	) {
		return next();
	}
	req.session.returnTo = req.originalUrl;
	res.redirect('/api/auth');
}

exports.secured = secured;
exports.securedAdmin = securedAdmin;

app.get('/', (req, res) => {
	return res.status(200).end();
});

const index = require('./routes');
const users = require('./routes/users');
const builds = require('./routes/builds');
const votes = require('./routes/votes');
const webhooks = require('./routes/webhooks');
const admin = require('./routes/admin');

app.get('/api/build/:id/og', (req, res) =>
	Ship.find({
		where: { shortid: req.params.id },
		attributes: [
			'id',
			'updatedAt',
			'createdAt',
			'shortid',
			'title',
			'description',
			'author',
			'imageURL',
			'url',
			'proxiedImage'
		]
	})
		.then(ship => {
			if (!ship) {
				return res.json({});
			}
			const uri =
				req.protocol +
				'://' +
				req.get('host') +
				req.originalUrl.replace('/og', '');
			let html = '<!doctype html>\n';
			html += `<html lang="en"><head>`;
			html += `<title>Orbis.zone</title>`;
			html += `<meta name="author" content="${ship.author.username}"/>`;
			html += `<meta name="og:title" content="${ship.title}"/>`;
			html += `<meta name="og:description" content="${
				ship.description
			}"/>`;
			html += `<meta name="og:image" content="${ship.imageURL}"/>`;
			html += `<meta name="og:url" content="${uri}"/>`;
			html += `<meta property="og:type" content="website"/>`;
			html += `<meta name="twitter:card" content="summary_large_image">`;
			html += `<link type="application/json+oembed" href="https://orbis.zone/api/oembed.json" />`;
			html += `<meta http-equiv="refresh" content="0;url='${uri}'"/>`;
			html += `</head>`;
			html += `<body/>`;
			html += `</html>`;
			return res.send(html);
		})
		.catch(err => {
			console.error(err);
			res.status(500).end();
		})
);

app.get('/api/og', (req, res) => {
	const uri =
		req.protocol +
		'://' +
		req.get('host') +
		req.originalUrl.replace('/og', '');
	let html = '<!doctype html>\n';
	html += `<html lang="en"><head>`;
	html += `<title>Orbis.zone</title>`;
	html += `<meta name="author" content="Willyb321"/>`;
	html += `<meta name="og:title" content="Orbis.zone"/>`;
	html += `<meta name="og:description" content="It's time to dock"/>`;
	html += `<meta name="og:image" content="https://orbis.zone/orbis.png"/>`;
	html += `<meta name="og:url" content="${uri}"/>`;
	html += `<meta property="og:type" content="website"/>`;
	html += `<meta name="twitter:card" content="summary_large_image">`;
	html += `<link type="application/json+oembed" href="https://orbis.zone/api/oembed.json" />`;
	html += `<meta http-equiv="refresh" content="0;url='${uri}'"/>`;
	html += `</head>`;
	html += `<body/>`;
	html += `</html>`;
	return res.send(html);
});

app.get('/api/oembed.json', (req, res) => {
	const json = {
		author_name: "It's time to dock",
		author_url: 'https://orbis.zone',
		provider_name: 'Orbis.zone is the build repository for Coriolis.io.',
		provider_url: 'https://orbis.zone'
	};
	return res.send(json);
});

app.use('/api', index);
app.use('/api/builds', builds);
app.use('/api/users', users);
app.use('/api/likes', votes);
app.use('/api/webhook', webhooks);
app.use('/api/admin', admin);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
