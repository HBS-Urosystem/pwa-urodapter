/**
 * Navigation of the whole app: one Table of Contents (`/`) and one menu.
 *
 * The menu, the Table of Contents and the previous / next bars below the pages follow one order:
 * "Instillation by a clinician" (Female / Male tabs) → "Self-instillation at home" (three approach tabs)
 * → Introductory Video → FAQ.
 */

import { patientNav } from '$lib/content/generated-patient-nav';
import { INSTRUCTIONS_FEMALE_PATH, INSTRUCTIONS_MALE_PATH } from '$lib/instructions-tab-storage';

export const TOC_PATH = '/';
export const TOC_LABEL = 'Table of Contents';

/** Branch performed by a clinician. Its entry is the female instructions page (the tabs switch to male). */
export const CLINICIAN_PATH = INSTRUCTIONS_FEMALE_PATH;
export const CLINICIAN_LABEL = 'Instillation by a clinician';

/** Branch performed by the patient at home. All of its pages live under this path. */
export const SELF_INSTILLATION_PATH = '/self-instillation';
export const SELF_INSTILLATION_LABEL = 'Self-instillation at home';

/** Sub-entry of a section, listed indented under it in the menu. */
export type NavChild = { title: string; path: string };

/** One menu entry with its optional indented sub-entries. */
export type NavSection = { title: string; path: string; children?: readonly NavChild[] };

export const VIDEO_PATH = '/how-the-urodapter-works';
export const FAQ_PATH = '/faq';

/** Menu entries in the order of the Table of Contents: the two guides, then the video, then the FAQ. */
export const MENU_SECTIONS: readonly NavSection[] = [
	{
		title: CLINICIAN_LABEL,
		path: CLINICIAN_PATH,
		children: [
			{ title: 'Female patients', path: INSTRUCTIONS_FEMALE_PATH },
			{ title: 'Male patients', path: INSTRUCTIONS_MALE_PATH }
		]
	},
	{
		title: SELF_INSTILLATION_LABEL,
		path: SELF_INSTILLATION_PATH,
		/** The three approaches, from `content/patient/*.yaml` (via `generated-patient-nav.ts`). */
		children: patientNav.map((a) => ({
			title: a.label,
			path: `${SELF_INSTILLATION_PATH}/${a.id}`
		}))
	},
	{ title: 'Introductory Video', path: VIDEO_PATH },
	{ title: 'FAQ', path: FAQ_PATH }
];

/** One Table of Contents card: an optional small line above the title, the title, an optional line below it. */
export type TocCard = { path: string; title: string; eyebrow?: string; description?: string };

/** Cards of the Table of Contents under one heading. */
export type TocGroup = { heading: string; cards: readonly TocCard[] };

/** First group of the Table of Contents: the two guides, shown more prominently than the other cards. */
export const TOC_GUIDES: TocGroup = {
	heading: 'Choose your guide',
	cards: [
		{
			eyebrow: 'For healthcare professionals',
			title: 'Clinician-performed instillation',
			path: CLINICIAN_PATH
		},
		{
			eyebrow: 'For home treatment',
			title: 'Self-instillation for women',
			path: SELF_INSTILLATION_PATH
		}
	]
};

/** Group below the guides: its two cards stand side by side from the `sm` breakpoint up. */
export const TOC_MORE: TocGroup = {
	heading: 'New to UroDapter?',
	cards: [
		{ title: 'Introductory Video', description: 'How the UroDapter works', path: VIDEO_PATH },
		{ title: 'FAQ', description: 'Read the frequently asked questions', path: FAQ_PATH }
	]
};

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
