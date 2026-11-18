/**
 * Recordings of real instillations with the UroDapter, shown after the last step of every step sequence:
 * the female videos after the female clinician steps and the three self-instillation approaches,
 * the male video after the male clinician steps. Files are in `static/assets/video/`.
 */

/** Address segment of the video page (the step after the last step). */
export const REAL_CASE_ID = 'real-case-videos';

/** Label of the video page: plural for the three female videos, singular for the one male video. */
export const REAL_CASE_LABELS = { female: 'Real-case videos', male: 'Real-case video' } as const;
/** Label on the self-instillation pages (female videos). */
export const REAL_CASE_LABEL = REAL_CASE_LABELS.female;

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

/** Line under the label in the self-instillation short summary. */
export const REAL_CASE_SUMMARY: Record<'female' | 'male', string> = {
	female: 'Three recordings of real instillations with the UroDapter.',
	male: 'A recording of a real instillation with the UroDapter.'
};
