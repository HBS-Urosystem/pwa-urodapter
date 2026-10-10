<script lang="ts">
	import { resolve } from '$app/paths';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import TocCards from '$lib/components/TocCards.svelte';
	import { JOURNEYS } from '$lib/data/journeys';

	/** Entries of this Table of Contents (and of the journey's menu) are in `$lib/data/journeys.ts`. */
	const journey = JOURNEYS.patient;

	const title = 'Self instillation | Urodapter';
	const description = 'Self instillation with the UroDapter® — guide in preparation.';
</script>

<SeoHead {title} {description} path={journey.tocPath} />

<svelte:head>
	<!-- Keep out of search results while the journey has no content. When it has, remove this tag and add the path to SITEMAP_PATHS in $lib/seo.ts. -->
	<meta name="robots" content="noindex" />
</svelte:head>

<!-- Table of Contents of the patient journey (started by the "Self instillation" button on the splash screen). -->
<section class="flex-1 bg-primary/20 py-12">
	<div class="mx-auto">
		<h1 class="mb-8 text-center text-3xl">Self instillation</h1>

		<h2 class="mb-4 text-center text-lg font-bold">Table of Contents</h2>

		{#if journey.sections.length > 0}
			<TocCards sections={journey.sections} />
		{:else}
			<div class="mx-auto max-w-md px-4">
				<div class="card items-center bg-base-100 shadow-md">
					<div class="card-body items-center gap-4 text-center">
						<p>This guide is in preparation.</p>
						<a href={resolve('/contact')} class="btn btn-primary">Contact</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>
