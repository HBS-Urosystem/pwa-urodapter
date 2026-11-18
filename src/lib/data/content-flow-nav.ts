import {
	CLINICIAN_LABEL,
	CLINICIAN_PATH,
	SELF_INSTILLATION_LABEL,
	SELF_INSTILLATION_PATH,
	TOC_LABEL,
	TOC_PATH
} from '$lib/data/site-nav';

/** One end of the previous / next bar below the main content. */
export type ContentFlowNavEnd = { path: string; label: string };

const VIDEO: ContentFlowNavEnd = { path: '/how-the-urodapter-works', label: 'Educational Video' };
const FAQ: ContentFlowNavEnd = { path: '/faq', label: 'FAQ' };

/** The two branches after the Educational Video. */
export const CLINICIAN_BRANCH: ContentFlowNavEnd = { path: CLINICIAN_PATH, label: CLINICIAN_LABEL };
export const SELF_INSTILLATION_BRANCH: ContentFlowNavEnd = {
	path: SELF_INSTILLATION_PATH,
	label: SELF_INSTILLATION_LABEL
};

/**
 * Previous / next links of each flow page (the order of the Table of Contents).
 * The content forks after the Educational Video. The video's next link and the FAQ's previous link are the
 * clinician branch here; both pages replace it with the branch the reader last opened.
 */
export const CONTENT_FLOW_NAV: Record<
	string,
	{ prev: ContentFlowNavEnd; next: ContentFlowNavEnd }
> = {
	'/how-the-urodapter-works': {
		prev: { path: TOC_PATH, label: TOC_LABEL },
		next: CLINICIAN_BRANCH
	},
	'/instructions-for-doctors-on-female-patients': { prev: VIDEO, next: FAQ },
	'/instructions-for-doctors-on-male-patients': { prev: VIDEO, next: FAQ },
	[SELF_INSTILLATION_PATH]: { prev: VIDEO, next: FAQ },
	'/faq': {
		prev: CLINICIAN_BRANCH,
		next: { path: TOC_PATH, label: TOC_LABEL }
	}
};
