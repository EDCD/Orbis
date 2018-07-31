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
  res.status(200).json({});
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/api/',
    usernameField: 'email',
    failureRedirect: '/login'
  }),
  (req, res) => res.redirect('/')
);

router.get('/checkauth', isAuthenticated, (req, res) => {
  return res.status(200).json({status: 'Login successful!'})
});

module.exports = router;
