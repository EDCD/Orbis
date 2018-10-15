module.exports = {
	pwa: {
		name: 'Orbis.zone',
		themeColor: '#4DBA87',
		msTileColor: '#000000',
		appleMobileWebAppCapable: 'yes',
		appleMobileWebAppStatusBarStyle: 'black',

		workboxPluginMode: 'InjectManifest',
		workboxOptions: {
			// swSrc is required in InjectManifest mode.
			swSrc: 'public/sw.js',
			swDest: 'service-worker.js'
			// ...other Workbox options...
		}
	},
	devServer: {
		proxy: 'http://localhost:3030',
		disableHostCheck: true,
		host: '0.0.0.0'
	}
};
