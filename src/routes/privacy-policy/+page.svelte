<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { siteContent } from '$lib/content';
	import { splitMarkdownH2, formatBlockMarkdown } from '$lib/markdown-blocks';

	const { title, body } = siteContent.legal.privacy;
	const chunks = splitMarkdownH2(body);
	const pageTitle = `${title} | Urodapter`;
	const description =
		'Privacy Policy for the Urodapter app — how UroSystem processes personal data when you use app.urodapter.com.';
</script>

<SeoHead title={pageTitle} {description} path="/privacy-policy" />

<section class="bg-primary/20 px-4 py-8">
	<div class="mx-auto max-w-3xl">
		<h1 class="mb-8 text-3xl font-bold">{title}</h1>
		<div class="card border border-base-300 bg-base-100 shadow-sm">
			<div class="prose max-sm:prose-sm card-body max-w-none text-base-content">
				{#each chunks as chunk (chunk.heading + chunk.body.slice(0, 40))}
					{#if chunk.heading}
						<h2 class="mt-6 text-xl font-semibold first:mt-0">{chunk.heading}</h2>
					{/if}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html formatBlockMarkdown(chunk.body)}
				{/each}
			</div>
		</div>
	</div>
</section>
