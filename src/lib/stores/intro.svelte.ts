import { browser } from '$app/environment';

const STORAGE_KEY = 'urodapter-intro-seen';

function readSeenFromStorage(): boolean {
	if (!browser) return false;
	try {
		return sessionStorage.getItem(STORAGE_KEY) === '1';
	} catch {
		return false;
	}
}

export const introPlayed = $state({ seen: readSeenFromStorage() });

export function markIntroSeen(): void {
	introPlayed.seen = true;
	if (!browser) return;
	try {
		sessionStorage.setItem(STORAGE_KEY, '1');
	} catch {
		/* private mode / quota */
	}
}
