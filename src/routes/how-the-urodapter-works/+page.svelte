<script lang="ts">
	import { onMount } from 'svelte';
	import ContentFlowNav from '$lib/components/ContentFlowNav.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import { CLINICIAN_BRANCH, CONTENT_FLOW_NAV } from '$lib/data/content-flow-nav';
	import { readLastInstillationBranch } from '$lib/instillation-branch-storage';
	import { siteContent } from '$lib/content';

	const flow = CONTENT_FLOW_NAV['/how-the-urodapter-works'];

	/**
	 * "Previous" leads back to the branch the reader last opened: "Instillation by a clinician" (the female or
	 * male instructions, whichever was open last) or "Self-instillation at home" (also when neither was opened).
	 */
	let clinicianLast = $state(false);
	onMount(() => {
		clinicianLast = readLastInstillationBranch() === 'clinician';
	});

	const { title, videoId, poster, notesParagraphs } = siteContent.pageCopy.educationalVideo;
	const pageTitle = `${title} | Urodapter`;
	const description =
		'Introductory video — how the UroDapter urological syringe adapter works for bladder instillation.';
</script>

<SeoHead title={pageTitle} {description} path="/how-the-urodapter-works" />

<section class="bg-primary/20 px-4 pt-8 pb-12">
	<div class="mx-auto max-w-3xl text-center">
		<h1 class="mb-4 text-3xl">{title}</h1>
		{#if notesParagraphs.length > 0}
			<div class="mx-auto mb-6 max-w-xl space-y-2 text-base-content/80">
				{#each notesParagraphs as para, i (`notes-${i}`)}
					<p>{para}</p>
				{/each}
			</div>
		{/if}
		<VideoPlayer
			class="aspect-video w-full rounded-lg bg-black shadow-lg"
			src={`/assets/video/${videoId}.mp4`}
			{poster}
			{title}
		/>
	</div>
</section>
<ContentFlowNav
	prev={clinicianLast ? CLINICIAN_BRANCH : flow.prev}
	next={flow.next}
	lastInstructionsTabForPrev={clinicianLast}
/>
