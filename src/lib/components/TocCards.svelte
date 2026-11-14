<script lang="ts">
	import { resolve } from '$app/paths';
	import type { NavGroup } from '$lib/data/site-nav';

	/** Table of Contents: one card per section, grouped under headings (entries come from `$lib/data/site-nav.ts`). */
	let { groups }: { groups: readonly NavGroup[] } = $props();
</script>

<div class="mx-auto flex max-w-2xl flex-col gap-6 px-4">
	{#each groups as group (group.heading)}
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-bold tracking-wider uppercase">{group.heading}</h3>
			{#each group.sections as section (section.path)}
				<a
					href={resolve(section.path as '/')}
					class="card bg-base-100 px-5 py-4 no-underline shadow-md transition-shadow hover:shadow-lg"
				>
					<span class="[font-family:var(--font-heading)] text-lg leading-snug font-bold"
						>{section.title}</span
					>
					{#if section.description}
						<span class="mt-0.5 text-sm text-base-content/80">{section.description}</span>
					{/if}
				</a>
			{/each}
		</section>
	{/each}
</div>
