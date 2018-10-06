import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/build/:id',
			name: 'build',
			// Route level code-splitting
			// this generates a separate chunk (build.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "build" */ './views/Build.vue')
		},
		{
			path: '/edit/:id',
			name: 'editbuild',
			// Route level code-splitting
			// this generates a separate chunk (build.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "editbuild" */ './views/EditBuild.vue')
		},
		{
			path: '/profile/:username',
			name: 'profile',
			// Route level code-splitting
			// this generates a separate chunk (build.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "profile" */ './views/Profile.vue')
		},

		{
			path: '*',
			name: '404',
			// Route level code-splitting
			// this generates a separate chunk (build.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "profile" */ './views/404.vue')
		}
	]
});
