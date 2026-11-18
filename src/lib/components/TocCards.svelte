<script lang="ts">
	import { resolve } from '$app/paths';
	import type { NavGroup } from '$lib/data/site-nav';

	/**
	 * Table of Contents: one card per section, grouped under headings (entries come from `$lib/data/site-nav.ts`).
	 * From the `sm` breakpoint up the cards of a group stand two per row; a card left alone in the last row is centred.
	 * The top margins of the groups are the smallest distances; a taller parent adds its spare height between the groups.
	 */
	let { groups }: { groups: readonly NavGroup[] } = $props();
</script>

<!-- `contents`: each group is laid out directly by the parent, so the parent can share spare height between the groups. -->
<div class="contents">
	{#each groups as group, i (group.sections[0].path)}
		<section
			class={['mx-auto flex w-full max-w-4xl flex-col gap-3 px-4', i === 0 ? 'mt-4' : 'mt-6']}
		>
			{#if group.heading}
				<h3 class="text-sm font-bold tracking-wider uppercase sm:text-center">{group.heading}</h3>
			{/if}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
				{#each group.sections as section (section.path)}
					<a
						href={resolve(section.path as '/')}
						class="card h-full bg-base-100 px-5 py-4 no-underline shadow-md transition-shadow hover:shadow-lg sm:col-span-2 sm:items-center sm:text-center sm:odd:last:col-start-2"
					>
						<span class="font-display text-lg leading-snug font-bold"
							>{section.title}</span
						>
						{#if section.description}
							<span class="mt-0.5 text-base-content/80">{section.description}</span>
						{/if}
					</a>
				{/each}
			</div>
		</section>
	{/each}
</div>
