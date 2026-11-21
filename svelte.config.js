import adapter from '@sveltejs/adapter-netlify';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		/**
		 * Absolute asset paths (`/_app/...`) in the page HTML. The app is always served from the site root,
		 * and the service worker serves the cached clinician instructions page for step addresses one level
		 * deeper (`/instructions-for-doctors-on-female-patients/<step>`) when offline; relative paths
		 * (`./_app/...`) would point to the wrong folder there.
		 */
		paths: { relative: false },
		/**
		 * Registered by `src/lib/service-worker-registration.ts` instead, which skips localhost (any port,
		 * also `vite preview`) so the Cache API never serves stale builds there.
		 */
		serviceWorker: { register: false }
	},
	vitePlugin: {
		dynamicCompileOptions: ({ filename }) =>
			filename.includes('node_modules') ? undefined : { runes: true }
	}
};

export default config;
