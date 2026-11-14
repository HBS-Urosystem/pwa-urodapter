<script lang="ts">
	import { onMount } from 'svelte';
	import ContentFlowNav from '$lib/components/ContentFlowNav.svelte';
	import DoctorPriorToInstillationPanel from '$lib/components/DoctorPriorToInstillationPanel.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { resolve } from '$app/paths';
	import { CONTENT_FLOW_NAV, SELF_INSTILLATION_BRANCH } from '$lib/data/content-flow-nav';
	import {
		CLINICIAN_DESCRIPTION,
		CLINICIAN_LABEL,
		CLINICIAN_PATH,
		PRIOR_PATH,
		SELF_INSTILLATION_DESCRIPTION,
		SELF_INSTILLATION_LABEL,
		SELF_INSTILLATION_PATH
	} from '$lib/data/site-nav';
	import { readLastInstructionsPath } from '$lib/instructions-tab-storage';
	import { siteContent } from '$lib/content';
	import { formatBlockMarkdown } from '$lib/markdown-blocks';
	import {
		persistPriorInstillationAudience,
		readStoredPriorInstillationAudience
	} from '$lib/prior-instillation-audience-storage';

	const flow = CONTENT_FLOW_NAV[PRIOR_PATH];

	const page = siteContent.pageCopy.preInstillation;
	const doctor = siteContent.pageCopy.doctorPriorInstillation;
	const pageTitle = `${page.title} | Urodapter`;
	const description =
		'Patient preparation before bladder instillation with UroDapter — sexual abstinence, empty bladder, residual urine; doctor preparation and disinfection guidance.';

	let audience = $state<'patient' | 'doctor'>('doctor');

	/** Female or male instructions page, whichever the reader last had open (female until read after mount). */
	let clinicianPath = $state(CLINICIAN_PATH);

	onMount(() => {
		audience = readStoredPriorInstillationAudience();
		clinicianPath = readLastInstructionsPath();
	});

	/**
	 * The content forks after this page. Both branches are offered; the one matching the selected tab
	 * comes first (Doctor → instillation by a clinician, Patient → self-instillation at home).
	 */
	const branches = $derived.by(() => {
		const clinician = {
			path: clinicianPath,
			label: CLINICIAN_LABEL,
			description: CLINICIAN_DESCRIPTION
		};
		const self = {
			path: SELF_INSTILLATION_PATH,
			label: SELF_INSTILLATION_LABEL,
			description: SELF_INSTILLATION_DESCRIPTION
		};
		return audience === 'patient' ? [self, clinician] : [clinician, self];
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

		<!-- Opaque page background behind the sticky tabs: covers the content scrolling under their rounded corners and in the 4px gap below the header (pt-1; -mt-1 keeps the unscrolled position). -mx-2 px-2 also covers the shadow of the content beside the tabs. -->
		<div class="sticky top-16 z-10 -mx-2 -mt-1 mb-6 bg-primary-20-opaque px-2 pt-1">
			<div role="tablist" class="tabs-box tabs flex w-full" aria-label="Audience">
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
		</div>

		{#if audience === 'patient'}
			<div class="card border border-base-300 bg-base-100 shadow-sm">
				<div class="card-body gap-8">
					<h2 class="!mt-4 mb-2 text-2xl">For patients</h2>
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

		<nav aria-labelledby="prior-next-heading" class="mt-10 flex flex-col gap-3">
			<h2 id="prior-next-heading" class="text-sm font-bold tracking-wider uppercase">
				Next: who performs the instillation?
			</h2>
			{#each branches as branch, i (branch.label)}
				<a
					href={resolve(branch.path as '/')}
					class={[
						'flex items-center justify-between gap-3 rounded-box border border-base-content px-5 py-4 no-underline transition-colors',
						i === 0
							? 'bg-base-content text-base-100 hover:bg-base-content/90'
							: 'bg-base-100 text-base-content hover:bg-base-200'
					]}
				>
					<span class="flex min-w-0 flex-col gap-0.5">
						<span class="[font-family:var(--font-heading)] text-lg leading-snug font-bold"
							>{branch.label}</span
						>
						<span class="text-sm">{branch.description}</span>
					</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M4 12h15M13 6l6 6-6 6" />
					</svg>
				</a>
			{/each}
		</nav>
	</div>
</section>
<ContentFlowNav
	prev={flow.prev}
	next={audience === 'patient' ? SELF_INSTILLATION_BRANCH : flow.next}
	lastInstructionsTabForNext={audience === 'doctor'}
/>
