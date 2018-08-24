'use strict';
const shortid = require('shortid');

module.exports = (sequelize, DataType) => {
	const Ship = sequelize.define(
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
				primaryKey: false
			},
			coriolisShip: {
				type: DataType.JSONB
			},
			ShipName: {
				type: DataType.STRING
			},
			imageURL: {
				type: DataType.STRING
			},
			proxiedImage: {
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
			url: {
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
			likes: {
				type: DataType.INTEGER,
				defaultValue: 0
			},
			Modules: {
				type: DataType.JSONB
			},
			stats: {
				type: DataType.JSONB
			}
		},
		{
			indexes: [
				{fields: ['id']},
				{fields: ['updatedAt']},
				{fields: ['createdAt']},
				{fields: ['shortid']},
				{fields: ['Ship']},
				// Add a FULLTEXT index
				{type: 'FULLTEXT', name: 'text_idx', fields: ['description', 'title']}
			],
			freezeTableName: true
		}
	);

	Ship.beforeCreate(ship => {
		delete ship.author.family_name;
		delete ship.author.given_name;
		ship.imageURL = `https://orbis.zone/${ship.coriolisShip.id}.jpg`;
		ship.proxiedImage = `${process.env.IMGPROXY_BASE_URL}/{OPTIONS}/${ship.imageURL}` || `https://orbis.zone/imgproxy/{OPTIONS}/https://orbis.zone/${ship.coriolisShip.id}.jpg}`;
	});

	return Ship;
};
