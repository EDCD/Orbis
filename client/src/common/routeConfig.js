import {App} from '../features/home';
import {PageNotFound} from '../features/common';
import homeRoute from '../features/home/route';
import commonRoute from '../features/common/route';
import buildRoute from '../features/build/route';
import loginRoute from '../features/login/route';
import registerRoute from '../features/register/route';
import aboutRoute from '../features/about/route';
import contactRoute from '../features/contact/route';

// NOTE: DO NOT CHANGE the 'childRoutes' name and the declaration pattern.
// This is used for Rekit cmds to register routes config for new features, and remove config when remove features, etc.
const childRoutes = [
	homeRoute,
	commonRoute,
	buildRoute,
	loginRoute,
	registerRoute,
  aboutRoute,
  contactRoute
];

const routes = [{
	path: '/',
	component: App,
	childRoutes: [
		...childRoutes,
		{path: '*', name: 'Page not found', component: PageNotFound}
	].filter(r => r.component || (r.childRoutes && r.childRoutes.length > 0))
}];

// Handle isIndex property of route config:
//  Dupicate it and put it as the first route rule.
function handleIndexRoute(route) {
	if (!route.childRoutes || !route.childRoutes.length) {
		return;
	}

	const indexRoute = route.childRoutes.find(child => child.isIndex);
	if (indexRoute) {
		const first = {...indexRoute};
		first.path = '';
		first.exact = true;
		first.autoIndexRoute = true; // Mark it so that the simple nav won't show it.
		route.childRoutes.unshift(first);
	}
	route.childRoutes.forEach(handleIndexRoute);
}

routes.forEach(handleIndexRoute);
export default routes;
