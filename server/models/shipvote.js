'use strict';
module.exports = (sequelize, DataType) => {
	const ShipVote = sequelize.define(
		'ShipVote',
		{
			userId: {
				type: DataType.UUID,
				allowNull: false,
				primaryKey: true
			},
			shipId: {
				type: DataType.UUID,
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
				{fields: ['vote']},
				{fields: ['shipId']},
				{fields: ['userId']}
			],
	  freezeTableName: true
		}
	);
	return ShipVote;
};
