<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import ContentFlowNav from '$lib/components/ContentFlowNav.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import StepSummaryList from '$lib/components/StepSummaryList.svelte';
	import { JOURNEYS } from '$lib/data/journeys';
	import MirrorText from '$lib/mirror/MirrorText.svelte';
	import { formatBlockMarkdown } from '$lib/markdown-blocks';
	import { readPatientProgress, type PatientProgress } from '$lib/patient-progress-storage';

	let { data } = $props();

	const approach = $derived(data.approach);
	const hub = JOURNEYS.patient;

	/** Last opened step per approach; read after mount so the prerendered HTML and hydration match. */
	let progress = $state<PatientProgress>({});
	onMount(() => {
		progress = readPatientProgress();
	});
	/** Index of the step the reader last opened in this approach (-1 = none). */
	const lastIndex = $derived(approach.steps.findIndex((s) => s.id === progress[approach.id]));
</script>

<SeoHead
	title={`${approach.seoTitle} | Urodapter`}
	description={hub.sections.find((s) => s.title === approach.label)?.description ??
		approach.seoTitle}
	path={`/self-instillation/${approach.id}`}
/>

<section class="bg-primary/20 px-4 pt-6 pb-12">
	<div class="mx-auto max-w-2xl">
		<!-- Opaque page background behind the sticky tabs: covers the content scrolling under their rounded corners and in the 4px gap below the header (pt-1; -mt-1 keeps the unscrolled position). -mx-2 px-2 also covers the shadow of the content beside the tabs. -->
		<nav
			aria-label="Approaches"
			class="sticky top-16 z-10 -mx-2 -mt-1 mb-6 bg-primary-20-opaque px-2 pt-1"
		>
			<ul class="tabs-box tabs flex w-full flex-nowrap">
				{#each data.approaches as a (a.id)}
					{@const current = a.id === approach.id}
					<li class="flex flex-1 basis-0">
						<a
							href={resolve('/self-instillation/[approach]', { approach: a.id })}
							class={[
								'tab h-auto min-h-11 w-full px-2 py-2 text-center text-sm leading-tight',
								current
									? 'bg-base-100 font-semibold text-base-content shadow-sm'
									: 'text-base-content'
							]}
							aria-current={current ? 'page' : undefined}>{a.label}</a
						>
					</li>
				{/each}
			</ul>
		</nav>

		<h1 class="mb-4 text-3xl">{approach.label}</h1>
		<div class="prose max-w-none text-base-content">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html formatBlockMarkdown(approach.intro)}
		</div>

		<div class="mt-6 flex flex-wrap gap-3">
			{#if lastIndex > 0}
				<a
					href={resolve('/self-instillation/[approach]/[step]', {
						approach: approach.id,
						step: approach.steps[lastIndex].id
					})}
					class="btn border-base-content bg-base-content text-base-100 hover:bg-base-content/90"
					>Continue at step {lastIndex + 1}</a
				>
				<a
					href={resolve('/self-instillation/[approach]/[step]', {
						approach: approach.id,
						step: approach.steps[0].id
					})}
					class="btn border-base-content btn-outline">Start at step 1</a
				>
			{:else}
				<a
					href={resolve('/self-instillation/[approach]/[step]', {
						approach: approach.id,
						step: approach.steps[0].id
					})}
					class="btn border-base-content bg-base-content text-base-100 hover:bg-base-content/90"
					>Read the detailed instructions</a
				>
			{/if}
		</div>

		<h2 class="mt-10 mb-3 text-2xl">One-page summary</h2>
		<StepSummaryList approachId={approach.id} steps={approach.steps} />

		<div
			role="note"
			class="mt-8 alert items-start text-base alert-warning text-base-content dark:text-base-100"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
				/>
			</svg>
			<p><MirrorText text={approach.safety} class="!text-base-content" /></p>
		</div>
	</div>
</section>
<ContentFlowNav
	prev={{ path: hub.tocPath, label: hub.tocLabel }}
	next={{
		path: `/self-instillation/${approach.id}/${approach.steps[0].id}`,
		label: `1. ${approach.steps[0].title}`
	}}
/>
