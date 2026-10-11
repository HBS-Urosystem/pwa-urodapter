// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			/** The camera mirror layer is open ($lib/mirror/MirrorLayer.svelte). */
			mirror?: boolean;
		}
		// interface Platform {}
	}
}

declare module 'svelte/elements' {
	interface HTMLFormAttributes {
		/** Netlify Forms honeypot field name */
		'netlify-honeypot'?: string;
	}
}

export {};
