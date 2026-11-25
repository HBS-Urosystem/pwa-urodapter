<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import type { ContentFlowNavEnd } from '$lib/data/content-flow-nav';
	import {
		INSTRUCTIONS_FEMALE_PATH,
		readLastInstructionsPath
	} from '$lib/instructions-tab-storage';

	let {
		prev,
		next,
		/** Use last-viewed female/male instructions URL for `prev` (e.g. FAQ → back to doctors). */
		lastInstructionsTabForPrev = false,
		/** Use last-viewed female/male instructions URL for `next` (e.g. pre-instillation → doctors). */
		lastInstructionsTabForNext = false,
		/** The previous / next end is a step of the same set of steps (see `StepLink`). */
		prevStep,
		nextStep
	}: {
		prev: ContentFlowNavEnd;
		next: ContentFlowNavEnd;
		lastInstructionsTabForPrev?: boolean;
		lastInstructionsTabForNext?: boolean;
		prevStep?: StepLink;
		nextStep?: StepLink;
	} = $props();

	/**
	 * A link from one step to another replaces the current entry of the browser history, so the browser's
	 * Back button leaves the steps in one go.
	 * The link keeps the scroll position; the page itself brings the new step into view.
	 * - `'page'`: the step is a page of its own (self-instillation, see `$lib/step-title-scroll`).
	 * - `'in-page'`: the step is shown on the same page, which also keeps the focus.
	 */
	type StepLink = 'page' | 'in-page';

	/** Client-only: the last-viewed female/male instructions page; the female page until it is read after mount. */
	let lastInstructionsPath = $state(INSTRUCTIONS_FEMALE_PATH);

	const prevPathResolved = $derived(lastInstructionsTabForPrev ? lastInstructionsPath : prev.path);
	const nextPathResolved = $derived(lastInstructionsTabForNext ? lastInstructionsPath : next.path);

	onMount(() => {
		lastInstructionsPath = readLastInstructionsPath();
	});
</script>

<!-- Spacing above the bar lives in the page <section> padding (tinted), not margin on this block -->
<div class="content-flow-nav sticky bottom-0 z-10 w-full border-y border-base-300 bg-base-100 py-1">
	<nav class="mx-auto flex max-w-4xl justify-between gap-4 px-6" aria-label="Section navigation">
		<a
			href={resolve(prevPathResolved as '/')}
			data-sveltekit-replacestate={prevStep ? '' : undefined}
			data-sveltekit-noscroll={prevStep ? '' : undefined}
			data-sveltekit-keepfocus={prevStep === 'in-page' ? '' : undefined}
			class="btn h-auto min-h-10 min-w-0 shrink justify-start gap-2 btn-ghost"
		>
			<span aria-hidden="true">←</span>
			<span class="min-w-0 text-left">{prev.label}</span>
		</a>
		<a
			href={resolve(nextPathResolved as '/')}
			data-sveltekit-replacestate={nextStep ? '' : undefined}
			data-sveltekit-noscroll={nextStep ? '' : undefined}
			data-sveltekit-keepfocus={nextStep === 'in-page' ? '' : undefined}
			class="btn h-auto min-h-10 min-w-0 shrink justify-end gap-2 btn-ghost"
		>
			<span class="min-w-0 text-right">{next.label}</span>
			<span aria-hidden="true">→</span>
		</a>
	</nav>
</div>
