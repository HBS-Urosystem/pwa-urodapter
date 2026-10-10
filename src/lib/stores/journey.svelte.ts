import { browser } from '$app/environment';
import { DEFAULT_JOURNEY, isJourneyId, type JourneyId } from '$lib/data/journeys';

const STORAGE_KEY = 'urodapter-journey';

/**
 * The journey the user was last in. Shared pages (Contact, Install App, legal) use it to pick the menu.
 * Starts at the default so server render and hydration match; `restoreJourney()` loads the stored value after mount.
 */
export const lastJourney = $state<{ id: JourneyId }>({ id: DEFAULT_JOURNEY });

export function restoreJourney(): void {
	if (!browser) return;
	try {
		const stored = sessionStorage.getItem(STORAGE_KEY);
		if (isJourneyId(stored)) lastJourney.id = stored;
	} catch {
		/* private mode / quota */
	}
}

export function rememberJourney(id: JourneyId): void {
	lastJourney.id = id;
	if (!browser) return;
	try {
		sessionStorage.setItem(STORAGE_KEY, id);
	} catch {
		/* private mode / quota */
	}
}
