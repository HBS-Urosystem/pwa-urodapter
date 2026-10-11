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

/** The inline script in src/app.html applies the same rule before the first paint (keep the two in sync). */
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

/** Show the splash screen again (header and footer logo). */
export function resetIntro(): void {
	introPlayed.seen = false;
	if (!browser) return;
	try {
		sessionStorage.removeItem(STORAGE_KEY);
	} catch {
		/* private mode / quota */
	}
}
