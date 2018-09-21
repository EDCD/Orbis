import React from 'react';
import { shallow } from 'enzyme';
import { ProfilePage } from '../../../src/features/profile/ProfilePage';

describe('profile/ProfilePage', () => {
  it('renders node with correct class name', () => {
    const props = {
      profile: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ProfilePage {...props} />
    );

    expect(
      renderedComponent.find('.profile-profile-page').length
    ).toBe(1);
  });
});
