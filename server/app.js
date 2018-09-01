const path = require('path');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const models = require('./models');
const {keycloak, getUserInfo} = require('./keycloak');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api-spec.json');

const {sequelize, Ship} = models;

const sessionStore = new SequelizeStore({
	db: sequelize,
	checkExpirationInterval: 15 * 60 * 1000,
	expiration: 7 * 24 * 60 * 60 * 1000
});

process.on('unhandledRejection', (reason, p) => {
	console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', reason => {
	console.error('Uncaught exception:', reason);
});

const app = express();
app.enable('trust proxy');
app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors({credentials: true, origin: true}));
app.options('*', cors({credentials: true, origin: true}));
// Uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: sessionStore
	})
);
app.use(keycloak.middleware({logout: '/api/logout'}));
app.use(getUserInfo);
sessionStore.sync();

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
		attributes: ['id', 'updatedAt', 'createdAt', 'shortid', 'title', 'description', 'author', 'imageURL', 'url', 'proxiedImage', 'coriolisShip']
	})
		.then(ship => {
			if (!ship) {
				return res.json({});
			}
			const uri = req.protocol + '://' + req.get('host') + req.originalUrl.replace('/og', '');
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
