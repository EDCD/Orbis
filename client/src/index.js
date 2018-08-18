import React from 'react';
import {AppContainer} from 'react-hot-loader';
import {render} from 'react-dom';
import configStore from './common/configStore';
import routeConfig from './common/routeConfig';
import Root from './Root';

const store = configStore();

function renderApp(app) {
	render(
		<AppContainer>
			{app}
		</AppContainer>,
		document.getElementById('root')
	);
}

// Check that service workers are registered
if ('serviceWorker' in navigator) {
	// Use the window load event to keep the page load performant
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/service-worker.js');
	});
}

renderApp(<Root store={store} routeConfig={routeConfig}/>);

// Hot Module Replacement API
/* istanbul ignore if  */
if (module.hot) {
	module.hot.accept('./common/routeConfig', () => {
		const nextRouteConfig = require('./common/routeConfig').default; // eslint-disable-line
		renderApp(<Root store={store} routeConfig={nextRouteConfig}/>);
	});
	module.hot.accept('./Root', () => {
		const nextRoot = require('./Root').default; // eslint-disable-line
		renderApp(<Root store={store} routeConfig={routeConfig}/>);
	});
}
