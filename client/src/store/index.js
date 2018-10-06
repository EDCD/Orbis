import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import {HomeStore as Home, CommonStore as Common, BuildStore as Build, VoteStore as Vote} from './modules';


export default new Vuex.Store({
	state: {},
	modules: {
		Home,
		Build,
		Vote,
		Common
	},
	mutations: {},
	actions: {}
});
