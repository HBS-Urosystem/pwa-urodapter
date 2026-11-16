<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
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
	import { scrollToTabContent, tabsAreStuck } from '$lib/tab-scroll';

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
	 * Puts step `i` into the address. A step change replaces the current entry of the browser history, so the
	 * browser's Back button leaves the instructions in one go instead of walking back through the steps.
	 * The returned promise settles when the address change is complete.
	 */
	async function showStepInAddress(i: number): Promise<void> {
		if (!browser || pack.steps[i].id === stepId) return;
		await goto(resolve(stepPath(i) as '/'), {
			noScroll: true,
			keepFocus: true,
			replaceState: true
		});
	}

	const tabScope = $derived(storageKey.replace(/[^a-zA-Z0-9]+/g, '-'));
	const femaleTabId = $derived(`${tabScope}-tab-female`);
	const maleTabId = $derived(`${tabScope}-tab-male`);

	let stepIndex = $state(initialStepIndex);
	/** false until after mount + tick so prefers-reduced-motion is known */
	let allowStepAnim = $state(false);
	let stepsCarouselEl = $state<HTMLDivElement | undefined>(undefined);
	/** Region with `aria-label="Instruction step content"`: brought into view when the step changes */
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
		if (addressStepIndex < 0) void showStepInAddress(stepIndex);
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

	/** Whether more step circles are hidden to the left / right of the row; that edge of the row fades out. */
	let moreCirclesLeft = $state(false);
	let moreCirclesRight = $state(false);
	$effect(() => {
		const row = stepCirclesEl;
		if (!row) return;
		const update = () => {
			moreCirclesLeft = row.scrollLeft > 2;
			moreCirclesRight = row.scrollLeft + row.clientWidth < row.scrollWidth - 2;
		};
		update();
		row.addEventListener('scroll', update, { passive: true });
		const observer = new ResizeObserver(update);
		observer.observe(row);
		return () => {
			row.removeEventListener('scroll', update);
			observer.disconnect();
		};
	});
	const circlesFade = $derived(
		moreCirclesLeft || moreCirclesRight
			? `mask-image: linear-gradient(to right, ${moreCirclesLeft ? 'transparent, #000 3rem' : '#000, #000'}, ${moreCirclesRight ? '#000 calc(100% - 3rem), transparent' : '#000, #000'})`
			: undefined
	);

	/**
	 * The card is as tall as the current step, not as the longest step: the height of the swipeable row
	 * follows the content of the current step.
	 */
	let stepContentEls = $state<(HTMLElement | undefined)[]>([]);
	let currentStepHeight = $state(0);
	$effect(() => {
		const el = stepContentEls[stepIndex];
		if (!el) return;
		const update = () => {
			currentStepHeight = Math.ceil(el.getBoundingClientRect().height);
		};
		update();
		const observer = new ResizeObserver(update);
		observer.observe(el);
		return () => observer.disconnect();
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

	/** Sticky header (64px) plus the sticky tabs; matches `scroll-mt-24` on the card. */
	const STEP_TOP_MIN = 96;
	/**
	 * One rule for every way of changing the step (step circle, bottom bar, arrow keys, swipe, "Start at
	 * step 1"): afterwards the top of the card, with the step's heading, is in the visible area. The page
	 * scrolls only when the top of the card is hidden under the header and tabs or too far down the screen.
	 * Runs after the address change is complete, because with `noScroll` SvelteKit first puts the window
	 * back to the scroll position it had when the change started.
	 */
	function showStepTop() {
		const card = stepContentRegionEl;
		if (!browser || !card) return;
		const top = card.getBoundingClientRect().top;
		if (top >= STEP_TOP_MIN - 1 && top <= window.innerHeight * 0.5) return;
		card.scrollIntoView({ block: 'start', behavior: allowStepAnim ? 'smooth' : 'auto' });
	}
	afterNavigate(({ type, from, to }) => {
		if (type === 'enter' || !from || from.route.id !== to?.route.id) return;
		showStepTop();
	});

	/** Female / Male tabs: the page moves only when the tabs are held under the header (see `$lib/tab-scroll`). */
	async function onGenderTabClick(
		e: MouseEvent & { currentTarget: HTMLAnchorElement },
		href: string,
		isCurrentTab: boolean
	) {
		if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
		e.preventDefault();
		if (isCurrentTab) return;
		const stuck = tabsAreStuck();
		await goto(href, { noScroll: true });
		await tick();
		if (stuck) scrollToTabContent();
	}

	function goNextStep() {
		if (stepIndex < pack.steps.length - 1) void moveToStep(stepIndex + 1);
	}

	function goPrevStep() {
		if (stepIndex > 0) void moveToStep(stepIndex - 1);
	}

	/**
	 * The bottom bar steps through the instructions, as on the self-instillation step pages: the step's
	 * number and title; before the first step the previous section, after the last step the next section.
	 */
	const prevEnd = $derived(
		stepIndex > 0
			? { path: stepPath(stepIndex - 1), label: `${stepIndex}.\u00A0${pack.steps[stepIndex - 1].title}` }
			: flow?.prev
	);
	const nextEnd = $derived(
		stepIndex < pack.steps.length - 1
			? {
					path: stepPath(stepIndex + 1),
					label: `${stepIndex + 2}.\u00A0${pack.steps[stepIndex + 1].title}`
				}
			: flow?.next
	);

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
		<div data-tab-bar class="sticky top-16 z-10 -mx-2 -mt-1 mb-6 bg-primary-20-opaque px-2 pt-1">
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

		<!-- Step circles, the same size as on the self-instillation step pages (`StepStrip`): nine circles share the width with 6px gaps, each at most 44px. The steps beyond the ninth are reached by scrolling the row sideways; the edge of the row fades out where more circles are hidden. p-1 / -m-1 keeps the focus outline inside the scrolling row. -->
		<nav aria-label="Steps" class="mb-6" data-tab-content>
			<ol
				bind:this={stepCirclesEl}
				style={circlesFade}
				class="relative -m-1 flex gap-1.5 overflow-x-auto overscroll-x-contain p-1"
			>
				{#each pack.steps as s, i (s.id)}
					{@const current = i === stepIndex}
					<li class="shrink-0 grow-0 basis-[calc((100%-3rem)/9)]">
						<a
							href={resolve(stepPath(i) as '/')}
							data-sveltekit-noscroll
							data-sveltekit-keepfocus
							data-sveltekit-replacestate
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
					class="carousel w-full carousel-start items-start gap-2 overflow-y-hidden rounded-lg transition-[height] duration-200 motion-reduce:transition-none"
					style:height={currentStepHeight > 0 ? `${currentStepHeight}px` : undefined}
					aria-label="Instruction video steps"
				>
					{#each pack.steps as s, i (s.id)}
						<div class="carousel-item w-full">
							<div bind:this={stepContentEls[i]} class="flex w-full min-w-0 flex-col gap-4">
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
			</div>
		</div>

		<!-- Visible way back to the first step, as "Start at step 1" on the self-instillation summary page. -->
		{#if stepIndex > 0}
			<div class="mt-4">
				<a
					href={resolve(stepPath(0) as '/')}
					data-sveltekit-noscroll
					data-sveltekit-keepfocus
					data-sveltekit-replacestate
					class="btn border-base-content btn-outline btn-sm">Start at step 1</a
				>
			</div>
		{/if}
	</div>
</section>
{#if prevEnd && nextEnd}
	<ContentFlowNav
		prev={prevEnd}
		next={nextEnd}
		prevStep={stepIndex > 0 ? 'in-page' : undefined}
		nextStep={stepIndex < pack.steps.length - 1 ? 'in-page' : undefined}
	/>
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
