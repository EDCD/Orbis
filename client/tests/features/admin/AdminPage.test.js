import React from 'react';
import {shallow} from 'enzyme';
import {AdminPage} from '../../../src/features/admin/AdminPage';

describe('admin/AdminPage', () => {
	it('renders node with correct class name', () => {
		const props = {
			admin: {},
			actions: {}
		};
		const renderedComponent = shallow(
			<AdminPage {...props}/>
		);

		expect(
			renderedComponent.find('.admin-admin-page').length
		).toBe(1);
	});
});
