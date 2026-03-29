<script lang="ts">
	import { siteContent } from '$lib/content';
	import { formatBlockMarkdown } from '$lib/markdown-blocks';

	const page = siteContent.pageCopy.preInstillation;
</script>

<svelte:head>
	<title>{page.title} | Urodapter</title>
	<meta name="description" content={page.title} />
</svelte:head>

<section class="min-h-full bg-base-200/40 px-4 py-8">
	<div class="mx-auto max-w-3xl">
		<h1 class="mb-8 text-3xl font-bold">{page.title}</h1>
		<div class="card border border-base-300 bg-base-100 shadow-sm">
			<div class="card-body gap-8">
				{#each page.sections as s (s.letter)}
					<div class="flex gap-4">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-content"
						>
							{s.letter}
						</div>
						<div class="prose prose-sm max-w-none flex-1 text-base-content">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html formatBlockMarkdown(s.body)}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
