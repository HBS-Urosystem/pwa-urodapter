<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import TocCards from '$lib/components/TocCards.svelte';
	import { siteContent } from '$lib/content';
	import { JOURNEYS } from '$lib/data/journeys';
	import { formatBlockMarkdown } from '$lib/markdown-blocks';

	/** Approach cards come from `$lib/data/journeys.ts`; the text from `content/patient/overview.md`. */
	const journey = JOURNEYS.patient;
	const overview = siteContent.patient.overview;

	const title = 'Self instillation | Urodapter';
	const description =
		'Using UroDapter for bladder instillation at home: lying or semi-reclined, standing in the shower, or with the help of a partner.';
</script>

<SeoHead {title} {description} path={journey.tocPath} />

<!-- Table of Contents of the patient journey (started by the "Self instillation" button on the splash screen). -->
<section class="flex-1 bg-primary/20 py-12">
	<div class="mx-auto max-w-2xl px-4">
		<h1 class="text-center text-3xl">{journey.tocLabel}</h1>
		<p class="mt-2 mb-8 text-center text-lg text-base-content/80">{overview.title}</p>

		<div class="prose max-w-none text-base-content">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html formatBlockMarkdown(overview.intro)}
		</div>

		<div
			role="note"
			class="my-6 alert items-start border-info/60 bg-info/15 text-base text-base-content"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="h-6 w-6 shrink-0 stroke-current"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<div>{@html formatBlockMarkdown(overview.practise)}</div>
		</div>

		<div class="prose max-w-none text-base-content">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html formatBlockMarkdown(overview.notForEveryone)}
		</div>

		<h2 class="mt-10 mb-2 text-center text-xl font-bold">Choose your approach</h2>
		<div class="mx-auto prose mb-6 max-w-none text-center text-base-content">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html formatBlockMarkdown(overview.howToUse)}
		</div>
	</div>

	<TocCards sections={journey.sections} />
</section>
