'use strict';

const Bluebird = require('bluebird');
const expect = require('expect.js');
const request = require('supertest');
const app = require('../../app');

describe('user creation page', () => {
	before(() => {
		return require('../../models').sequelize.sync();
	});

	beforeEach(function () {
		this.models = require('../../models');

		return Bluebird.all([
			this.models.Task.destroy({truncate: true}),
			this.models.User.destroy({truncate: true})
		]);
	});

	it('loads correctly', done => {
		request(app).get('/').expect(200, done);
	});

	it('lists a user if there is one', function (done) {
		this.models.User.create({username: 'johndoe'}).then(() => {
			request(app).get('/').expect(/johndoe/, done);
		});
	});

	it('lists the tickets for the user if available', function (done) {
		this.models.User.create({username: 'johndoe'}).bind(this).then(function (user) {
			return this.models.Task.create({title: 'johndoe task', UserId: user.id});
		}).then(() => {
			request(app).get('/').expect(/johndoe task/, done);
		});
	});
});
