import React from 'react';
import { shallow } from 'enzyme';
import { Svg } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Svg />);
  expect(renderedComponent.find('.common-svg').length).toBe(1);
});
