/**
 * Recordings of real instillations with the UroDapter, shown after the last step of every step sequence:
 * the female videos after the female clinician steps and the three self-instillation approaches,
 * the male video after the male clinician steps. Files are in `static/assets/video/`.
 */

/** Address segment of the video page (the step after the last step). */
export const REAL_CASE_ID = 'real-case-videos';

/** Label of the video page: plural for the three female videos, singular for the one male video. */
export const REAL_CASE_LABELS = { female: 'Real-case videos', male: 'Real-case video' } as const;
/** Title of the video page on the self-instillation pages (step row, bottom bar, short summary, page heading). */
export const REAL_CASE_LABEL = 'Real-patient instillation videos';

/** Text above the videos on the self-instillation video page; the second paragraph is shown in italics. */
export const SELF_REAL_CASE_INTRO = [
	'These real-patient videos show UroDapter instillation performed by an experienced clinician. Although the setting differs from home self-treatment, they can help you understand the key movements, placement, angle, sealing, and instillation technique in practice.',
	'Use these videos as a practical reference alongside the specific home-treatment instructions for your chosen approach.'
] as const;

/** Link at the end of step 1 of the clinician instructions, leading to the video page (non-breaking hyphen in "real-case"). */
export const REAL_CASE_LINK_TEXT = {
	female: 'Click here to watch the real\u2011case patient videos.',
	male: 'Click here to watch the real\u2011case patient video.'
} as const;

export type RealCaseVideo = { src: string; poster: string; title: string };

export const REAL_CASE_VIDEOS: Record<'female' | 'male', readonly RealCaseVideo[]> = {
	female: [1, 2, 3].map((n) => ({
		src: `/assets/video/real-case-female-${n}.mp4`,
		poster: `/assets/video/real-case-female-${n}.jpg`,
		title: `Female patient ${n}`
	})),
	male: [
		{
			src: '/assets/video/real-case-male.mp4',
			poster: '/assets/video/real-case-male.jpg',
			title: 'Male patient'
		}
	]
};

/** Line under the title in the self-instillation short summary. */
export const REAL_CASE_SUMMARY =
	'Watch clinician-performed UroDapter instillations in real patients to see the key placement, angle, sealing, and instillation technique in practice.';
