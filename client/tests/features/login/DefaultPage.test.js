import React from 'react';
import { shallow } from 'enzyme';
import { DefaultPage } from '../../../src/features/login/DefaultPage';

describe('login/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      login: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.login-default-page').length
    ).toBe(1);
  });
});
