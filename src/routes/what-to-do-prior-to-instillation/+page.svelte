<script lang="ts">
	import { onMount } from 'svelte';
	import ContentFlowNav from '$lib/components/ContentFlowNav.svelte';
	import DoctorPriorToInstillationPanel from '$lib/components/DoctorPriorToInstillationPanel.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { CONTENT_FLOW_NAV } from '$lib/data/content-flow-nav';
	import { siteContent } from '$lib/content';
	import { formatBlockMarkdown } from '$lib/markdown-blocks';
	import {
		persistPriorInstillationAudience,
		readStoredPriorInstillationAudience
	} from '$lib/prior-instillation-audience-storage';

	const flow = CONTENT_FLOW_NAV['/what-to-do-prior-to-instillation'];

	const page = siteContent.pageCopy.preInstillation;
	const doctor = siteContent.pageCopy.doctorPriorInstillation;
	const pageTitle = `${page.title} | Urodapter`;
	const description =
		'Patient preparation before bladder instillation with UroDapter — sexual abstinence, empty bladder, residual urine; doctor preparation and disinfection guidance.';

	let audience = $state<'patient' | 'doctor'>('doctor');

	onMount(() => {
		audience = readStoredPriorInstillationAudience();
	});

	function setAudience(next: 'patient' | 'doctor') {
		if (next === audience) return;
		audience = next;
		persistPriorInstillationAudience(next);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<SeoHead title={pageTitle} {description} path="/what-to-do-prior-to-instillation" />

<section class="bg-primary/20 px-4 pt-8 pb-12">
	<div class="mx-auto max-w-3xl">
		<h1 class="mb-6 text-3xl">{page.title}</h1>

		<div role="tablist" class="tabs-box mb-6 tabs flex w-full sticky top-16 z-10" aria-label="Audience">
			<button
				type="button"
				role="tab"
				class="tab flex-1 basis-0"
				class:tab-active={audience === 'doctor'}
				aria-selected={audience === 'doctor'}
				tabindex={audience === 'doctor' ? 0 : -1}
				onclick={() => setAudience('doctor')}
			>
				Doctor
			</button>
			<button
				type="button"
				role="tab"
				class="tab flex-1 basis-0"
				class:tab-active={audience === 'patient'}
				aria-selected={audience === 'patient'}
				tabindex={audience === 'patient' ? 0 : -1}
				onclick={() => setAudience('patient')}
			>
				Patient
			</button>
		</div>

		{#if audience === 'patient'}
			<div class="card border border-base-300 bg-base-100 shadow-sm">
				<div class="card-body gap-8">
					<h2 class="text-2xl !mt-4 mb-2">For patients</h2>
					{#each page.sections as s (s.letter)}
						<div class="flex gap-4">
							<div
								class="mt-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-content"
							>
								{s.letter}
							</div>
							<div class="min-w-0 flex-1">
								<div class="prose max-w-none flex-1 text-base-content max-sm:prose-sm">
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									{@html formatBlockMarkdown(s.body, {
										h3Class: 'text-lg !mt-4 mb-2'
									})}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<DoctorPriorToInstillationPanel data={doctor} />
		{/if}
	</div>
</section>
<ContentFlowNav prev={flow.prev} next={flow.next} lastInstructionsTabForNext />
