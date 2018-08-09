import React from 'react';
import { shallow } from 'enzyme';
import { DefaultPage } from '../../../src/features/contact/DefaultPage';

describe('contact/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      contact: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.contact-default-page').length
    ).toBe(1);
  });
});
