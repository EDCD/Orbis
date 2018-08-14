// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
  AdminPage,
} from './';

export default {
  path: 'admin',
  name: 'Admin',
  childRoutes: [
    { path: '', name: 'Admin', component: AdminPage, isIndex: true },
  ],
};
