<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ContentFlowNav from '$lib/components/ContentFlowNav.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import StepSummaryList from '$lib/components/StepSummaryList.svelte';
	import { siteContent } from '$lib/content';
	import { patientNav } from '$lib/content/generated-patient-nav';
	import { CONTENT_FLOW_NAV } from '$lib/data/content-flow-nav';
	import { SELF_INSTILLATION_LABEL, SELF_INSTILLATION_PATH } from '$lib/data/site-nav';
	import { formatBlockMarkdown } from '$lib/markdown-blocks';
	import { rememberTabsStuck, scrollToTabContent, tabsWereStuck } from '$lib/tab-scroll';
	import {
		readLastPatientApproach,
		readPatientProgress,
		rememberPatientApproach,
		type PatientProgress
	} from '$lib/patient-progress-storage';

	type Approach = (typeof siteContent.patient.approaches)[number];

	/**
	 * The "Self-instillation at home" page: the three approaches are tabs, each tab has its own address
	 * (`/self-instillation/<approach>`). With `entry` the page is shown at `/self-instillation` itself:
	 * it shows the first approach, with the "Read first" text open, and moves on to the approach the
	 * reader last opened, if there is one.
	 */
	let {
		approach,
		approaches,
		entry = false
	}: { approach: Approach; approaches: readonly Approach[]; entry?: boolean } = $props();

	const overview = siteContent.patient.overview;
	const flow = CONTENT_FLOW_NAV[SELF_INSTILLATION_PATH];

	const path = $derived(
		entry ? SELF_INSTILLATION_PATH : `${SELF_INSTILLATION_PATH}/${approach.id}`
	);
	/** Image and one-sentence description of the approach (from `content/patient/*.yaml`). */
	const nav = $derived(patientNav.find((n) => n.id === approach.id));
	const pictureOf = (id: string) => patientNav.find((n) => n.id === id)?.image;

	/**
	 * From 640px each tab shows its approach's picture above its label. The tab bar then sticks so much higher
	 * than the header's bottom edge that the pictures slide under the header and only the labels stay in view:
	 * `picturesDepth` is the distance from the top of the bar to the bottom of the pictures (0 below 640px).
	 */
	let picturesDepth = $state(0);
	function trackPicturesDepth(bar: HTMLElement) {
		const measure = () => {
			const rect = bar.querySelector('img')?.getBoundingClientRect();
			picturesDepth = rect && rect.height > 0 ? rect.bottom - bar.getBoundingClientRect().top : 0;
		};
		const observer = new ResizeObserver(measure);
		observer.observe(bar);
		measure();
		return () => observer.disconnect();
	}

	/** Last opened step per approach; read after mount so the prerendered HTML and hydration match. */
	let progress = $state<PatientProgress>({});
	onMount(() => {
		progress = readPatientProgress();
		if (!entry) return;
		const last = readLastPatientApproach();
		if (last && approaches.some((a) => a.id === last)) {
			void goto(resolve('/self-instillation/[approach]', { approach: last }), {
				replaceState: true,
				noScroll: true
			});
		}
	});
	$effect(() => {
		if (!entry) rememberPatientApproach(approach.id);
	});

	/** The paragraph that asks the reader to choose an approach tab (`overview.howToUse`). */
	let tabPrompt = $state<HTMLElement>();
	/** Height of the sticky header (64px) plus a 16px gap; matches `scroll-mt-20` on the paragraph. */
	const TAB_PROMPT_TOP = 80;
	/**
	 * When the "Read first" text closes, the page becomes shorter and the content below moves up under the
	 * reader. If that leaves the tab prompt above the visible area, scroll it to the top of the visible area.
	 */
	function showTabPromptAfterClose() {
		if (tabPrompt && tabPrompt.getBoundingClientRect().top < TAB_PROMPT_TOP) {
			tabPrompt.scrollIntoView({ block: 'start' });
		}
	}
	/**
	 * The "Read first" text closes with an animation, so the page keeps getting shorter for a moment after
	 * the `toggle` event. For one second after closing, every change of the element's height repeats the
	 * check, so the tab prompt stays in the visible area until the animation has finished.
	 */
	let readFirst = $state<HTMLDetailsElement>();
	let readFirstClosedAt = 0;
	/** What keeps the reader's place while "Read first" closes: the tab prompt, or the content below the tabs. */
	let keepPlaceAfterClose = showTabPromptAfterClose;
	function onReadFirstToggle() {
		if (!readFirst || readFirst.open) return;
		readFirstClosedAt = performance.now();
		keepPlaceAfterClose();
	}
	$effect(() => {
		if (!readFirst) return;
		const observer = new ResizeObserver(() => {
			if (performance.now() - readFirstClosedAt < 1000) keepPlaceAfterClose();
		});
		observer.observe(readFirst);
		return () => observer.disconnect();
	});
	/**
	 * Choosing an approach tab (see `$lib/tab-scroll` for the rule shared by all tabs):
	 * - the tabs were held under the header: scroll to the start of the content below the tabs;
	 * - otherwise the page does not move, except that when "Read first" closes (it is open at the entry
	 *   address and closed on the approach tabs) the tab prompt is kept in the visible area.
	 */
	let readFirstWasOpen = false;
	beforeNavigate(() => {
		rememberTabsStuck();
		readFirstWasOpen = readFirst?.open ?? false;
	});
	afterNavigate(({ type, from, to }) => {
		const tabChange =
			!entry &&
			type !== 'popstate' &&
			type !== 'enter' &&
			to?.route.id === '/self-instillation/[approach]' &&
			(from?.route.id === '/self-instillation' ||
				from?.route.id === '/self-instillation/[approach]');
		if (!tabChange) return;
		const closing = readFirstWasOpen || from?.route.id === '/self-instillation';
		if (tabsWereStuck()) {
			keepPlaceAfterClose = () => scrollToTabContent(false);
			scrollToTabContent(!closing);
		} else {
			keepPlaceAfterClose = showTabPromptAfterClose;
			if (closing) showTabPromptAfterClose();
		}
	});

	/** Index of the step the reader last opened in this approach (-1 = none). */
	const lastIndex = $derived(approach.steps.findIndex((s) => s.id === progress[approach.id]));
</script>

<SeoHead
	title={entry ? `${SELF_INSTILLATION_LABEL} | Urodapter` : `${approach.seoTitle} | Urodapter`}
	description={nav?.description ?? approach.seoTitle}
	{path}
/>

<section class="bg-primary/20 px-4 pt-8 pb-12">
	<div class="mx-auto max-w-3xl">
		<h1 class="mb-6 text-3xl">{SELF_INSTILLATION_LABEL}</h1>

		<!-- The text every reader should read once. Open at the entry address, closed on the approach tabs. -->
		<details
			class="collapse-arrow collapse border border-base-300 bg-base-100"
			open={entry}
			bind:this={readFirst}
			ontoggle={onReadFirstToggle}
		>
			<summary class="collapse-title font-semibold">Read first: {overview.title}</summary>
			<div class="collapse-content">
				<div class="prose max-w-none text-base-content">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html formatBlockMarkdown(overview.intro)}
				</div>

				<div
					role="note"
					class="my-6 alert items-start border-info/60 bg-info/15 text-base text-base-content"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="h-6 w-6 shrink-0 stroke-current"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<div>{@html formatBlockMarkdown(overview.practise)}</div>
				</div>

				<div class="prose max-w-none text-base-content">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html formatBlockMarkdown(overview.notForEveryone)}
				</div>
			</div>
		</details>

		<div bind:this={tabPrompt} class="prose mt-6 mb-4 max-w-none scroll-mt-20 text-base-content">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html formatBlockMarkdown(overview.howToUse)}
		</div>

		<!-- Opaque page background behind the sticky tabs: covers the content scrolling under their rounded corners and in the 4px gap below the header (pt-1; -mt-1 keeps the unscrolled position). -mx-2 px-2 also covers the shadow of the content beside the tabs. -->
		<nav
			{@attach trackPicturesDepth}
			aria-label="Approaches"
			data-tab-bar
			class="sticky top-16 z-10 -mx-2 -mt-1 mb-6 bg-primary-20-opaque px-2 pt-1"
			style:top={picturesDepth > 0 ? `calc(4rem - ${picturesDepth}px)` : undefined}
		>
			<ul class="tabs-box tabs flex w-full flex-nowrap">
				{#each approaches as a (a.id)}
					{@const current = a.id === approach.id}
					<li class="flex flex-1 basis-0">
						<a
							href={resolve('/self-instillation/[approach]', { approach: a.id })}
							data-sveltekit-noscroll
							class={[
								'group tab h-auto min-h-11 w-full flex-col gap-2 rounded-field px-2 py-2 text-center text-sm leading-tight sm:p-1.5 sm:pb-2.5',
								current && 'tab-active font-semibold'
							]}
							aria-current={current ? 'page' : undefined}
						>
							<!-- From 640px: the approach's picture above the label (the large picture below the tabs is shown only under 640px). -->
							<img
								src={pictureOf(a.id)}
								alt=""
								width="384"
								height="308"
								class={[
									'hidden aspect-[384/308] h-auto w-full rounded-field object-cover sm:block',
									!current && 'opacity-80 transition-opacity group-hover:opacity-100'
								]}
							/>
							<span>{a.label}</span></a
						>
					</li>
				{/each}
			</ul>
		</nav>

		<div data-tab-content></div>
		{#if nav}
			<img
				src={nav.image}
				alt={nav.imageAlt}
				width="384"
				height="308"
				class="mx-auto mb-6 block aspect-[384/308] h-auto w-full max-w-sm rounded-box object-cover sm:hidden"
			/>
		{/if}

		<h2 class="mb-4 text-2xl">{approach.label}</h2>
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

		<h2 class="mt-10 mb-3 text-2xl">Short summary</h2>
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
			<p>{approach.safety}</p>
		</div>
	</div>
</section>
<ContentFlowNav prev={flow.prev} next={flow.next} />
