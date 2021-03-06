'use strict';

const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '/../config/config.js'))[env];
const db = {};
let sequelize;
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(
		config.database,
		config.username,
		config.password,
		config
	);
}

const UserModel = sequelize.import('./user.js');
db[UserModel.name] = UserModel;

const ShipModel = sequelize.import('./ship.js');
db[ShipModel.name] = ShipModel;

const ShipVoteModel = sequelize.import('./shipvote.js');
db[ShipVoteModel.name] = ShipVoteModel;

const AnnouncementModel = sequelize.import('./announcement.js');
db[AnnouncementModel.name] = AnnouncementModel;

ShipModel.belongsTo(UserModel);
ShipVoteModel.belongsTo(ShipModel);

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
