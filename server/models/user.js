'use strict';

module.exports = (sequelize, DataType) => {
	const User = sequelize.define('User', {
		id: {
			type: DataType.UUID,
			defaultValue: DataType.UUIDV1,
			primaryKey: true
		},
		keycloakId: {
			type: DataType.STRING(255),
			primaryKey: true
		},
		admin: {
			type: DataType.BOOLEAN,
			defaultValue: false
		},
		email: {
			type: DataType.STRING(255),
			unique: true,
			validate: {isEmail: true}
		},
		badges: {
			type: DataType.JSONB
		},
		username: {
			type: DataType.STRING(255),
			unique: true
		},
		imageURL: {
			type: DataType.STRING(255),
			unique: false
		}
	},
	{
		indexes: [
			{fields: ['email']},
			{fields: ['username']},
			{fields: ['id']},
			{fields: ['keycloakId']},
			{fields: ['badges']}
		],
		freezeTableName: true
	});

	return User;
};
