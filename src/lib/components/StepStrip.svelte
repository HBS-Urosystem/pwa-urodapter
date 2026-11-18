<script lang="ts">
	import { resolve } from '$app/paths';
	import PlayIcon from '$lib/components/PlayIcon.svelte';
	import { REAL_CASE_ID, REAL_CASE_LABEL } from '$lib/data/real-case-videos';

	/** Links to the summary (0), all steps of an approach and, last, the real-case video page (a play icon instead of a number). A step link replaces the current entry of the browser history, so the browser's Back button leaves the steps in one go; the current step is filled with the theme's dark colour, the others are transparent. */
	let {
		approachId,
		steps,
		currentId
	}: {
		approachId: string;
		steps: readonly { id: string; title: string }[];
		currentId: string;
	} = $props();
</script>

<nav aria-label="Steps">
	<!-- The circles are 44px wide and spread over the full width, at least 4px apart; only when they do not fit does a circle shrink, down to 28px, and below that the row scrolls sideways. p-1 / -m-1 keeps the focus outline inside the scrolling row. -->
	<ol class="-m-1 flex justify-between gap-1 overflow-x-auto overscroll-x-contain p-1">
		<li class="max-w-11 min-w-7 flex-1">
			<a
				href={resolve('/self-instillation/[approach]', { approach: approachId })}
				class="mx-auto flex aspect-square max-w-11 items-center justify-center rounded-full border border-base-content/30 bg-transparent text-base-content no-underline transition-colors hover:border-base-content"
				aria-label="Short summary"
				title="Short summary"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
				</svg>
			</a>
		</li>
		{#each steps as step, i (step.id)}
			{@const current = step.id === currentId}
			<li class="max-w-11 min-w-7 flex-1">
				<a
					href={resolve('/self-instillation/[approach]/[step]', {
						approach: approachId,
						step: step.id
					})}
					data-sveltekit-replacestate
					class={[
						'mx-auto flex aspect-square max-w-11 items-center justify-center rounded-full border text-base font-bold no-underline transition-colors',
						current
							? 'border-base-content bg-base-content text-base-100'
							: 'border-base-content/30 bg-transparent text-base-content hover:border-base-content'
					]}
					aria-current={current ? 'step' : undefined}
					aria-label={`Step ${i + 1}: ${step.title}`}
					title={step.title}>{i + 1}</a
				>
			</li>
		{/each}
		<li class="max-w-11 min-w-7 flex-1">
			<a
				href={resolve('/self-instillation/[approach]/real-case-videos', { approach: approachId })}
				data-sveltekit-replacestate
				class={[
					'mx-auto flex aspect-square max-w-11 items-center justify-center rounded-full border no-underline transition-colors',
					currentId === REAL_CASE_ID
						? 'border-base-content bg-base-content text-base-100'
						: 'border-base-content/30 bg-transparent text-base-content hover:border-base-content'
				]}
				aria-current={currentId === REAL_CASE_ID ? 'step' : undefined}
				aria-label={REAL_CASE_LABEL}
				title={REAL_CASE_LABEL}><PlayIcon class="ml-0.5 h-4 w-4" /></a
			>
		</li>
	</ol>
</nav>
