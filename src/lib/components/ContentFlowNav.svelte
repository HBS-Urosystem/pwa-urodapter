<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import type { ContentFlowNavEnd } from '$lib/data/content-flow-nav';
	import { INSTRUCTIONS_FEMALE_PATH, readLastInstructionsPath } from '$lib/instructions-tab-storage';

	let {
		prev,
		next,
		/** Use last-viewed female/male instructions URL for `prev` (e.g. FAQ → back to doctors). */
		lastInstructionsTabForPrev = false,
		/** Use last-viewed female/male instructions URL for `next` (e.g. pre-instillation → doctors). */
		lastInstructionsTabForNext = false
	}: {
		prev: ContentFlowNavEnd;
		next: ContentFlowNavEnd;
		lastInstructionsTabForPrev?: boolean;
		lastInstructionsTabForNext?: boolean;
	} = $props();

	/** Client-only: replaces SSR default female path when linking to last-viewed instructions tab */
	let instructionsPrevFromStorage = $state<string | null>(null);
	let instructionsNextFromStorage = $state<string | null>(null);

	const prevPathResolved = $derived(
		instructionsPrevFromStorage ??
			(lastInstructionsTabForPrev ? INSTRUCTIONS_FEMALE_PATH : prev.path)
	);
	const nextPathResolved = $derived(
		instructionsNextFromStorage ??
			(lastInstructionsTabForNext ? INSTRUCTIONS_FEMALE_PATH : next.path)
	);

	onMount(() => {
		if (lastInstructionsTabForPrev) instructionsPrevFromStorage = readLastInstructionsPath();
		if (lastInstructionsTabForNext) instructionsNextFromStorage = readLastInstructionsPath();
	});
</script>

<nav
	class="mt-8 flex flex-col gap-3 border-t border-base-300 pt-8 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4"
	aria-label="Section navigation"
>
	<a
		href={resolve(prevPathResolved as '/')}
		class="btn btn-outline shrink-0 justify-start gap-2 sm:max-w-[min(100%,20rem)]"
	>
		<span aria-hidden="true">←</span>
		<span class="min-w-0 text-left">{prev.label}</span>
	</a>
	<a
		href={resolve(nextPathResolved as '/')}
		class="btn btn-outline shrink-0 justify-end gap-2 sm:max-w-[min(100%,20rem)] sm:ml-auto"
	>
		<span class="min-w-0 text-right">{next.label}</span>
		<span aria-hidden="true">→</span>
	</a>
</nav>
