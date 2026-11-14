import {
	CLINICIAN_LABEL,
	CLINICIAN_PATH,
	PRIOR_PATH,
	SELF_INSTILLATION_LABEL,
	SELF_INSTILLATION_PATH,
	TOC_LABEL,
	TOC_PATH
} from '$lib/data/site-nav';

/** One end of the previous / next bar below the main content. */
export type ContentFlowNavEnd = { path: string; label: string };

const PRIOR: ContentFlowNavEnd = { path: PRIOR_PATH, label: 'Prior to instillation' };
const FAQ: ContentFlowNavEnd = { path: '/faq', label: 'FAQ' };

/** The two branches after "What to do prior to instillation". */
export const CLINICIAN_BRANCH: ContentFlowNavEnd = { path: CLINICIAN_PATH, label: CLINICIAN_LABEL };
export const SELF_INSTILLATION_BRANCH: ContentFlowNavEnd = {
	path: SELF_INSTILLATION_PATH,
	label: SELF_INSTILLATION_LABEL
};

/**
 * Previous / next links of each flow page (the order of the Table of Contents).
 * Where the neighbour is a branch (next of the "prior" page, previous of the FAQ), the entry holds the
 * clinician branch; the page replaces it with the self-instillation branch when that is the reader's branch.
 */
export const CONTENT_FLOW_NAV: Record<
	string,
	{ prev: ContentFlowNavEnd; next: ContentFlowNavEnd }
> = {
	'/how-the-urodapter-works': {
		prev: { path: TOC_PATH, label: TOC_LABEL },
		next: PRIOR
	},
	[PRIOR_PATH]: {
		prev: { path: '/how-the-urodapter-works', label: 'Educational Video' },
		next: CLINICIAN_BRANCH
	},
	'/instructions-for-doctors-on-female-patients': { prev: PRIOR, next: FAQ },
	'/instructions-for-doctors-on-male-patients': { prev: PRIOR, next: FAQ },
	[SELF_INSTILLATION_PATH]: { prev: PRIOR, next: FAQ },
	'/faq': {
		prev: CLINICIAN_BRANCH,
		next: { path: TOC_PATH, label: TOC_LABEL }
	}
};
