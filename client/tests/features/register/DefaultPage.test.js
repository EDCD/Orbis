import React from 'react';
import { shallow } from 'enzyme';
import { DefaultPage } from '../../../src/features/register/DefaultPage';

describe('register/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      register: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.register-default-page').length
    ).toBe(1);
  });
});
