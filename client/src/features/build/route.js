// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
  Build,
} from './';

export default {
  path: 'build',
  name: 'Build',
  childRoutes: [
    { path: ':id', name: 'Build', component: Build, isIndex: true },
  ],
};
