/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = `cache-${version}`;

const PRECACHE_ASSETS = [
	...build,
	...files.filter(
		(f) => !f.startsWith('/assets/video/') || f.includes('intro_loop_seq')
	)
];

sw.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(PRECACHE_ASSETS))
			.then(() => sw.skipWaiting())
	);
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
			)
			.then(() => sw.clients.claim())
			.then(() =>
				sw.clients.matchAll({ type: 'window' }).then((clients) => {
					for (const client of clients) {
						client.postMessage({ type: 'SW_UPDATED' });
					}
				})
			)
	);
});

sw.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	const url = new URL(event.request.url);

	if (url.origin !== location.origin) return;

	const isVideo = url.pathname.startsWith('/assets/video/');

	if (isVideo) {
		event.respondWith(
			caches.match(event.request).then(
				(cached) =>
					cached ||
					fetch(event.request).then((response) => {
						if (response.ok) {
							const clone = response.clone();
							caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
						}
						return response;
					})
			)
		);
		return;
	}

	event.respondWith(
		caches.match(event.request).then(
			(cached) =>
				cached ||
				fetch(event.request)
					.then((response) => {
						if (response.ok && response.type === 'basic') {
							const clone = response.clone();
							caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
						}
						return response;
					})
					.catch(() => cached || new Response('Offline', { status: 503 }))
		)
	);
});

sw.addEventListener('message', (event) => {
	if (event.data?.type === 'CACHE_ALL_VIDEOS') {
		const videoUrls = (event.data.urls as string[]) || [];
		const total = videoUrls.length;
		let completed = 0;

		caches.open(CACHE_NAME).then(async (cache) => {
			for (const url of videoUrls) {
				try {
					const existing = await cache.match(url);
					if (!existing) {
						const response = await fetch(url);
						if (response.ok) {
							await cache.put(url, response);
						}
					}
				} catch {
					// skip failed downloads
				}
				completed++;
				const clients = await sw.clients.matchAll({ type: 'window' });
				for (const client of clients) {
					client.postMessage({
						type: 'CACHE_PROGRESS',
						completed,
						total
					});
				}
			}
		});
	}
});
