<script lang="ts">
	import { resolve } from '$app/paths';
	import ContentFlowNav from '$lib/components/ContentFlowNav.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { CONTENT_FLOW_NAV } from '$lib/data/content-flow-nav';
	import { siteContent } from '$lib/content';
	import { formatInlineMarkdown } from '$lib/markdown-inline';

	const flow = CONTENT_FLOW_NAV['/faq'];

	const faq = siteContent.pageCopy.faq;
	const pageTitle = `${faq.title} | Urodapter`;
	const introPlain = faq.introParagraphs.join(' ');
</script>

<SeoHead title={pageTitle} description={introPlain} path="/faq" />

<section class="bg-primary/20 px-4 pt-8 pb-10">
	<div class="mx-auto max-w-3xl">
		<h1 class="mb-2 text-center text-3xl">{faq.title}</h1>
		<div class="mb-6 space-y-2 text-center text-base-content/80">
			{#each faq.introParagraphs as para, i (`intro-${i}`)}
				<p>{@html formatInlineMarkdown(para).replace(/\n/g, '<br/>')}</p>
			{/each}
		</div>
		<div class="mb-8 flex justify-center">
			<a href={resolve('/contact')} class="btn btn-primary">Contact</a>
		</div>

		<div class="join join-vertical w-full bg-base-100 shadow-sm">
			{#each faq.items as item, i (item.question)}
				<details
					class="collapse collapse-arrow join-item border border-base-300 bg-base-100"
					name="faq-accordion"
					open={i === 0}
				>
					<summary class="collapse-title text-left font-medium">{item.question}</summary>
					<div class="collapse-content space-y-2 text-base-content/90">
						{#each item.paragraphs as para, j (`${item.question}-${j}`)}
							<p class="pt-2 first:pt-0">{@html formatInlineMarkdown(para).replace(/\n/g, '<br/>')}</p>
						{/each}
					</div>
				</details>
			{/each}
		</div>
	</div>
</section>
<ContentFlowNav prev={flow.prev} next={flow.next} lastInstructionsTabForPrev />
