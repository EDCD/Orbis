console.log('Hello from sw.js');

if (workbox) {
	console.log(`Yay! Workbox is loaded 🎉`);
	workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
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
		// Cache CSS files
		/.*\.css/,
		// Use cache but update in the background ASAP
		workbox.strategies.staleWhileRevalidate({
			// Use a custom cache name
			cacheName: 'css-cache'
		})
	);
	workbox.routing.registerRoute(
		// Cache image files
		/.*\.(?:png|jpg|jpeg|svg|gif)/,
		// Use the cache if it's available
		workbox.strategies.cacheFirst({
			// Use a custom cache name
			cacheName: 'image-cache',
			plugins: [
				new workbox.expiration.Plugin({
					// Cache only 20 images
					maxEntries: 20,
					// Cache for a maximum of a week
					maxAgeSeconds: 7 * 24 * 60 * 60
				})
			]
		})
	);

	workbox.routing.registerRoute(
		/.*\.js/,
		workbox.strategies.networkFirst()
	);

	workbox.routing.registerRoute(
		/api/,
		new workbox.strategies.NetworkFirst({})
	);
	workbox.googleAnalytics.initialize();
} else {
	console.log(`Boo! Workbox didn't load 😬`);
}
