import { redirect } from '@sveltejs/kit';

/**
 * The former "What to do prior to instillation" page. Its doctor content is now step 1 of the clinician
 * instructions, so old links and bookmarks open that step of the female instructions (also redirected in the root `_redirects` file).
 */
export function load() {
	redirect(308, '/instructions-for-doctors-on-female-patients/prior-to-instillation');
}
