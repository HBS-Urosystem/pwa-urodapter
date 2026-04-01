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

<!-- -mx-4 + section px-4: top border spans full section width; sticky opaque bar at viewport bottom -->
<div
	class="-mx-4 mt-8 border-t border-base-300 bg-base-100 sticky bottom-0 z-20 pt-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
>
	<div class="mx-auto max-w-3xl">
		<nav
			class="mx-4 flex justify-between gap-4"
			aria-label="Section navigation"
		>
			<a
				href={resolve(prevPathResolved as '/')}
				class="btn min-h-8 h-auto btn-ghost btn-sm flex-50 shrink justify-start gap-2 w-auto"
			>
				<span aria-hidden="true">←</span>
				<span class="min-w-0 text-left">{prev.label}</span>
			</a>
			<a
				href={resolve(nextPathResolved as '/')}
				class="btn min-h-8 h-auto btn-ghost btn-sm flex-50 shrink justify-end gap-2 w-auto"
			>
				<span class="min-w-0 text-right">{next.label}</span>
				<span aria-hidden="true">→</span>
			</a>
		</nav>
	</div>
</div>
