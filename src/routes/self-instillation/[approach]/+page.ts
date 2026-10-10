import { error } from '@sveltejs/kit';
import { siteContent } from '$lib/content';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () =>
	siteContent.patient.approaches.map((a) => ({ approach: a.id }));

export const load: PageLoad = ({ params }) => {
	const approach = siteContent.patient.approaches.find((a) => a.id === params.approach);
	if (!approach) error(404, 'Not found');
	return { approach, approaches: siteContent.patient.approaches };
};
