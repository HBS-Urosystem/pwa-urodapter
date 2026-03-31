<script lang="ts">
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import { tick, onMount } from 'svelte';
	import type { InstructionPack } from '$lib/content';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { formatInlineMarkdown } from '$lib/markdown-inline';

	const femalePath = '/instructions-for-doctors-on-female-patients';
	const malePath = '/instructions-for-doctors-on-male-patients';

	let {
		storageKey,
		pack,
		seoPath,
		activeGender
	}: {
		storageKey: string;
		pack: InstructionPack;
		seoPath: string;
		activeGender: 'female' | 'male';
	} = $props();

	const seoDescription = $derived(
		`${pack.pageTitle} — Video instructions and tips for bladder instillation using UroDapter® for healthcare professionals.`
	);

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

	// svelte-ignore state_referenced_locally
	const initialStepIndex = readStoredStepIndex(storageKey, pack.steps.length);

	const tabScope = $derived(storageKey.replace(/[^a-zA-Z0-9]+/g, '-'));
	const femaleTabId = $derived(`${tabScope}-tab-female`);
	const maleTabId = $derived(`${tabScope}-tab-male`);

	let stepIndex = $state(initialStepIndex);
	/** false until after mount + tick so prefers-reduced-motion is known */
	let allowStepAnim = $state(false);
	let stepsCarouselEl = $state<HTMLDivElement | undefined>(undefined);
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
		}
	}

	function moveToStep(i: number) {
		const clamped = Math.max(0, Math.min(pack.steps.length - 1, i));
		stepIndex = clamped;
		persistStep();
		const el = stepsCarouselEl;
		if (!el) return;
		const w = carouselWidth;
		if (w <= 0) return;
		el.scrollTo({
			left: clamped * w,
			behavior: allowStepAnim ? 'smooth' : 'auto'
		});
	}

	onMount(() => {
		void tick().then(() => {
			allowStepAnim = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			requestAnimationFrame(() => alignCarouselToStep());
		});
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

	function goNextStep() {
		if (stepIndex >= pack.steps.length - 1) return;
		moveToStep(stepIndex + 1);
	}

	function startOver() {
		moveToStep(0);
	}

	function goPrevStep() {
		if (stepIndex <= 0) return;
		moveToStep(stepIndex - 1);
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

<section class="min-h-full bg-base-200/40 px-4 py-8">
	<div class="mx-auto max-w-3xl">
		<h1 class="mb-6 text-3xl font-bold">{pack.pageTitle}</h1>

		<div role="tablist" class="tabs-box mb-6 tabs w-full" aria-label="Patient type">
			<a
				id={femaleTabId}
				href={resolve(femalePath)}
				role="tab"
				class="tab"
				class:tab-active={activeGender === 'female'}
				aria-selected={activeGender === 'female'}
			>
				Female patients
			</a>
			<a
				id={maleTabId}
				href={resolve(malePath)}
				role="tab"
				class="tab"
				class:tab-active={activeGender === 'male'}
				aria-selected={activeGender === 'male'}
			>
				Male patients
			</a>
		</div>

		<div
			class="card border border-base-300 bg-base-100 shadow-sm"
			role="region"
			aria-label="Instruction step content"
		>
			<div class="card-body gap-4">
				<div class="flex flex-wrap items-center justify-between gap-2 text-sm opacity-80">
					<span>Step {stepIndex + 1} / {pack.steps.length}</span>
					<span class="sm:hidden">Swipe to change steps</span>
					<span class="hidden sm:inline">Use arrow keys to change steps</span>
				</div>

				<div
					bind:this={stepsCarouselEl}
					class="carousel w-full carousel-start rounded-lg"
					aria-label="Instruction video steps"
				>
					{#each pack.steps as s (s.id)}
						<div class="carousel-item w-full">
							<div class="flex w-full min-w-0 flex-col gap-4">
								<h2 class="text-xl font-semibold">{s.title}</h2>

								{#if s.video != null}
									<video
										class="instruction-step-video aspect-video w-full rounded-lg bg-black"
										controls
										muted
										playsinline
										loop
										preload="none"
										poster={s.poster ?? undefined}
										aria-label={s.title}
									>
										<source src="/assets/video/{s.video}.mp4" type="video/mp4" />
									</video>
								{/if}

								{#each s.paragraphs as para, pi (`${s.id}-${pi}`)}
									<p class="text-base-content/90">
										<!-- eslint-disable-next-line svelte/no-at-html-tags -->
										{@html formatInlineMarkdown(para).replace(/\n/g, '<br/>')}
									</p>
								{/each}

								{#if 'plusModalId' in s && s.plusModalId != null}
									<button
										type="button"
										class="btn gap-1 self-start text-primary btn-ghost btn-sm"
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
						class="btn btn-outline"
						disabled={stepIndex === 0}
						onclick={goPrevStep}
					>
						Previous
					</button>
					{#if stepIndex >= pack.steps.length - 1}
						<button type="button" class="btn btn-primary" onclick={startOver}>Start over</button>
					{:else}
						<button type="button" class="btn btn-primary" onclick={goNextStep}>Next</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

<dialog
	bind:this={dialogMainEl}
	class="modal"
	onclick={onModalBackdropClick}
	onclose={() => {
		activeModal = null;
		modalTitle = '';
	}}
>
	<div
		class="modal-box prose max-h-[85vh] max-w-lg overflow-y-auto text-base-content max-sm:prose-sm"
	>
		{#if modalTitle}
			<h3 class="modal-title mb-4 text-lg font-bold">{modalTitle}</h3>
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
		<div class="modal-action">
			<form method="dialog">
				<button type="submit" class="btn">Close</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button type="submit" class="hidden">close</button>
	</form>
</dialog>
