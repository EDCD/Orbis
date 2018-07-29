/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import DataType from 'sequelize';
import Model from '../sequelize';

const ShipVote = Model.define(
  'ShipVote',
  {
    userId: {
      type: DataType.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    shipId: {
      type: DataType.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'ship',
        key: 'id'
      }
    },
    timeRecorded: {
      type: DataType.DATE,
      allowNull: false
    },
    vote: {
      type: DataType.INTEGER(11),
      allowNull: false
    }
  },
  {
    indexes: [
      { fields: ['vote'] },
      { fields: ['shipId'] },
      { fields: ['userId'] }
    ]
  }
);

export default ShipVote;
