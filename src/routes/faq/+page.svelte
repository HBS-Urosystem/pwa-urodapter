<script lang="ts">
	import { resolve } from '$app/paths';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { siteContent } from '$lib/content';

	const faq = siteContent.pageCopy.faq;
	const pageTitle = `${faq.title} | Urodapter`;
</script>

<SeoHead title={pageTitle} description={faq.intro} path="/faq" />

<section class="min-h-full bg-base-200/40 px-4 py-8">
	<div class="mx-auto max-w-3xl">
		<h1 class="mb-2 text-center text-3xl font-bold">{faq.title}</h1>
		<p class="mb-6 text-center text-base-content/80">{faq.intro}</p>
		<div class="mb-8 flex justify-center">
			<a href={resolve('/contact')} class="btn btn-primary">Contact</a>
		</div>

		<div class="join join-vertical w-full shadow-sm">
			{#each faq.items as item, i (item.question)}
				<div class="collapse-arrow collapse join-item border border-base-300 bg-base-100">
					<input type="radio" name="faq-accordion" checked={i === 0} />
					<div class="collapse-title text-left font-medium">{item.question}</div>
					<div class="collapse-content text-base-content/90">
						<p class="pt-2 whitespace-pre-line">{item.answer}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
