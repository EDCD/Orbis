'use strict';
module.exports = (sequelize, DataType) => {
  const ShipVote = sequelize.define(
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
	return ShipVote;
};
