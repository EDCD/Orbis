import React from 'react';
import {shallow} from 'enzyme';
import {UiButton} from '../../../src/features/home';

it('renders node with correct class name', () => {
	const renderedComponent = shallow(<UiButton/>);
	expect(renderedComponent.find('.home-ui-button').length).toBe(1);
});
