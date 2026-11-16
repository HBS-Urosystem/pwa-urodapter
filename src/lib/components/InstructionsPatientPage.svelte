<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import { tick, onMount, untrack } from 'svelte';
	import type { InstructionPack } from '$lib/content';
	import ClipVideo from '$lib/components/ClipVideo.svelte';
	import ContentFlowNav from '$lib/components/ContentFlowNav.svelte';
	import NumberBadge from '$lib/components/NumberBadge.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { CONTENT_FLOW_NAV } from '$lib/data/content-flow-nav';
	import { CLINICIAN_LABEL } from '$lib/data/site-nav';
	import { persistLastInstillationBranch } from '$lib/instillation-branch-storage';
	import { persistLastInstructionsTab } from '$lib/instructions-tab-storage';
	import { formatInlineMarkdown } from '$lib/markdown-inline';

	const femalePath = '/instructions-for-doctors-on-female-patients';
	const malePath = '/instructions-for-doctors-on-male-patients';

	let {
		storageKey,
		pack,
		seoPath,
		activeGender,
		stepId
	}: {
		storageKey: string;
		pack: InstructionPack;
		seoPath: string;
		activeGender: 'female' | 'male';
		/**
		 * Step id from the address (`<seoPath>/<step id>`). Without it (or with an unknown id) the page
		 * opens the step the reader last had open and puts that step into the address.
		 */
		stepId?: string;
	} = $props();

	const seoDescription = $derived(
		`${pack.pageTitle} — Video instructions and tips for bladder instillation using UroDapter® for healthcare professionals.`
	);

	const flow = $derived(CONTENT_FLOW_NAV[seoPath]);

	function readStoredStepIndex(key: string, numSteps: number): number {
		if (!browser || numSteps < 1) return 0;
		try {
			const maxIdx = numSteps - 1;
			const raw = localStorage.getItem(key);
			if (raw == null) return 0;
			const n = parseInt(raw, 10);
			if (Number.isNaN(n)) return 0;
			return Math.min(Math.max(0, n), maxIdx);
		} catch {
			return 0;
		}
	}

	/** Index of the step named in the address, or -1 when the address names no (known) step. */
	const addressStepIndex = $derived(pack.steps.findIndex((s) => s.id === stepId));

	// svelte-ignore state_referenced_locally
	const initialStepIndex =
		addressStepIndex >= 0 ? addressStepIndex : readStoredStepIndex(storageKey, pack.steps.length);

	/** Address of a step: every step has its own, so it can be linked and the browser's Back button steps back. */
	function stepPath(i: number): string {
		return `${seoPath}/${pack.steps[i].id}`;
	}

	/**
	 * Puts step `i` into the address. A new history entry, unless `replace` (used when the address named no step).
	 * The returned promise settles when the address change is complete. With `noScroll` SvelteKit puts the
	 * window back to the scroll position it had when the change started, so any scrolling of the window
	 * has to wait for this promise.
	 */
	async function showStepInAddress(i: number, replace = false): Promise<void> {
		if (!browser || pack.steps[i].id === stepId) return;
		await goto(resolve(stepPath(i) as '/'), {
			noScroll: true,
			keepFocus: true,
			replaceState: replace
		});
	}

	const tabScope = $derived(storageKey.replace(/[^a-zA-Z0-9]+/g, '-'));
	const femaleTabId = $derived(`${tabScope}-tab-female`);
	const maleTabId = $derived(`${tabScope}-tab-male`);

	let stepIndex = $state(initialStepIndex);
	/** false until after mount + tick so prefers-reduced-motion is known */
	let allowStepAnim = $state(false);
	let stepsCarouselEl = $state<HTMLDivElement | undefined>(undefined);
	/** Region with `aria-label="Instruction step content"` — scroll into view on step prev/next */
	let stepContentRegionEl = $state<HTMLElement | undefined>(undefined);
	let carouselWidth = $state(0);
	let dialogMainEl = $state<HTMLDialogElement | undefined>(undefined);
	let activeModal = $state<null | 'plus-1' | 'plus-3' | 'plus-6' | 'plus-9'>(null);
	/** Heading in the dialog: matches the button label that opened it */
	let modalTitle = $state('');

	function persistStep() {
		try {
			localStorage.setItem(storageKey, String(stepIndex));
		} catch {
			/* ignore */
		}
	}

	function alignCarouselToStep() {
		const el = stepsCarouselEl;
		if (!el) return;
		const w = carouselWidth;
		if (w <= 0) return;
		const maxIdx = Math.max(0, pack.steps.length - 1);
		const idx = Math.min(maxIdx, stepIndex);
		el.scrollLeft = idx * w;
	}

	function syncStepIndexFromCarouselScroll() {
		const el = stepsCarouselEl;
		if (!el) return;
		const w = carouselWidth;
		if (w <= 0) return;
		const i = Math.round(el.scrollLeft / w);
		const clamped = Math.max(0, Math.min(pack.steps.length - 1, i));
		if (clamped !== stepIndex) {
			stepIndex = clamped;
			persistStep();
			void showStepInAddress(clamped);
		}
	}

	/** Shows step `i`. The returned promise settles when the step's address is in place (see `showStepInAddress`). */
	function moveToStep(i: number): Promise<void> {
		const clamped = Math.max(0, Math.min(pack.steps.length - 1, i));
		stepIndex = clamped;
		persistStep();
		const addressChanged = showStepInAddress(clamped);
		const el = stepsCarouselEl;
		const w = carouselWidth;
		if (el && w > 0) {
			el.scrollTo({
				left: clamped * w,
				behavior: allowStepAnim ? 'smooth' : 'auto'
			});
		}
		return addressChanged;
	}

	onMount(() => {
		persistLastInstructionsTab(activeGender);
		persistLastInstillationBranch('clinician');
		persistStep();
		if (addressStepIndex < 0) void showStepInAddress(stepIndex, true);
		void tick().then(() => {
			allowStepAnim = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			requestAnimationFrame(() => alignCarouselToStep());
		});
	});

	/** The address changed (step circle, browser Back / Forward): show that step. */
	$effect(() => {
		const i = addressStepIndex;
		if (i < 0) return;
		untrack(() => {
			if (i !== stepIndex) void moveToStep(i);
		});
	});

	/** The row of step circles. It scrolls sideways when the circles do not fit; the current step is kept in view. */
	let stepCirclesEl = $state<HTMLOListElement | undefined>(undefined);
	$effect(() => {
		const row = stepCirclesEl;
		const item = row?.children[stepIndex];
		if (!row || !(item instanceof HTMLElement)) return;
		const left = item.offsetLeft - (row.clientWidth - item.offsetWidth) / 2;
		row.scrollTo({ left, behavior: untrack(() => allowStepAnim) ? 'smooth' : 'auto' });
	});

	$effect(() => {
		if (!browser) return;
		const el = stepsCarouselEl;
		if (!el) return;
		const updateWidth = () => {
			carouselWidth = Math.round(el.getBoundingClientRect().width);
		};
		updateWidth();
		const observer = new ResizeObserver(updateWidth);
		observer.observe(el);
		return () => observer.disconnect();
	});

	$effect(() => {
		if (!browser) return;
		const el = stepsCarouselEl;
		if (!el) return;
		let debounce: ReturnType<typeof setTimeout> | undefined;
		const onScrollSettle = () => {
			clearTimeout(debounce);
			debounce = setTimeout(() => syncStepIndexFromCarouselScroll(), 100);
		};
		const onScrollEnd = () => syncStepIndexFromCarouselScroll();
		el.addEventListener('scrollend', onScrollEnd);
		el.addEventListener('scroll', onScrollSettle, { passive: true });
		return () => {
			el.removeEventListener('scrollend', onScrollEnd);
			el.removeEventListener('scroll', onScrollSettle);
			clearTimeout(debounce);
		};
	});

	$effect(() => {
		if (!browser) return;
		const onResize = () => alignCarouselToStep();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});

	function scrollInstructionStepContentIntoView() {
		if (!browser || !stepContentRegionEl) return;
		stepContentRegionEl.scrollIntoView({
			block: 'start',
			behavior: allowStepAnim ? 'smooth' : 'auto'
		});
	}

	/** Match prior-instillation Patient/Doctor tabs: smooth scroll to top after gender tab navigation */
	async function onGenderTabClick(
		e: MouseEvent & { currentTarget: HTMLAnchorElement },
		href: string,
		isCurrentTab: boolean
	) {
		if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
		if (isCurrentTab) {
			e.preventDefault();
			return;
		}
		e.preventDefault();
		await goto(href, { noScroll: true });
		await tick();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	async function goNextStep() {
		if (stepIndex >= pack.steps.length - 1) return;
		await moveToStep(stepIndex + 1);
		await tick();
		scrollInstructionStepContentIntoView();
	}

	async function startOver() {
		await moveToStep(0);
		await tick();
		scrollInstructionStepContentIntoView();
	}

	async function goPrevStep() {
		if (stepIndex <= 0) return;
		await moveToStep(stepIndex - 1);
		await tick();
		scrollInstructionStepContentIntoView();
	}

	type ModalKind = NonNullable<typeof activeModal>;

	async function showDialog(kind: ModalKind, title: string) {
		activeModal = kind;
		modalTitle = title;
		await tick();
		dialogMainEl?.showModal();
	}

	function openPlusModal(id: 1 | 3 | 6 | 9, label: string) {
		const map = { 1: 'plus-1', 3: 'plus-3', 6: 'plus-6', 9: 'plus-9' } as const;
		void showDialog(map[id], label);
	}

	function onModalBackdropClick(e: MouseEvent) {
		const dialog = e.currentTarget as HTMLDialogElement;
		const box = dialog.querySelector('.modal-box');
		if (!box || !(e.target instanceof Node) || box.contains(e.target)) return;
		dialog.close();
	}

	function mainModalParagraphs(): string[] {
		if (!activeModal) return [];
		if (activeModal === 'plus-1' && 'plus1' in pack.modals && pack.modals.plus1)
			return [...pack.modals.plus1.paragraphs];
		if (activeModal === 'plus-3' && 'plus3' in pack.modals && pack.modals.plus3)
			return [...pack.modals.plus3.paragraphs];
		if (activeModal === 'plus-6' && 'plus6' in pack.modals && pack.modals.plus6)
			return [...pack.modals.plus6.paragraphs];
		return [];
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		const onKey = (e: KeyboardEvent) => {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
			if (e.key === 'ArrowRight') {
				e.preventDefault();
				goNextStep();
			}
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				goPrevStep();
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<SeoHead title={`${pack.pageTitle} | Urodapter`} description={seoDescription} path={seoPath} />

<section class="bg-primary/20 px-4 pt-8 pb-12">
	<div class="mx-auto max-w-3xl">
		<h1 class="mb-6 text-3xl">{CLINICIAN_LABEL}</h1>

		<!-- Opaque page background behind the sticky tabs: covers the content scrolling under their rounded corners and in the 4px gap below the header (pt-1; -mt-1 keeps the unscrolled position). -mx-2 px-2 also covers the shadow of the content beside the tabs. -->
		<div class="sticky top-16 z-10 -mx-2 -mt-1 mb-6 bg-primary-20-opaque px-2 pt-1">
			<div role="tablist" class="tabs-box tabs flex w-full" aria-label="Patient type">
				<a
					id={femaleTabId}
					href={resolve(femalePath)}
					role="tab"
					class="tab flex-1 basis-0"
					class:tab-active={activeGender === 'female'}
					aria-selected={activeGender === 'female'}
					onclick={(e) => onGenderTabClick(e, resolve(femalePath), activeGender === 'female')}
				>
					Female patients
				</a>
				<a
					id={maleTabId}
					href={resolve(malePath)}
					role="tab"
					class="tab flex-1 basis-0"
					class:tab-active={activeGender === 'male'}
					aria-selected={activeGender === 'male'}
					onclick={(e) => onGenderTabClick(e, resolve(malePath), activeGender === 'male')}
				>
					Male patients
				</a>
			</div>
		</div>

		<!-- Step circles, the same size as on the self-instillation step pages (`StepStrip`): nine circles share the width with 6px gaps, each at most 44px. The steps beyond the ninth are reached by scrolling the row sideways. p-1 / -m-1 keeps the focus outline inside the scrolling row. -->
		<nav aria-label="Steps" class="mb-6">
			<ol
				bind:this={stepCirclesEl}
				class="relative -m-1 flex gap-1.5 overflow-x-auto overscroll-x-contain p-1"
			>
				{#each pack.steps as s, i (s.id)}
					{@const current = i === stepIndex}
					<li class="shrink-0 grow-0 basis-[calc((100%-3rem)/9)]">
						<a
							href={resolve(stepPath(i) as '/')}
							data-sveltekit-noscroll
							data-sveltekit-keepfocus
							class={[
								'mx-auto flex aspect-square max-w-11 items-center justify-center rounded-full border text-base font-bold no-underline transition-colors',
								current
									? 'border-base-content bg-base-content text-base-100'
									: 'border-base-content/30 bg-transparent text-base-content hover:border-base-content'
							]}
							aria-current={current ? 'step' : undefined}
							aria-label={`Step ${i + 1}: ${s.title}`}
							title={s.title}>{i + 1}</a
						>
					</li>
				{/each}
			</ol>
		</nav>

		<div
			bind:this={stepContentRegionEl}
			class="card scroll-mt-24 border border-base-300 bg-base-100 shadow-sm"
			role="region"
			aria-label="Instruction step content"
		>
			<div class="card-body gap-4">
				<div
					bind:this={stepsCarouselEl}
					class="carousel w-full carousel-start gap-2 rounded-lg"
					aria-label="Instruction video steps"
				>
					{#each pack.steps as s, i (s.id)}
						<div class="carousel-item w-full">
							<div class="flex w-full min-w-0 flex-col gap-4">
								<div class="flex items-center gap-3">
									<NumberBadge value={i + 1} />
									<h2 class="text-xl font-semibold">{s.title}</h2>
								</div>

								{#if s.video != null}
									<ClipVideo
										class="instruction-step-video aspect-video w-full rounded-lg bg-black"
										src={`/assets/video/${s.video}.mp4`}
										poster={s.poster}
										title={s.title}
									/>
								{/if}

								{#each s.paragraphs as para, pi (`${s.id}-${pi}`)}
									<p class="text-base text-base-content/90">
										<!-- eslint-disable-next-line svelte/no-at-html-tags -->
										{@html formatInlineMarkdown(para).replace(/\n/g, '<br/>')}
									</p>
								{/each}

								{#if 'plusModalId' in s && s.plusModalId != null}
									<button
										type="button"
										class="btn h-auto min-h-8 gap-1 self-start text-left text-primary btn-ghost btn-sm"
										onclick={() => {
											openPlusModal(
												s.plusModalId!,
												'plusLabel' in s && s.plusLabel ? s.plusLabel : ''
											);
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
											/></svg
										>
										{'plusLabel' in s && s.plusLabel ? s.plusLabel : ''}
									</button>
								{/if}
							</div>
						</div>
					{/each}
				</div>

				<div class="flex justify-between pt-4">
					<button
						type="button"
						class="btn btn-square btn-outline"
						disabled={stepIndex === 0}
						onclick={goPrevStep}
						aria-label="Step back"
						title="Step back"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					{#if stepIndex >= pack.steps.length - 1}
						<button
							type="button"
							class="btn btn-square btn-primary"
							onclick={() => void startOver()}
							aria-label="Start over"
							title="Start over"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<g transform={`scale(${24 / 256})`}>
									<path
										stroke-width={(256 / 18).toString()}
										d="M228,184a4,4,0,0,1-8,0A91.99984,91.99984,0,0,0,62.94629,118.94629L37.77441,144.11816H92.11816a4,4,0,0,1,0,8h-64a4.03169,4.03169,0,0,1-.78375-.0791c-.11542-.023-.22211-.0664-.33368-.09863a2.339,2.339,0,0,1-.7879-.32568c-.10455-.05713-.21307-.103-.31323-.16993a4.026,4.026,0,0,1-1.10834-1.10888c-.06494-.09717-.10931-.20264-.16486-.30371a3.972,3.972,0,0,1-.20221-.38428,3.9069,3.9069,0,0,1-.12646-.40723c-.03333-.11328-.07721-.22168-.10053-.33935a4.01022,4.01022,0,0,1-.079-.78321v-64a4,4,0,0,1,8,0v54.34375L57.29,113.29A100,100,0,0,1,228,184Z"
									/>
								</g>
							</svg>
						</button>
					{:else}
						<button
							type="button"
							class="btn btn-square btn-primary"
							onclick={goNextStep}
							aria-label="Next step"
							title="Next step"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
							</svg>
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>
{#if flow}
	<ContentFlowNav prev={flow.prev} next={flow.next} />
{/if}

<dialog
	bind:this={dialogMainEl}
	class="modal"
	onclick={onModalBackdropClick}
	onclose={() => {
		activeModal = null;
		modalTitle = '';
	}}
>
	<div class="relative modal-box prose max-h-[85vh] max-w-lg overflow-y-auto text-base-content">
		<form method="dialog" class="not-prose absolute end-2 top-2 z-10">
			<button type="submit" class="btn btn-square btn-ghost btn-sm" aria-label="Close dialog">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</form>
		{#if modalTitle}
			<h3 class="modal-title mb-4 pe-12 text-lg font-bold">{modalTitle}</h3>
		{:else}
			<div class="mb-4 h-10 shrink-0" aria-hidden="true"></div>
		{/if}
		{#if activeModal === 'plus-9' && 'plus9' in pack.modals && pack.modals.plus9}
			<div class="not-prose flex flex-col gap-4">
				{#each pack.modals.plus9.subsections as sub (sub.label)}
					<div class="flex gap-4">
						<div
							class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-content"
						>
							{sub.label}
						</div>
						<div class="min-w-0 flex-1">
							{#each sub.paragraphs as p, j (`${sub.label}-${j}`)}
								<p class="mt-0 mb-3 last:mb-0">{p}</p>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			{#each mainModalParagraphs() as p, i (i)}
				<p>{p}</p>
			{/each}
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button type="submit" class="hidden">close</button>
	</form>
</dialog>
