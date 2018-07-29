import { Ship } from '../models';
import * as express from 'express';
import ShipVote from '../models/ShipVote';

const router = express.Router();

router.post('/', (req, res) => {
  const { order, field } = req.body;
  return Ship.findAll({
    order: [[field || 'updatedAt', order || 'DESC']]
  })
    .then(async ships => {
      const promises = [];
      ships.forEach(ship => {
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
        ships[i].likes = data[i];
      }
      return res.json(ships);
    })
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});

router.get('/:id', (req, res) =>
  Ship.find({ where: { shortid: req.params.id } })
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

export default router;
