import React from 'react';
import { shallow } from 'enzyme';
import { Ships } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Ships />);
  expect(renderedComponent.find('.admin-ships').length).toBe(1);
});
