/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = `cache-${version}`;

/** Cache API cannot store 206 Partial Content; `response.ok` is still true for 206 (common for video `Range` requests). */
function canStoreInCache(response: Response): boolean {
	if (!response.ok) return false;
	if (response.status === 206) return false;
	if (response.headers.has('Content-Range')) return false;
	return true;
}

/**
 * The clinician instruction steps share one client-rendered page; only the step in the address differs
 * (`/instructions-for-doctors-on-female-patients/<step>`). Offline, a step address that was never loaded
 * from the network is served with any cached address of the same page, which then shows the right step.
 */
const STEP_PAGE = /^\/instructions-for-doctors-on-(?:female|male)-patients(?=\/|$)/;

async function cachedStepPage(url: URL): Promise<Response | undefined> {
	const base = STEP_PAGE.exec(url.pathname)?.[0];
	if (!base) return undefined;
	const cache = await caches.open(CACHE_NAME);
	const key = (await cache.keys()).find((k) => {
		const path = new URL(k.url).pathname;
		return path === base || path.startsWith(`${base}/`);
	});
	return key ? cache.match(key) : undefined;
}

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
		(async () => {
			const oldKeys = (await caches.keys()).filter((k) => k !== CACHE_NAME);
			await Promise.all(oldKeys.map((k) => caches.delete(k)));
			await sw.clients.claim();
			// No older cache means this is the first install on this origin, not an update.
			if (oldKeys.length === 0) return;
			const clients = await sw.clients.matchAll({ type: 'window' });
			for (const client of clients) {
				client.postMessage({ type: 'SW_UPDATED' });
			}
		})()
	);
});

sw.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	const url = new URL(event.request.url);

	if (url.origin !== location.origin) return;

	// Always let the browser hit the network for the version file, so the page can detect
	// that it is running an outdated build (SvelteKit `updated` store).
	if (url.pathname === '/_app/version.json') return;

	const isVideo = url.pathname.startsWith('/assets/video/');

	if (isVideo) {
		event.respondWith(
			caches.match(event.request).then(
				(cached) =>
					cached ||
					fetch(event.request).then((response) => {
						if (canStoreInCache(response)) {
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
						if (canStoreInCache(response) && response.type === 'basic') {
							const clone = response.clone();
							caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
						}
						return response;
					})
					.catch(async () => {
						const stepPage =
							event.request.mode === 'navigate' ? await cachedStepPage(url) : undefined;
						return stepPage || new Response('Offline', { status: 503 });
					})
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
						if (canStoreInCache(response)) {
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
