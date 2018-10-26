const path = require('path');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const models = require('./models');
const Keycloak = require('keycloak-connect');
const {getUserInfo} = require('./keycloak');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api-spec.json');
const SQLiteStore = require('connect-sqlite3')(session);

const {sequelize, Ship} = models;

process.on('unhandledRejection', (reason, p) => {
	console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', reason => {
	console.error('Uncaught exception:', reason);
});

const app = express();
if (process.env.NODE_ENV === 'production') {
	app.set('trust proxy', true);
}
app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors({credentials: true, origin: true}));
app.options('*', cors({credentials: true, origin: true}));
// Uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

// const sessionStore = new SequelizeStore({
// 	db: sequelize,
// 	checkExpirationInterval: 15 * 60 * 1000,
// 	expiration: 30 * 24 * 60 * 60 * 1000
// });
// sessionStore.sync();
const sessionStore = new SQLiteStore();

const keycloak = new Keycloak({store: sessionStore, scope: 'offline_access'}, null);

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

exports.keycloak = keycloak;

app.use(keycloak.middleware({logout: '/api/logout'}));
app.use(getUserInfo);

app.get('/', (req, res) => {
	return res.status(200).end();
});

const index = require('./routes');
const users = require('./routes/users');
const builds = require('./routes/builds');
const votes = require('./routes/votes');
const webhooks = require('./routes/webhooks');
const admin = require('./routes/admin');

app.get('/build/:id/og', (req, res) =>
	Ship.find({
		where: {shortid: req.params.id},
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
			html += `<html><head>`;
			html += `<meta name="author" content="${ship.author.username}"/>`;
			html += `<meta name="og:title" content="${ship.title}"/>`;
			html += `<meta name="og:description" content="${ship.description}"/>`;
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

app.get('/og', (req, res) => {
	const uri =
		req.protocol + '://' + req.get('host') + req.originalUrl.replace('/og', '');
	let html = '<!doctype html>\n';
	html += `<html><head>`;
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
		author_name: 'It\'s time to dock',
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
