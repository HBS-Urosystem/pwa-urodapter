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

<!-- Spacing above the bar lives in the page <section> padding (tinted), not margin on this block -->
<div
	class="w-full border-y border-base-300 bg-base-100 py-1 sticky bottom-0 z-10"
>
	<nav class="max-w-4xl mx-auto flex justify-between gap-4 px-6" aria-label="Section navigation">
		<a
			href={resolve(prevPathResolved as '/')}
			class="btn btn-ghost btn-sm min-h-8 h-auto min-w-0 shrink justify-start gap-2"
		>
			<span aria-hidden="true">←</span>
			<span class="min-w-0 text-left">{prev.label}</span>
		</a>
		<a
			href={resolve(nextPathResolved as '/')}
			class="btn btn-ghost btn-sm min-h-8 h-auto min-w-0 shrink justify-end gap-2"
		>
			<span class="min-w-0 text-right">{next.label}</span>
			<span aria-hidden="true">→</span>
		</a>
	</nav>
</div>
