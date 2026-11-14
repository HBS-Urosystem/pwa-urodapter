import { browser } from '$app/environment';

const STORAGE_KEY = 'urodapter-instillation-branch-v1';

/** The branch of the content the reader last opened: instillation by a clinician, or self-instillation at home. */
export type InstillationBranch = 'clinician' | 'self';

/** `null` when the reader has not opened either branch yet. */
export function readLastInstillationBranch(): InstillationBranch | null {
	if (!browser) return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw === 'clinician' || raw === 'self') return raw;
	} catch {
		/* ignore */
	}
	return null;
}

export function persistLastInstillationBranch(branch: InstillationBranch): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, branch);
	} catch {
		/* private mode / quota */
	}
}
