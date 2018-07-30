import React from 'react';
import { shallow } from 'enzyme';
import { ShipCard } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ShipCard />);
  expect(renderedComponent.find('.home-ship-card').length).toBe(1);
});
