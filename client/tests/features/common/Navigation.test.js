import React from 'react';
import {shallow} from 'enzyme';
import {Navigation} from '../../../src/features/common';

it('renders node with correct class name', () => {
	const renderedComponent = shallow(<Navigation/>);
	expect(renderedComponent.find('.common-navigation').length).toBe(1);
});
