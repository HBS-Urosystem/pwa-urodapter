/** One step in the linear manual flow (matches home Table of Contents order). */
export type ContentFlowNavEnd = { path: string; label: string };

/** Prev / next links below main content on each flow page. */
export const CONTENT_FLOW_NAV: Record<string, { prev: ContentFlowNavEnd; next: ContentFlowNavEnd }> = {
	'/how-the-urodapter-works': {
		prev: { path: '/', label: 'Table of Contents' },
		next: { path: '/what-to-do-prior-to-instillation', label: 'What to do prior to instillation' }
	},
	'/what-to-do-prior-to-instillation': {
		prev: { path: '/how-the-urodapter-works', label: 'Educational Video' },
		next: { path: '/instructions-for-doctors-on-female-patients', label: 'Instructions for doctors' }
	},
	'/instructions-for-doctors-on-female-patients': {
		prev: { path: '/what-to-do-prior-to-instillation', label: 'What to do prior to instillation' },
		next: { path: '/faq', label: 'FAQ' }
	},
	'/instructions-for-doctors-on-male-patients': {
		prev: { path: '/what-to-do-prior-to-instillation', label: 'What to do prior to instillation' },
		next: { path: '/faq', label: 'FAQ' }
	},
	'/faq': {
		prev: { path: '/instructions-for-doctors-on-female-patients', label: 'Instructions for doctors' },
		next: { path: '/', label: 'Table of Contents' }
	}
};
