const express = require('express');
const models = require('../models');
const passport = require('../passport');
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.user) return next();
  return res.status(401).json({
    error: 'User not authenticated'
  });
}

router.get('/', (req, res) => {
  res.status(200).end()
});

const env = {
  AUTH0_CLIENT_ID: 'HSg5eEBr9pxCNInvKFsLILCG8wXgBpza',
  AUTH0_DOMAIN: 'gths.au.auth0.com',
  AUTH0_CALLBACK_URL: 'http://localhost:3000/api/callback'
};


router.get(
  '/login',
  passport.authenticate('auth0', {
    domain: 'gths.au.auth0.com',
    clientID: 'nPS4V07RrUDQLTWYrE0CCujItmZ985Pz',
    redirectUri: process.env.AUTH0_CALLBACK_URL || env.AUTH0_CALLBACK_URL,
    audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
    responseType: 'code',
    scope: 'openid'
  }),
  function(req, res) {
    res.redirect('/');
  }
);

router.get(
  '/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/'
  }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/');
  }
);


router.get('/checkauth', isAuthenticated, (req, res) => {
  return res.status(200).json({status: 'Login successful!'})
});

module.exports = router;
