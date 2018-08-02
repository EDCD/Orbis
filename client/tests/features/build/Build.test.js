import React from 'react';
import {shallow} from 'enzyme';
import {Build} from '../../../src/features/build/Build';

describe('build/Build', () => {
	it('renders node with correct class name', () => {
		const props = {
			build: {},
			actions: {}
		};
		const renderedComponent = shallow(
			<Build {...props} />
		);

		expect(
			renderedComponent.find('.build-build').length
		).toBe(1);
	});
});
