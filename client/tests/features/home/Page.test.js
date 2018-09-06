import React from 'react';
import {shallow} from 'enzyme';
import {Page} from '../../../src/features/home/Page';

describe('home/Page', () => {
	it('renders node with correct class name', () => {
		const props = {
			home: {},
			actions: {}
		};
		const renderedComponent = shallow(<Page {...props}/>);

		expect(renderedComponent.find('.home-page').length).toBe(1);
	});
});
