import React from 'react';
import {shallow} from 'enzyme';
import {ButtonBox} from '../../../src/features/home';

it('renders node with correct class name', () => {
	const renderedComponent = shallow(<ButtonBox />);
	expect(renderedComponent.find('.home-button-box').length).toBe(1);
});
