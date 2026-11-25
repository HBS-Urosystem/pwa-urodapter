import {
	SELF_INSTILLATION_LABEL,
	SELF_INSTILLATION_PATH,
	TOC_LABEL,
	TOC_PATH
} from '$lib/data/site-nav';

/** One end of the previous / next bar below the main content. */
export type ContentFlowNavEnd = { path: string; label: string };

const TOC: ContentFlowNavEnd = { path: TOC_PATH, label: TOC_LABEL };
const SELF_INSTILLATION: ContentFlowNavEnd = {
	path: SELF_INSTILLATION_PATH,
	label: SELF_INSTILLATION_LABEL
};
const VIDEO: ContentFlowNavEnd = { path: '/how-the-urodapter-works', label: 'Introductory Video' };
const FAQ: ContentFlowNavEnd = { path: '/faq', label: 'FAQ' };

/**
 * Previous / next links of each flow page, in the order of the menu
 * (Instillation by a clinician, Self-instillation at home, Introductory Video, FAQ).
 * The two instillation branches do not link to each other: a reader of one branch is not led into the other.
 * - Instillation by a clinician: Table of Contents ← → FAQ
 * - Self-instillation at home: Table of Contents ← → Introductory Video → FAQ → Table of Contents
 */
export const CONTENT_FLOW_NAV: Record<
	string,
	{ prev: ContentFlowNavEnd; next: ContentFlowNavEnd }
> = {
	'/instructions-for-doctors-on-female-patients': { prev: TOC, next: FAQ },
	'/instructions-for-doctors-on-male-patients': { prev: TOC, next: FAQ },
	[SELF_INSTILLATION_PATH]: { prev: TOC, next: VIDEO },
	'/how-the-urodapter-works': { prev: SELF_INSTILLATION, next: FAQ },
	'/faq': { prev: VIDEO, next: TOC }
};
