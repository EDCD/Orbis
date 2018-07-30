const express = require('express');
const models = require('../models');
const Op = require('sequelize').Op;
const router = express.Router();
const {User} = models;

router.post('/register', async (req, res) => {
  if (!req.body) {
    return res.status(413).end();
  }
  let user = await User.find({
    where: {
      [Op.or]: [
        {
          email: req.body.email
        },
        {
          username: req.body.username
        }
      ]
    }
  });
  if (user) {
    return res.json({ success: false, error: 'User already exists.' });
  }
  try {
    user = await User.create({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });
  } catch (err) {
    if (err instanceof models.Sequelize.UniqueConstraintError) {
      console.info('User already exists.');
      return res.json({ success: false, error: 'User already exists.' });
    }
    console.error(err);
    console.error(err.message);
  }

  return res.json({ success: true, user: 'created' });
});

module.exports = router;
