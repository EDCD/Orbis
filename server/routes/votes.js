const express = require('express');
const models = require('../models');

const router = express.Router();

router.post('/:type', (req, res) => {
  if (!req.body) {
    return res.status(413).end();
  }
  const author = JSON.parse(JSON.stringify(req.user));
  const body = JSON.parse(JSON.stringify(req.body));
  models.ShipVote.findOrCreate({
    where: { userId: author.id, shipId: body.shipId },
    defaults: {
      vote: body.type,
      userId: author.id,
      shipId: body.shipId,
      timeRecorded: new Date()
    }
  }).spread((ship, created) => {
    console.log(ship.get({ plain: true }));
    console.log(created);
    return res.json({ created, vote: ship.get({ plain: true }) });
  });
  return res.status(200).end();
});

module.exports = router;
