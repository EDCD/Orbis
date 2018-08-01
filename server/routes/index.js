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


// start authentication request
// options [optional], extra authentication parameters
router.get('/auth', passport.authenticate('oidc'));
router.get('/logout', (req, res) => {
  req.logout();
  res.json({loggedOut: true})
});

// authentication callback
router.get('/auth/cb', passport.authenticate('oidc', { successRedirect: '/', failureRedirect: '/api/login' }));

router.get('/checkauth', isAuthenticated, (req, res) => {
  return res.status(200).json({status: 'Login successful!'})
});

module.exports = router;
