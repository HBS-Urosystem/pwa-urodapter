<script lang="ts">
	import { resolve } from '$app/paths';
	import ContentFlowNav from '$lib/components/ContentFlowNav.svelte';
	import FigureDisclosure from '$lib/components/FigureDisclosure.svelte';
	import NumberBadge from '$lib/components/NumberBadge.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import StepStrip from '$lib/components/StepStrip.svelte';
	import { JOURNEYS } from '$lib/data/journeys';
	import { formatBlockMarkdown } from '$lib/markdown-blocks';
	import { rememberPatientStep } from '$lib/patient-progress-storage';

	let { data } = $props();

	const approach = $derived(data.approach);
	const index = $derived(data.index);
	const step = $derived(approach.steps[index]);
	const hub = JOURNEYS.patient;
	const approachPath = $derived(`/self-instillation/${approach.id}`);

	/** Previous / next step; the summary page before step 1 and after the last step. */
	const prev = $derived(
		index > 0
			? {
					path: `${approachPath}/${approach.steps[index - 1].id}`,
					label: approach.steps[index - 1].title
				}
			: { path: approachPath, label: 'One-page summary' }
	);
	const next = $derived(
		index < approach.steps.length - 1
			? {
					path: `${approachPath}/${approach.steps[index + 1].id}`,
					label: approach.steps[index + 1].title
				}
			: { path: approachPath, label: 'One-page summary' }
	);

	$effect(() => {
		rememberPatientStep(approach.id, step.id);
	});
</script>

<SeoHead
	title={`${step.title} – ${approach.label} | Urodapter`}
	description={step.summary}
	path={`${approachPath}/${step.id}`}
/>

<section class="bg-primary/20 px-4 pt-3 pb-12">
	<div class="mx-auto max-w-2xl">
		<div class="breadcrumbs text-sm">
			<ul>
				<li><a href={resolve('/self-instillation')}>{hub.tocLabel}</a></li>
				<li>
					<a href={resolve('/self-instillation/[approach]', { approach: approach.id })}
						>{approach.label}</a
					>
				</li>
				<li aria-current="page">Step {index + 1}</li>
			</ul>
		</div>

		<div class="mt-2">
			<StepStrip approachId={approach.id} steps={approach.steps} currentId={step.id} />
		</div>

		<div class="mt-6 flex items-center gap-4">
			<NumberBadge value={index + 1} size="lg" />
			<h1 class="text-2xl leading-tight sm:text-3xl">{step.title}</h1>
		</div>

		<article
			class="prose mt-6 max-w-none rounded-box border border-base-300 bg-base-100 p-5 text-[1.0625rem] leading-relaxed text-base-content shadow-sm sm:p-8 sm:text-lg"
		>
			{#each step.segments as segment, i (i)}
				{#if segment.kind === 'md'}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html formatBlockMarkdown(segment.text, {
						orderedLists: true,
						h3Class: 'text-xl !mt-8 mb-2'
					})}
				{:else if segment.id === 'anatomy'}
					<FigureDisclosure label="Anatomical figure" figure={data.figures.anatomy} />
				{:else}
					<figure class="not-prose my-6">
						<img
							src={data.figures.sealing.src}
							alt={data.figures.sealing.alt}
							width={data.figures.sealing.width}
							height={data.figures.sealing.height}
							loading="lazy"
							class="mx-auto h-auto w-full max-w-md rounded-box bg-white"
						/>
					</figure>
				{/if}
			{/each}

			{#if 'tips' in step && step.tips}
				<div
					role="note"
					class="not-prose mt-8 alert block border-info/60 bg-info/15 text-base text-base-content"
				>
					<h2 class="mb-2 text-lg font-semibold">{step.tips.title}</h2>
					<ul class="list-disc space-y-1 pl-5">
						{#each step.tips.items as item (item)}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if index === approach.steps.length - 1}
				<div
					role="note"
					class="not-prose mt-8 alert items-start text-base alert-warning text-base-content dark:text-base-100"
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
					<p>{approach.safety}</p>
				</div>
			{/if}
		</article>
	</div>
</section>
<ContentFlowNav {prev} {next} />
