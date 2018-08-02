// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {Build, EditBuild} from '.';

export default {
	path: 'build',
	childRoutes: [
		{
			path: ':id', name: 'build', component: Build, isIndex: false
		},
		{path: ':id/edit', name: 'Edit Build', component: EditBuild}
	]
};
