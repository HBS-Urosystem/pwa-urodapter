import { browser } from '$app/environment';

const STORAGE_KEY = 'urodapter-prior-instillation-audience-v1';

export type PriorInstillationAudience = 'patient' | 'doctor';

export function readStoredPriorInstillationAudience(): PriorInstillationAudience {
	if (!browser) return 'patient';
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw === 'doctor' || raw === 'patient') return raw;
	} catch {
		/* ignore */
	}
	return 'patient';
}

export function persistPriorInstillationAudience(audience: PriorInstillationAudience): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, audience);
	} catch {
		/* ignore */
	}
}
