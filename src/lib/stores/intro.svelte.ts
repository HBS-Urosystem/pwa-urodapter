import { browser } from '$app/environment';

const STORAGE_KEY = 'urodapter-intro-seen';

/** Full reload keeps sessionStorage; users expect the splash again after F5 / refresh. */
function isFullPageReload(): boolean {
	if (!browser) return false;
	try {
		const nav = performance.getEntriesByType('navigation')[0] as
			| PerformanceNavigationTiming
			| undefined;
		if (nav?.type === 'reload') return true;
	} catch {
		/* ignore */
	}
	try {
		// Legacy Navigation Timing 1 (TYPE_RELOAD = 1)
		const legacy = (performance as unknown as { navigation?: { type?: number } }).navigation;
		return legacy?.type === 1;
	} catch {
		return false;
	}
}

function readSeenFromStorage(): boolean {
	if (!browser) return false;
	if (isFullPageReload()) {
		try {
			sessionStorage.removeItem(STORAGE_KEY);
		} catch {
			/* private mode / quota */
		}
		return false;
	}
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
