import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import store from './store';

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
			path: '/about',
			name: 'about',
			// Route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
		},
		{
			path: '/contact',
			name: 'contact',
			// Route level code-splitting
      // this generates a separate chunk (contact.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "contact" */ './views/Contact.vue')
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
      // this generates a separate chunk (editbuild.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "editbuild" */ './views/EditBuild.vue')
		},
		{
			path: '/profile/:username',
			name: 'profile',
			// Route level code-splitting
      // this generates a separate chunk (profile.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "profile" */ './views/Profile.vue')
		},
		{
			path: '/admin',
			name: 'admin',
			async beforeEnter(to, from, next) {
				await store.dispatch('checkAuth');
				if (store.state.Common.admin === true) {
					next();
				} else {
					next(false);
				}
			},
			// Route level code-splitting
      // this generates a separate chunk (admin.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "admin" */ './views/Admin.vue')
		},
		{
			path: '*',
			name: '404',
			// Route level code-splitting
      // this generates a separate chunk (404.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "404" */ './views/404.vue')
		}
	]
});
