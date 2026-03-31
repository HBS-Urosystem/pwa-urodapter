<script lang="ts">
	import DoctorPriorToInstillationPanel from '$lib/components/DoctorPriorToInstillationPanel.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { siteContent } from '$lib/content';
	import { formatBlockMarkdown } from '$lib/markdown-blocks';

	const page = siteContent.pageCopy.preInstillation;
	const doctor = siteContent.pageCopy.doctorPriorInstillation;
	const pageTitle = `${page.title} | Urodapter`;
	const description =
		'Patient preparation before bladder instillation with UroDapter — sexual abstinence, empty bladder, residual urine; doctor preparation (A–C) and disinfection guidance.';

	let audience = $state<'patient' | 'doctor'>('patient');
</script>

<SeoHead title={pageTitle} {description} path="/what-to-do-prior-to-instillation" />

<section class="min-h-full bg-base-200/40 px-4 py-8">
	<div class="mx-auto max-w-3xl">
		<h1 class="mb-6 text-3xl font-bold">{page.title}</h1>

		<div role="tablist" class="tabs-box mb-6 tabs w-full" aria-label="Audience">
			<button
				type="button"
				role="tab"
				class="tab"
				class:tab-active={audience === 'patient'}
				aria-selected={audience === 'patient'}
				tabindex={audience === 'patient' ? 0 : -1}
				onclick={() => (audience = 'patient')}
			>
				Patient
			</button>
			<button
				type="button"
				role="tab"
				class="tab"
				class:tab-active={audience === 'doctor'}
				aria-selected={audience === 'doctor'}
				tabindex={audience === 'doctor' ? 0 : -1}
				onclick={() => (audience = 'doctor')}
			>
				Doctor
			</button>
		</div>

		{#if audience === 'patient'}
			<div class="card border border-base-300 bg-base-100 shadow-sm">
				<div class="card-body gap-8">
					{#each page.sections as s (s.letter)}
						<div class="flex gap-4">
							<div
								class="mt-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-content"
							>
								{s.letter}
							</div>
							<div class="prose max-w-none flex-1 text-base-content max-sm:prose-sm">
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html formatBlockMarkdown(s.body)}
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
