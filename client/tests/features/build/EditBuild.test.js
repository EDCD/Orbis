import React from 'react';
import { shallow } from 'enzyme';
import { EditBuild } from '../../../src/features/build';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<EditBuild />);
  expect(renderedComponent.find('.build-edit-build').length).toBe(1);
});
