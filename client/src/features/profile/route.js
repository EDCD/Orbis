// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
	ProfilePage
} from './';

export default {
	path: 'profile',
	name: 'Profile',
	childRoutes: [
		{path: ':username', name: 'Profile page', component: ProfilePage, isIndex: true},
		{path: 'me', name: 'Profile page', component: ProfilePage, isIndex: true}
	]
};
