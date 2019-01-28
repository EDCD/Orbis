'use strict';

module.exports = (sequelize, DataType) => {
	const ShipVote = sequelize.define(
		'ShipVote',
		{
			userId: {
				type: DataType.TEXT,
				allowNull: false,
				references: {
					model: 'User',
					key: 'id'
				}
			},
			shipId: {
				type: DataType.TEXT,
				allowNull: false,
				primaryKey: true,
				references: {
					model: 'Ship',
					key: 'id'
				}
			},
			timeRecorded: {
				type: DataType.DATE,
				defaultValue: Date.now,
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
				{ fields: ['shipId', 'userId'] },
				{ fields: ['userId'] }
			],
			freezeTableName: true
		}
	);

	function updateVotesColumn(instance) {
		const { Ship } = require('.');
		Ship.findOne({ where: { id: instance.shipId } }).then(async ship => {
			if (!ship) {
				return;
			}
			const likes = await ShipVote.sum('vote', {
				where: {
					shipId: ship.id
				}
			});
			if (isNaN(likes)) {
				ship.likes = instance.vote;
			} else {
				ship.likes = likes;
			}
			ship.save();
		});
	}

	ShipVote.beforeUpsert(updateVotesColumn);

	return ShipVote;
};
