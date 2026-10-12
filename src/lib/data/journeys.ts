/**
 * The app has two journeys. The user picks one on the splash screen (`/`):
 * - `clinician`: the manual for doctors. Its Table of Contents is `/`.
 * - `patient`: the patient journey (self-instillation), with its own Table of Contents and menu.
 *   Started by the "Self-instillation" button. All of its pages live under `/self-instillation`.
 *
 * Pages that belong to neither journey (Contact, Install App, Privacy / Cookie Policy) are shared:
 * they show the menu of the journey the user was last in (see `$lib/stores/journey.svelte`).
 */

import { patientNav } from '$lib/content/generated-patient-nav';

export type JourneyId = 'clinician' | 'patient';

/** Icon names drawn by `TocCards.svelte`. */
export type TocIconName = 'tool' | 'gear' | 'female' | 'male' | 'help' | 'download';

/**
 * One Table of Contents entry. The journey's menu lists the same entries in the same order.
 * A card shows either an `icon` (clinician journey) or an `image` with a `description` (patient journey).
 */
export type JourneySection = {
	title: string;
	path: string;
	icon?: TocIconName;
	image?: string;
	imageAlt?: string;
	/** Card title when it differs from the (shorter) menu `title`. */
	cardTitle?: string;
	description?: string;
};

/** Menu link below the divider. `external` links open in a new tab. */
export type MenuLink = { label: string; path: string; external?: boolean };

export type Journey = {
	id: JourneyId;
	/** Table of Contents page of the journey (header button, menu, drawer icon point here). */
	tocPath: string;
	/** First menu item; the same text as the heading of the `tocPath` page. */
	tocLabel: string;
	/** Label of the splash button that starts this journey; the other journey's menu links here with it. */
	entryLabel: string;
	/** Table of Contents entries, in order. */
	sections: readonly JourneySection[];
	/** Menu links below the divider. */
	moreLinks: readonly MenuLink[];
};

const SHARED_MORE_LINKS: readonly MenuLink[] = [
	{ label: 'Install App', path: '/install' },
	{ label: 'Privacy Policy', path: '/privacy-policy' },
	{ label: 'Cookie Policy', path: '/cookie-policy' },
	{ label: 'Contact', path: '/contact' }
];

/** URL root of the patient journey. */
const PATIENT_ROOT = '/self-instillation';

export const JOURNEYS: Record<JourneyId, Journey> = {
	clinician: {
		id: 'clinician',
		tocPath: '/',
		tocLabel: 'Table of Contents',
		entryLabel: 'For Clinicians',
		sections: [
			{ title: 'Educational Video', path: '/how-the-urodapter-works', icon: 'tool' },
			{
				title: 'What to do prior to instillation',
				path: '/what-to-do-prior-to-instillation',
				icon: 'gear'
			},
			{
				title: 'Instructions on female patients',
				path: '/instructions-for-doctors-on-female-patients',
				icon: 'female'
			},
			{
				title: 'Instructions on male patients',
				path: '/instructions-for-doctors-on-male-patients',
				icon: 'male'
			},
			{ title: 'FAQ', path: '/faq', icon: 'help' }
		],
		moreLinks: [
			...SHARED_MORE_LINKS,
			{ label: 'Sample order', path: 'https://www.urosystem.com/sample?app', external: true }
		]
	},
	patient: {
		id: 'patient',
		tocPath: PATIENT_ROOT,
		tocLabel: 'Self-instillation',
		entryLabel: 'Self-instillation',
		/** The three approaches, from `content/patient/*.yaml` (via `generated-patient-nav.ts`). */
		sections: patientNav.map((a) => ({
			title: a.label,
			path: `${PATIENT_ROOT}/${a.id}`,
			image: a.image,
			imageAlt: a.imageAlt,
			cardTitle: a.cardTitle,
			description: a.description
		})),
		moreLinks: [
			...SHARED_MORE_LINKS,
			{ label: 'Shop', path: 'https://www.urosystem.com/shop?app', external: true }
		]
	}
};

export const DEFAULT_JOURNEY: JourneyId = 'clinician';

export function isJourneyId(value: unknown): value is JourneyId {
	return value === 'clinician' || value === 'patient';
}

/** The journey a route belongs to, or `null` for shared pages. */
export function journeyForPath(pathname: string): JourneyId | null {
	if (pathname === PATIENT_ROOT || pathname.startsWith(`${PATIENT_ROOT}/`)) {
		return 'patient';
	}
	const clinician = JOURNEYS.clinician;
	if (pathname === clinician.tocPath || clinician.sections.some((s) => s.path === pathname)) {
		return 'clinician';
	}
	return null;
}
