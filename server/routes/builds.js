const express = require('express');
const models = require('../models');
const { Ship, ShipVote } = models;
const router = express.Router();

router.post('/', (req, res) => {
  const { order, field } = req.body;
  return Ship.findAndCountAll({
    // order: [[field || 'updatedAt', order || 'DESC']],
    limit: req.body.pageSize,
    offset: req.body.offset,
    attributes: ['id', 'updatedAt', 'createdAt', 'shortid', 'title', 'description', 'author', 'coriolisShip']
  })
    .then(async ships => {
      const promises = [];
      ships.rows.forEach(ship => {
        promises.push(
          ShipVote.sum('vote', {
            where: {
              shipId: ship.id
            }
          })
        );
      });
      const data = await Promise.all(promises);
      for (const i in data) {
        if (isNaN(data[i])) {
          data[i] = 0;
        }
        ships.rows[i].likes = data[i];
      }
      return res.json(ships);
    })
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});

router.get('/:id', (req, res) =>
  Ship.find({
    where: { shortid: req.params.id },
    attributes: ['id', 'updatedAt', 'createdAt', 'shortid', 'title', 'description', 'author', 'coriolisShip']
  })
    .then(ships => res.json(ships))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    })
);

router.post('/add', async (req, res) => {
  if (!req.body) {
    return res.status(413).end();
  }
  const data = JSON.parse(JSON.stringify(req.body));
  data.author = req.user === undefined ? { username: 'Anonymous' } : req.user;
  const ship = await Ship.create(data);
  return res.json({
    success: true,
    id: ship.id,
    body: data,
    ship: 'created',
    link: `http://localhost:3000/build/${ship.shortid}`
  });
});
module.exports = router;
