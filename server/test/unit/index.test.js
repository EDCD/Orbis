'use strict';

const expect = require('expect.js');

describe('models/index', () => {
	it('returns the task model', () => {
		const models = require('../../models');
		expect(models.Task).to.be.ok();
	});

	it('returns the user model', () => {
		const models = require('../../models');
		expect(models.User).to.be.ok();
	});
});
