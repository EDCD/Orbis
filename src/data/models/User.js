/* eslint-disable no-param-reassign */
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import bcrypt from 'bcrypt';

import DataType from 'sequelize';
import Model from '../sequelize';

const User = Model.define(
  'User',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true
    },

    email: {
      type: DataType.STRING(255),
      unique: true,
      validate: { isEmail: true }
    },
    badges: {
      type: DataType.JSONB
    },
    username: {
      type: DataType.STRING(255),
      unique: true
    },
    password: { type: DataType.STRING(255) }
  },
  {
    indexes: [
      { fields: ['email'] },
      { fields: ['username'] },
      { fields: ['id'] },
      { fields: ['badges'] }
    ]
  }
);

User.generateHash = password => bcrypt.hash(password, bcrypt.genSaltSync(8));

function validPassword(password) {
  return bcrypt.compare(password, this.password);
}

User.prototype.validPassword = validPassword;

User.beforeCreate(user =>
  bcrypt
    .hash(user.password, bcrypt.genSaltSync(8))
    .then(hash => {
      user.password = hash;
    })
    .catch(err => {
      throw err;
    })
);

export default User;
