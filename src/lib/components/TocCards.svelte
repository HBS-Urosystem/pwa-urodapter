<script lang="ts">
	import { resolve } from '$app/paths';
	import type { TocCard, TocGroup } from '$lib/data/site-nav';

	/**
	 * Table of Contents cards (entries come from `$lib/data/site-nav.ts`), in two blocks:
	 * 1. the two guides under "Choose your guide", larger and with a coloured frame;
	 * 2. under "New to UroDapter?" the introductory video and the FAQ, as plain cards.
	 * From the `sm` breakpoint up the cards of each block stand side by side, two per row.
	 * The parent sets the distance between the blocks (equal gaps; a taller parent adds its spare height evenly).
	 */
	let { guides, more }: { guides: TocGroup; more: TocGroup } = $props();
</script>

{#snippet card(entry: TocCard, featured: boolean)}
	<a
		href={resolve(entry.path as '/')}
		class={[
			'card h-full no-underline transition-shadow sm:items-center sm:text-center',
			featured
				? 'border-2 border-primary bg-base-100 px-6 py-6 shadow-lg hover:shadow-xl'
				: 'bg-base-100/70 px-5 py-4 shadow-sm hover:shadow-md'
		]}
	>
		{#if entry.eyebrow}
			<span class="text-sm font-semibold tracking-wide text-base-content/75 uppercase"
				>{entry.eyebrow}</span
			>
		{/if}
		<span
			class={[
				'font-display leading-snug font-bold',
				featured ? 'mt-1 text-xl sm:text-2xl' : 'text-lg'
			]}>{entry.title}</span
		>
		{#if entry.description}
			<span class="mt-0.5 text-base-content/80">{entry.description}</span>
		{/if}
	</a>
{/snippet}

<!-- `contents`: each block is laid out directly by the parent, so the parent can share spare height between the blocks. -->
<div class="contents">
	<section class="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4">
		<h2 class="text-center text-lg font-bold">{guides.heading}</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#each guides.cards as entry (entry.path)}
				{@render card(entry, true)}
			{/each}
		</div>
	</section>

	<section class="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4">
		<h2 class="text-center font-semibold text-base-content/80">{more.heading}</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#each more.cards as entry (entry.path)}
				{@render card(entry, false)}
			{/each}
		</div>
	</section>
</div>
