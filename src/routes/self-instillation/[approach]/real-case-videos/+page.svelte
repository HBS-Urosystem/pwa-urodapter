<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ContentFlowNav from '$lib/components/ContentFlowNav.svelte';
	import PlayBadge from '$lib/components/PlayBadge.svelte';
	import RealCaseVideoList from '$lib/components/RealCaseVideoList.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import StepStrip from '$lib/components/StepStrip.svelte';
	import {
		REAL_CASE_ID,
		REAL_CASE_LABEL,
		REAL_CASE_VIDEOS,
		SELF_REAL_CASE_INTRO
	} from '$lib/data/real-case-videos';
	import { holdPageHeight, showStepTitle } from '$lib/step-title-scroll';

	/** The page after the last step of an approach: recordings of real instillations (female patients). */
	let { data } = $props();

	const approach = $derived(data.approach);
	const approachPath = $derived(`/self-instillation/${approach.id}`);
	const lastIndex = $derived(approach.steps.length - 1);
	const prev = $derived({
		path: `${approachPath}/${approach.steps[lastIndex].id}`,
		label: `${lastIndex + 1}.\u00A0${approach.steps[lastIndex].title}`
	});
	const next = $derived({ path: approachPath, label: 'Short summary' });

	/** After a change of step by a link, the title is in view (see `$lib/step-title-scroll`). */
	let titleEl = $state<HTMLElement>();
	beforeNavigate((navigation) => holdPageHeight(navigation, approachPath));
	afterNavigate(({ type }) => {
		if (type === 'link' || type === 'goto') showStepTitle(titleEl);
	});
</script>

<SeoHead
	title={`${REAL_CASE_LABEL} – ${approach.label} | Urodapter`}
	description="Recordings of real bladder instillations with the UroDapter."
	path={`${approachPath}/${REAL_CASE_ID}`}
/>

<section class="bg-primary/20 px-4 pt-8 pb-12">
	<div class="mx-auto max-w-3xl">
		<!-- Page title like on the clinician page: "Self-instillation / <approach>"; both parts link to their pages. -->
		<h1 class="mb-6 text-3xl">
			<a href={resolve('/self-instillation')} class="hover:underline">Self-instillation</a>
			<span class="text-base-content/40" aria-hidden="true">/</span>
			<a
				href={resolve('/self-instillation/[approach]', { approach: approach.id })}
				class="hover:underline">{approach.label}</a
			>
		</h1>

		<StepStrip approachId={approach.id} steps={approach.steps} currentId={REAL_CASE_ID} />

		<div
			bind:this={titleEl}
			class="mt-6 flex flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-5 text-base-content shadow-sm sm:p-8"
		>
			<div class="flex items-center gap-3">
				<PlayBadge />
				<h2 class="text-xl font-semibold">{REAL_CASE_LABEL}</h2>
			</div>
			<div class="flex flex-col gap-3 text-base">
				<p>{SELF_REAL_CASE_INTRO[0]}</p>
				<p><em>{SELF_REAL_CASE_INTRO[1]}</em></p>
			</div>
			<RealCaseVideoList videos={REAL_CASE_VIDEOS.female} />
		</div>
	</div>
</section>
<ContentFlowNav {prev} {next} prevStep="page" />
