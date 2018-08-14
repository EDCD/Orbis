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

const {sequelize} = models;

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

app.use('/api', index);
app.use('/api/builds', builds);
app.use('/api/users', users);
app.use('/api/likes', votes);
app.use('/api/webhook', webhooks);
app.use('/api/admin', admin);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
