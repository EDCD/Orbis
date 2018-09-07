import React from 'react';
import { shallow } from 'enzyme';
import { Users } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Users />);
  expect(renderedComponent.find('.admin-users').length).toBe(1);
});
