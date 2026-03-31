import { browser } from '$app/environment';

const STORAGE_KEY = 'urodapter-instructions-last-gender-v1';

export const INSTRUCTIONS_FEMALE_PATH = '/instructions-for-doctors-on-female-patients';
export const INSTRUCTIONS_MALE_PATH = '/instructions-for-doctors-on-male-patients';

export type InstructionsTabGender = 'female' | 'male';

export function instructionsPathForGender(g: InstructionsTabGender): string {
	return g === 'male' ? INSTRUCTIONS_MALE_PATH : INSTRUCTIONS_FEMALE_PATH;
}

/** Route path for the instructions page the user last had open (default female). */
export function readLastInstructionsPath(): string {
	if (!browser) return INSTRUCTIONS_FEMALE_PATH;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw === 'male') return INSTRUCTIONS_MALE_PATH;
		if (raw === 'female') return INSTRUCTIONS_FEMALE_PATH;
	} catch {
		/* ignore */
	}
	return INSTRUCTIONS_FEMALE_PATH;
}

export function persistLastInstructionsTab(gender: InstructionsTabGender): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, gender);
	} catch {
		/* ignore */
	}
}
