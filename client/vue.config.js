module.exports = {
	pwa: {
		name: 'Orbis.zone'
	},
	devServer: {
		proxy: 'http://localhost:3030',
		disableHostCheck: true,
		host: '0.0.0.0'
	}
};
