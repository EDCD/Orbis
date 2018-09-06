import React from 'react';
import {shallow} from 'enzyme';
import {Search} from '../../../src/features/home';

it('renders node with correct class name', () => {
	const renderedComponent = shallow(<Search/>);
	expect(renderedComponent.find('.home-search').length).toBe(1);
});
