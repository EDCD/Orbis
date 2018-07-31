const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Auth0Strategy = require('passport-auth0');
const models = require('./models');
const Sequelize = require('sequelize');
const { User } = models;
const { Op } = Sequelize;

passport.use(new Auth0Strategy(
  {
    domain: 'gths.au.auth0.com',
    clientID: 'nPS4V07RrUDQLTWYrE0CCujItmZ985Pz',
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3030/api/callback'
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile);
  }
  )
);

module.exports = passport;
