/**
 * Navigation of the whole app: one Table of Contents (`/`) and one menu.
 *
 * The content is one sequence with a fork in the middle:
 * Educational Video →
 * either "Instillation by a clinician" (Female / Male tabs)
 * or "Self-instillation at home" (three approach tabs) → FAQ.
 */

import { patientNav } from '$lib/content/generated-patient-nav';
import { INSTRUCTIONS_FEMALE_PATH, INSTRUCTIONS_MALE_PATH } from '$lib/instructions-tab-storage';

export const TOC_PATH = '/';
export const TOC_LABEL = 'Table of Contents';

/** Branch performed by a clinician. Its entry is the female instructions page (the tabs switch to male). */
export const CLINICIAN_PATH = INSTRUCTIONS_FEMALE_PATH;
export const CLINICIAN_LABEL = 'Instillation by a clinician';
export const CLINICIAN_DESCRIPTION = 'Female patients · Male patients';

/** Branch performed by the patient at home. All of its pages live under this path. */
export const SELF_INSTILLATION_PATH = '/self-instillation';
export const SELF_INSTILLATION_LABEL = 'Self-instillation at home';
export const SELF_INSTILLATION_DESCRIPTION = 'For women · Lying · In the shower · With a partner';

/** Sub-entry of a section, listed indented under it in the menu. */
export type NavChild = { title: string; path: string };

/** One Table of Contents card; the menu lists the same entries in the same order. */
export type NavSection = {
	title: string;
	path: string;
	/** Second line of the Table of Contents card. */
	description?: string;
	children?: readonly NavChild[];
};

/** Cards of the Table of Contents under one heading; a group without a heading shows its cards only. */
export type NavGroup = { heading?: string; sections: readonly NavSection[] };

export const TOC_GROUPS: readonly NavGroup[] = [
	{
		sections: [
			{
				title: 'Educational Video',
				path: '/how-the-urodapter-works',
				description: 'How the UroDapter works'
			}
		]
	},
	{
		heading: 'Instillation: choose who performs it',
		sections: [
			{
				title: CLINICIAN_LABEL,
				path: CLINICIAN_PATH,
				description: CLINICIAN_DESCRIPTION,
				children: [
					{ title: 'Female patients', path: INSTRUCTIONS_FEMALE_PATH },
					{ title: 'Male patients', path: INSTRUCTIONS_MALE_PATH }
				]
			},
			{
				title: SELF_INSTILLATION_LABEL,
				path: SELF_INSTILLATION_PATH,
				description: SELF_INSTILLATION_DESCRIPTION,
				/** The three approaches, from `content/patient/*.yaml` (via `generated-patient-nav.ts`). */
				children: patientNav.map((a) => ({
					title: a.label,
					path: `${SELF_INSTILLATION_PATH}/${a.id}`
				}))
			}
		]
	},
	{
		heading: 'Questions',
		sections: [{ title: 'FAQ', path: '/faq' }]
	}
];

/** Menu link below the first divider. `external` links open in a new tab. */
export type MenuLink = { label: string; path: string; external?: boolean };

export const MORE_LINKS: readonly MenuLink[] = [
	{ label: 'Install App', path: '/install' },
	{ label: 'Privacy Policy', path: '/privacy-policy' },
	{ label: 'Cookie Policy', path: '/cookie-policy' },
	{ label: 'Contact', path: '/contact' }
];

export const EXTERNAL_LINKS: readonly MenuLink[] = [
	{ label: 'Sample order', path: 'https://www.urosystem.com/sample?app', external: true },
	{ label: 'Shop', path: 'https://www.urosystem.com/shop?app', external: true }
];
