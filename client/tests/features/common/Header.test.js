import React from 'react';
import { shallow } from 'enzyme';
import { Header } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Header />);
  expect(renderedComponent.find('.common-header').length).toBe(1);
});
