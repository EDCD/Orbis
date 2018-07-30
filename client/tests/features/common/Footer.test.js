import React from 'react';
import { shallow } from 'enzyme';
import { Footer } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Footer />);
  expect(renderedComponent.find('.common-footer').length).toBe(1);
});
