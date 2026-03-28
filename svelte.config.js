import adapter from '@sveltejs/adapter-netlify';

/** Disable SW registration during `vite dev` so Cache API does not mask fresh assets. */
const devDisableServiceWorker = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		...(devDisableServiceWorker ? { serviceWorker: { register: false } } : {})
	},
	vitePlugin: {
		dynamicCompileOptions: ({ filename }) =>
			filename.includes('node_modules') ? undefined : { runes: true }
	}
};

export default config;
