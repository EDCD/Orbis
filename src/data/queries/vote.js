/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import { Ship, ShipVote } from '../models';
import * as express from 'express';
import * as _ from 'lodash';
import { isAuthenticated } from '../../server';

const router = express.Router();

router.post('/updatevote/:vote/:shipId', isAuthenticated, (req, res) => {
  const author = _.cloneDeep(JSON.parse(req.user));
  const body = _.cloneDeep(req.params);

  return ShipVote.upsert({
    userId: author.id,
    shipId: body.shipId,
    timeRecorded: new Date(),
    vote: body.vote
  }).then(async created => {
    const count = await ShipVote.sum('vote', {
      where: {
        shipId: body.shipId
      }
    });
    return res.json({ created, count });
  });
});

export default router;
