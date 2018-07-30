'use strict';

const expect = require('expect.js');

describe('models/task', () => {
	before(() => {
		return require('../../models').sequelize.sync();
	});

	beforeEach(function () {
		this.User = require('../../models').User;
		this.Task = require('../../models').Task;
	});

	describe('create', () => {
		it('creates a task', function () {
			return this.User.create({username: 'johndoe'}).bind(this).then(function (user) {
				return this.Task.create({title: 'a title', UserId: user.id}).then(task => {
					expect(task.title).to.equal('a title');
				});
			});
		});
	});
});
