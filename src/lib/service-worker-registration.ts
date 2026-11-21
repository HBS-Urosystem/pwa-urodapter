import { dev } from '$app/environment';

/**
 * True for local development hosts (`localhost`, `*.localhost`, `127.0.0.1`, `::1`) on any port.
 * The service worker is never installed there, so its cache cannot serve stale builds during development.
 */
export function isLocalHost(hostname: string): boolean {
	return (
		hostname === 'localhost' ||
		hostname.endsWith('.localhost') ||
		hostname === '127.0.0.1' ||
		hostname === '[::1]' ||
		hostname === '::1'
	);
}

/**
 * Registers `/service-worker.js` on deployed hosts. On a local host it instead removes any service worker
 * registered earlier on this origin and deletes its Cache API storage.
 * SvelteKit's automatic registration is turned off in `svelte.config.js` so this function decides.
 */
export async function setUpServiceWorker(): Promise<void> {
	if (!('serviceWorker' in navigator)) return;

	if (isLocalHost(location.hostname)) {
		const registrations = await navigator.serviceWorker.getRegistrations();
		await Promise.all(registrations.map((r) => r.unregister()));
		if ('caches' in window) {
			const keys = await caches.keys();
			await Promise.all(keys.map((k) => caches.delete(k)));
		}
		return;
	}

	await navigator.serviceWorker.register('/service-worker.js', {
		type: dev ? 'module' : 'classic'
	});
}
