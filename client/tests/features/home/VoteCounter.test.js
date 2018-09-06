import React from 'react';
import {shallow} from 'enzyme';
import {VoteCounter} from '../../../src/features/home';

it('renders node with correct class name', () => {
	const renderedComponent = shallow(<VoteCounter/>);
	expect(renderedComponent.find('.home-vote-counter').length).toBe(1);
});
