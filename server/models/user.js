'use strict';
const bcrypt = require('bcrypt');

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
	User.generateHash = password => bcrypt.hash(password, bcrypt.genSaltSync(8));

	function validPassword(password) {
		return bcrypt.compare(password, this.password);
	}

	User.prototype.validPassword = validPassword;
	return User;
};
