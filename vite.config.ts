import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { defineConfig } from 'vite';

// `npm run dev:https` serves over the LAN with a self-signed certificate, so a
// phone can reach the camera (the mirror in $lib/mirror). Never used in a build.
const devHttps = process.env.DEV_HTTPS === '1';

export default defineConfig({
	plugins: [...(devHttps ? [basicSsl()] : []), tailwindcss(), sveltekit(), devtoolsJson()]
});
