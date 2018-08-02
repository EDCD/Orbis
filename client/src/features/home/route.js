import {
	Page
} from '.';

export default {
	path: '/',
	name: 'Home',
	childRoutes: [
		{path: '/', name: 'Page', component: Page, isIndex: true}
	]
};
