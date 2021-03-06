'use strict';

module.exports = (sequelize, DataType) => {
	return sequelize.define(
		'Announcement',
		{
			id: {
				type: DataType.UUID,
				defaultValue: DataType.UUIDV1,
				primaryKey: true
			},
			expiresAt: {
				type: DataType.DATE
			},
			message: {
				type: DataType.STRING
			},
			showInCoriolis: {
				type: DataType.BOOLEAN
			}
		},
		{
			indexes: [
				{ fields: ['expiresAt'] },
				{ fields: ['showInCoriolis'] }
			],
			freezeTableName: true
		}
	);
};
