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
				type: DataType.TEXT,
				defaultValue: shortid.generate,
				primaryKey: false
			},
			coriolisShip: {
				type: DataType.JSONB
			},
			ShipName: {
				type: DataType.TEXT
			},
			imageURL: {
				type: DataType.TEXT
			},
			proxiedImage: {
				type: DataType.TEXT
			},
			author: {
				type: DataType.JSONB
			},
			title: {
				type: DataType.TEXT
			},
			Ship: {
				type: DataType.TEXT
			},
			url: {
				type: DataType.TEXT
			},
			description: {
				type: DataType.TEXT
			},
			createdAt: {
				type: DataType.DATE
			},
			category: {
				type: DataType.TEXT
			},
			updatedAt: {
				type: DataType.DATE
			},
			privacy: {
				type: DataType.ENUM('public', 'owner', 'shared'),
				defaultValue: 'public'
			},
			sharedAccounts: {
				type: DataType.ARRAY(DataType.TEXT),
				defaultValue: []
			},
			sharedAccountUsernames: {
				type: DataType.ARRAY(DataType.TEXT),
				defaultValue: []
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
			},
			featured: {
				type: DataType.BOOLEAN
			},
			featuredon: {
				type: DataType.DATE
			}
		},
		{
			indexes: [
				{ fields: ['id'] },
				{ fields: ['updatedAt'] },
				{ fields: ['author'] },
				{ fields: ['privacy'] },
				{ fields: ['featured'] },
				{ fields: ['privacy', 'author'] },
				{ fields: ['sharedAccounts'] },
				{ fields: ['category'] },
				{ fields: ['createdAt'] },
				{ fields: ['shortid'] },
				{ fields: ['Ship'] },
				// Add a FULLTEXT index
				{
					type: 'FULLTEXT',
					name: 'text_idx',
					fields: ['description', 'title']
				}
			],
			freezeTableName: true
		}
	);

	Ship.beforeCreate(ship => {
		delete ship.author.family_name;
		delete ship.author.given_name;
		ship.imageURL = `https://orbis.zone/${ship.coriolisShip.id}.jpg`;

		ship.proxiedImage =
			`${process.env.IMGPROXY_BASE_URL}/resize?url=${
				ship.imageURL
			}&width={{WIDTH}}` ||
			`https://orbis.zone/imgproxy/resize?url=${
				ship.imageURL
			}&width={{WIDTH}}`;
	});

	return Ship;
};
