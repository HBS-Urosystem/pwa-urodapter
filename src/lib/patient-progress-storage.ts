import { browser } from '$app/environment';

const STORAGE_KEY = 'urodapter-patient-progress-v1';
const APPROACH_KEY = 'urodapter-patient-approach-v1';

export type PatientProgress = Record<string, string>;

/** Last opened step id per approach id. */
export function readPatientProgress(): PatientProgress {
	if (!browser) return {};
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const parsed: unknown = raw ? JSON.parse(raw) : {};
		return parsed && typeof parsed === 'object' ? (parsed as PatientProgress) : {};
	} catch {
		return {};
	}
}

/** Id of the approach the reader last opened (its tab or one of its steps), or `null`. */
export function readLastPatientApproach(): string | null {
	if (!browser) return null;
	try {
		return localStorage.getItem(APPROACH_KEY);
	} catch {
		return null;
	}
}

export function rememberPatientApproach(approachId: string): void {
	if (!browser) return;
	try {
		localStorage.setItem(APPROACH_KEY, approachId);
	} catch {
		/* private mode / quota */
	}
}

export function rememberPatientStep(approachId: string, stepId: string): void {
	if (!browser) return;
	rememberPatientApproach(approachId);
	try {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ ...readPatientProgress(), [approachId]: stepId })
		);
	} catch {
		/* private mode / quota */
	}
}
