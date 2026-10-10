import { error } from '@sveltejs/kit';
import { siteContent } from '$lib/content';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () =>
	siteContent.patient.approaches.flatMap((a) =>
		a.steps.map((s) => ({ approach: a.id, step: s.id }))
	);

export const load: PageLoad = ({ params }) => {
	const approach = siteContent.patient.approaches.find((a) => a.id === params.approach);
	const index = approach ? approach.steps.findIndex((s) => s.id === params.step) : -1;
	if (!approach || index < 0) error(404, 'Not found');
	return { approach, index, figures: siteContent.patient.figures };
};
