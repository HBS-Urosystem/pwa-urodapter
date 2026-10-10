import { browser } from '$app/environment';

const STORAGE_KEY = 'urodapter-patient-progress-v1';

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

export function rememberPatientStep(approachId: string, stepId: string): void {
	if (!browser) return;
	try {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ ...readPatientProgress(), [approachId]: stepId })
		);
	} catch {
		/* private mode / quota */
	}
}
