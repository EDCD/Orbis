console.log('Hello from sw.js');

if (workbox) {
	console.log('Yay! Workbox is loaded 🎉');
	workbox.precaching.precacheAndRoute(self.__precacheManifest);

	workbox.routing.registerNavigationRoute('/index.html', {
		blacklist: [new RegExp('/api/')]
	});

	workbox.routing.registerRoute(
		/^\/((?!api).)*$/,
		workbox.strategies.staleWhileRevalidate()
	);

	workbox.routing.registerRoute(
		/\/api(.*)/,
		workbox.strategies.networkOnly()
	);

	workbox.routing.registerRoute(
		new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
		workbox.strategies.cacheFirst({
			cacheName: 'google-fonts',
			plugins: [
				new workbox.expiration.Plugin({
					maxEntries: 30
				}),
				new workbox.cacheableResponse.Plugin({
					statuses: [0, 200]
				})
			]
		})
	);

	workbox.routing.registerRoute(
		/\.(?:png|gif|jpg|jpeg|svg)$/,
		workbox.strategies.cacheFirst({
			cacheName: 'images',
			plugins: [
				new workbox.expiration.Plugin({
					maxEntries: 120,
					maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
				})
			]
		})
	);

	workbox.routing.registerRoute(
		/imgproxy/,
		workbox.strategies.cacheFirst({
			cacheName: 'imgproxy',
			plugins: [
				new workbox.expiration.Plugin({
					maxEntries: 120,
					maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
				})
			]
		})
	);

	try {
		workbox.googleAnalytics.initialize();
	} catch (e) {
		console.log('Probably an ad-blocker');
	}
} else {
	console.log("Boo! Workbox didn't load 😬");
}

self.addEventListener('message', event => {
	if (!event.data) {
		return;
	}

	switch (event.data) {
		case 'skipWaiting':
			self.skipWaiting();
			break;
		default:
			// NOOP
			break;
	}
});
