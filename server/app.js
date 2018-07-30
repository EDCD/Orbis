const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes');
const passport = require('./passport');
const users = require('./routes/users');
const builds = require('./routes/builds');
const models = require('./models');
const session = require('express-session');
const cors = require('cors');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const {User, sequelize} = models;
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
  // send entire app down. Process manager will restart it
});

process.on('uncaughtException', reason => {
  console.error('Uncaught exception:', reason);
  // send entire app down. Process manager will restart it
});
const sessionStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 7 * 24 * 60 * 60 * 1000
});


const app = express();
app.use(cors({ credentials: true, origin: true }));
app.options('*', cors({ credentials: true, origin: true }));
// Uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
  })
);

app.use(passport.initialize());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => done(null, user));

app.use(passport.session());

function isAuthenticated(req, res, next) {
  if (req.user) return next();
  return res.status(401).json({
    error: 'User not authenticated'
  });
}

sessionStore.sync();

app.get('/', (req, res) => {
  return res.status(200).end();
});

app.use('/api', index);
app.use('/api/builds', builds);
app.use('/api/users', users);

module.exports = app;