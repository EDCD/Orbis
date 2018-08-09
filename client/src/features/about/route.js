// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
  DefaultPage,
} from './';

export default {
  path: 'about',
  name: 'About',
  childRoutes: [
    { path: '', name: 'Default page', component: DefaultPage, isIndex: true },
  ],
};
