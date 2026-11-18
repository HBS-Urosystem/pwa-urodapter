<script lang="ts">
	import { resolve } from '$app/paths';
	import ContentFlowNav from '$lib/components/ContentFlowNav.svelte';
	import PlayBadge from '$lib/components/PlayBadge.svelte';
	import RealCaseVideoList from '$lib/components/RealCaseVideoList.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import StepStrip from '$lib/components/StepStrip.svelte';
	import { REAL_CASE_ID, REAL_CASE_LABEL, REAL_CASE_VIDEOS } from '$lib/data/real-case-videos';

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
</script>

<SeoHead
	title={`${REAL_CASE_LABEL} – ${approach.label} | Urodapter`}
	description="Recordings of real bladder instillations with the UroDapter."
	path={`${approachPath}/${REAL_CASE_ID}`}
/>

<section class="bg-primary/20 px-4 pt-3 pb-12">
	<div class="mx-auto max-w-3xl">
		<div class="breadcrumbs text-sm">
			<ul>
				<li><a href={resolve('/self-instillation')}>Self-instillation</a></li>
				<li>
					<a href={resolve('/self-instillation/[approach]', { approach: approach.id })}
						>{approach.label}</a
					>
				</li>
				<li aria-current="page">{REAL_CASE_LABEL}</li>
			</ul>
		</div>

		<div class="mt-2">
			<StepStrip approachId={approach.id} steps={approach.steps} currentId={REAL_CASE_ID} />
		</div>

		<div class="mt-6 flex items-center gap-4">
			<PlayBadge size="lg" light />
			<h1 class="text-2xl leading-tight sm:text-3xl">{REAL_CASE_LABEL}</h1>
		</div>

		<div
			class="mt-6 rounded-box border border-base-300 bg-base-100 p-5 text-base-content shadow-sm sm:p-8"
		>
			<RealCaseVideoList videos={REAL_CASE_VIDEOS.female} />
		</div>
	</div>
</section>
<ContentFlowNav {prev} {next} prevStep="page" />
