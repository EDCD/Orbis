const ImageminPlugin = require('imagemin-webpack-plugin').default;
const glob = require('glob');

module.exports = {
	configureWebpack: {
		plugins: [
			new ImageminPlugin({
				disable: process.env.NODE_ENV !== 'production', // Disable during development
				pngquant: {
					quality: '95-100'
				},
				jpegtran: { progressive: true },
				externalImages: {
					context: 'public', // Important! This tells the plugin where to "base" the paths at
					sources: glob.sync('public/*.jpg'),
					destination: 'dist',
					fileName: '[path][name].[ext]' // (filePath) => filePath.replace('jpg', 'webp') is also possible
				}
			})
		]
	},
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
