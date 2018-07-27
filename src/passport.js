/* eslint-disable no-param-reassign */
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Passport.js reference implementation.
 * The database schema used in this sample is available at
 * https://github.com/membership/membership.db/tree/master/postgres
 */

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, UserLogin, UserClaim, UserProfile } from './data/models';
import config from './config';
import * as Sequelize from 'sequelize';


const { Op } = Sequelize;

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
    User.find({
      where: {
        [Op.or]: [
          {
            email: username
          },
          {
            username
          }
        ]
      },
      attributes: ['id', 'email', 'username', 'password']
    })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, JSON.stringify(user));
      })
      .catch(err => {
        console.error(err);
        return done(null, false, { message: 'Failed' });
      });
  })
);

export default passport;
