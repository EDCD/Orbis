'use strict';

module.exports = (sequelize, DataType) => {
	return sequelize.define(
		'User',
		{
			id: {
				type: DataType.TEXT,
				primaryKey: true,
				unique: true
			},
			admin: {
				type: DataType.BOOLEAN,
				defaultValue: false
			},
			email: {
				type: DataType.TEXT,
				validate: { isEmail: true }
			},
			badges: {
				type: DataType.JSONB
			},
			nickname: {
				type: DataType.TEXT,
				unique: true
			},
			picture: {
				type: DataType.TEXT
			}
		},
		{
			indexes: [
				{ fields: ['email'] },
				{ fields: ['nickname'] },
				{ fields: ['id'] },
				{ fields: ['badges'] }
			],
			freezeTableName: true
		}
	);
};
