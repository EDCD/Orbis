import React from 'react';
import {shallow} from 'enzyme';
import {UiCard} from '../../../src/features/home';

it('renders node with correct class name', () => {
	const renderedComponent = shallow(<UiCard/>);
	expect(renderedComponent.find('.home-ui-card').length).toBe(1);
});
