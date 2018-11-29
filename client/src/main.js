import '@babel/polyfill';
import Vue from 'vue';
import './plugins/axios';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import bugsnag from '@bugsnag/js';
import bugsnagVue from '@bugsnag/plugin-vue';

Vue.config.productionTip = false;

const bugsnagClient = bugsnag({
	apiKey: '57ad5ae01e09ce05b3961efb2e3f010d'
});

window.bugsnagClient = bugsnagClient;
bugsnagClient.use(bugsnagVue, Vue);

window.App = new Vue({
	router,
	store,
	render: h => h(App)
});

window.App.$mount('#app');

