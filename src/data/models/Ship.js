/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import * as shortid from 'shortid';
import DataType from 'sequelize';
import Model from '../sequelize';

const Ship = Model.define(
  'Ship',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true
    },
    shortid: {
      type: DataType.STRING,
      defaultValue: shortid.generate,
      primaryKey: true
    },
    coriolisShip: {
      type: DataType.JSONB
    },
    ShipName: {
      type: DataType.STRING
    },
    author: {
      type: DataType.JSONB
    },
    title: {
      type: DataType.STRING
    },
    Ship: {
      type: DataType.STRING
    },
    description: {
      type: DataType.STRING
    },
    createdAt: {
      type: DataType.DATE
    },
    updatedAt: {
      type: DataType.DATE
    },
    getHits: DataType.INTEGER,
    Modules: {
      type: DataType.JSONB
    },
    stats: {
      type: DataType.JSONB
    }
  },
  {
    indexes: [
      { fields: ['id'] },
      { fields: ['updatedAt'] },
      { fields: ['createdAt'] },
      { fields: ['shortid'] },
      { fields: ['Ship'] }
    ]
  }
);

Ship.beforeCreate(ship => {
  const author = JSON.parse(ship.author);
  ship.author = {}
  for (const i in author) {
    if (i === 'password' || i === 'email') {
      continue;
    }
    ship.author[i] = author[i];
  }
});

export default Ship;
