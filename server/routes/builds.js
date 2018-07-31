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
    attributes: ['id', 'updatedAt', 'createdAt', 'shortid', 'title', 'description', 'author','imageURL', 'coriolisShip']
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
    attributes: ['id', 'updatedAt', 'createdAt', 'shortid', 'title', 'description', 'author', 'imageURL', 'coriolisShip']
  })
    .then(ships => {
      ships.allowedToEdit = false;
      if (req.user) {
        if (req.user.id === ships.id) {
          ships.allowedToEdit = true;
        }
      }
      return res.json(ships);
    })
    .catch(err => {
      console.error(err);
      res.status(500).end();
    })
);

router.post('/update', async (req, res) => {
  if (!req.body || !req.body.updates) {
    return res.status(413).end();
  }
  const data = req.body;
  const ship = await Ship.find({
    where: {
      id: data.id
    }
  });
  if (req.user) {
    if (req.user.id === ship.author.id) {
      for (const update in data.updates) {
        if (!data.updates.hasOwnProperty(update)) {
          continue;
        }
        ship[update] = data.updates[update];
        console.log(data.updates[update])

      }
      return ship.save()
        .then(ship => res.json({
            success: true,
            id: ship.id,
            body: data,
            ship: 'created',
            link: `http://localhost:3000/build/${ship.shortid}`
          })
        );
    } else {
      console.log(req.user);
      console.log(ship.id)
    }
  }
});

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
