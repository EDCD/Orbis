console.log('Hello from sw.js');

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

if (workbox) {
	console.log(`Yay! Workbox is loaded 🎉`);
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
					maxEntries: 60,
					maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
				})
			]
		})
	);
	workbox.routing.registerRoute(
		/\.(?:js|css)$/,
		workbox.strategies.staleWhileRevalidate({
			cacheName: 'static-resources'
		})
	);
	workbox.routing.registerRoute(
		/api/,
		new workbox.strategies.NetworkOnly({})
	);
} else {
	console.log(`Boo! Workbox didn't load 😬`);
}
