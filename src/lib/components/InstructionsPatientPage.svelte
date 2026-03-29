<script lang="ts">
	import { tick, onMount } from 'svelte';
	import type { InstructionPack } from '$lib/content';
	import { formatInlineMarkdown } from '$lib/markdown-inline';

	const PLUS_LABELS: Record<number, string> = {
		1: 'Malformation of the orifice',
		3: 'Optimal angle',
		6: 'Optimal angle',
		9: 'How to avoid leakage'
	};

	let { storageKey, pack }: { storageKey: string; pack: InstructionPack } = $props();

	const tabScope = $derived(storageKey.replace(/[^a-zA-Z0-9]+/g, '-'));
	const beforeTabId = $derived(`${tabScope}-tab-before`);
	const stepsTabId = $derived(`${tabScope}-tab-steps`);
	const beforePanelId = $derived(`${tabScope}-panel-before`);
	const stepsPanelId = $derived(`${tabScope}-panel-steps`);

	let tab = $state<'before' | 'steps'>('before');
	let stepIndex = $state(0);
	let dialogEl = $state<HTMLDialogElement | undefined>(undefined);
	let activeModal = $state<
		null | 'emptyingTheBladder' | 'disinfection' | 'plus-1' | 'plus-3' | 'plus-6' | 'plus-9'
	>(null);
	/** Heading in the dialog: matches the button label that opened it */
	let modalTitle = $state('');

	const step = $derived(pack.steps[stepIndex] ?? pack.steps[0]);
	const plusModalId = $derived(
		'plusModalId' in step && step.plusModalId != null ? step.plusModalId : undefined
	);

	function persistStep() {
		try {
			localStorage.setItem(storageKey, String(stepIndex));
		} catch {
			/* ignore */
		}
	}

	onMount(() => {
		try {
			const raw = localStorage.getItem(storageKey);
			if (raw != null) {
				const n = parseInt(raw, 10);
				if (!Number.isNaN(n)) stepIndex = Math.min(Math.max(0, n), pack.steps.length - 1);
			}
		} catch {
			/* ignore */
		}
	});

	function goToInstructions() {
		tab = 'steps';
	}

	function prevStep() {
		stepIndex = Math.max(0, stepIndex - 1);
		persistStep();
	}

	function nextStep() {
		stepIndex = Math.min(pack.steps.length - 1, stepIndex + 1);
		persistStep();
	}

	/** Horizontal swipe between steps (mobile); same as ArrowLeft/ArrowRight. */
	const SWIPE_MIN_PX = 56;
	const SWIPE_DOMINANCE = 1.25;

	let swipeTouchId: number | null = null;
	let swipeStartX = 0;
	let swipeStartY = 0;

	function swipeTargetAllowed(target: EventTarget | null): boolean {
		if (!(target instanceof Element)) return false;
		return !target.closest('video, button, a, input, textarea, select, label');
	}

	function onStepsTouchStart(e: TouchEvent) {
		if (tab !== 'steps' || activeModal != null) return;
		if (e.touches.length !== 1) {
			swipeTouchId = null;
			return;
		}
		if (!swipeTargetAllowed(e.target)) return;
		const t = e.touches[0];
		swipeTouchId = t.identifier;
		swipeStartX = t.clientX;
		swipeStartY = t.clientY;
	}

	function onStepsTouchEnd(e: TouchEvent) {
		if (swipeTouchId === null || tab !== 'steps') return;
		let ended: Touch | undefined;
		for (let i = 0; i < e.changedTouches.length; i++) {
			const c = e.changedTouches.item(i);
			if (c?.identifier === swipeTouchId) {
				ended = c;
				break;
			}
		}
		swipeTouchId = null;
		if (!ended) return;
		const dx = ended.clientX - swipeStartX;
		const dy = ended.clientY - swipeStartY;
		if (Math.abs(dx) < SWIPE_MIN_PX) return;
		if (Math.abs(dx) < Math.abs(dy) * SWIPE_DOMINANCE) return;
		if (dx < 0) nextStep();
		else prevStep();
	}

	function onStepsTouchCancel() {
		swipeTouchId = null;
	}

	type ModalKind = NonNullable<typeof activeModal>;

	async function showDialog(kind: ModalKind, title: string) {
		activeModal = kind;
		modalTitle = title;
		await tick();
		dialogEl?.showModal();
	}

	function openPlusModal(id: 1 | 3 | 6 | 9) {
		const map = { 1: 'plus-1', 3: 'plus-3', 6: 'plus-6', 9: 'plus-9' } as const;
		void showDialog(map[id], PLUS_LABELS[id]);
	}

	function onModalBackdropClick(e: MouseEvent) {
		const dialog = e.currentTarget as HTMLDialogElement;
		const box = dialog.querySelector('.modal-box');
		if (!box || !(e.target instanceof Node) || box.contains(e.target)) return;
		dialog.close();
	}

	function modalParagraphs(): string[] {
		if (!activeModal) return [];
		if (activeModal === 'emptyingTheBladder') return [...pack.modals.emptyingTheBladder];
		if (activeModal === 'disinfection') return [...pack.modals.disinfection];
		if (activeModal === 'plus-1' && 'plus1' in pack.modals && pack.modals.plus1)
			return [...pack.modals.plus1.paragraphs];
		if (activeModal === 'plus-3' && 'plus3' in pack.modals && pack.modals.plus3)
			return [...pack.modals.plus3.paragraphs];
		if (activeModal === 'plus-6' && 'plus6' in pack.modals && pack.modals.plus6)
			return [...pack.modals.plus6.paragraphs];
		return [];
	}

	$effect(() => {
		if (typeof window === 'undefined' || tab !== 'steps') return;
		const onKey = (e: KeyboardEvent) => {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
			if (e.key === 'ArrowRight') {
				e.preventDefault();
				nextStep();
			}
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				prevStep();
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<svelte:head>
	<title>{pack.pageTitle} | Urodapter</title>
	<meta name="description" content={pack.pageTitle} />
</svelte:head>

<section class="min-h-full bg-base-200/40 px-4 py-6">
	<div class="mx-auto max-w-3xl">
		<h1 class="mb-6 text-2xl font-bold text-base-content">{pack.pageTitle}</h1>

		<div role="tablist" class="tabs tabs-box mb-6 w-full" aria-label="Instruction sections">
			<button
				type="button"
				id={beforeTabId}
				role="tab"
				class="tab"
				class:tab-active={tab === 'before'}
				aria-selected={tab === 'before'}
				aria-controls={beforePanelId}
				tabindex={tab === 'before' ? 0 : -1}
				onclick={() => (tab = 'before')}
			>
				Before starting
			</button>
			<button
				type="button"
				id={stepsTabId}
				role="tab"
				class="tab"
				class:tab-active={tab === 'steps'}
				aria-selected={tab === 'steps'}
				aria-controls={stepsPanelId}
				tabindex={tab === 'steps' ? 0 : -1}
				onclick={() => (tab = 'steps')}
			>
				Instructions
			</button>
		</div>

		<div
			id={beforePanelId}
			role="tabpanel"
			aria-labelledby={beforeTabId}
			hidden={tab !== 'before'}
			class="card border border-base-300 bg-base-100 shadow-sm"
		>
			<div class="card-body gap-6">
				<h2 class="card-title text-lg">Before starting</h2>
				{#each pack.beforeStarting as item (item.letter)}
					<div class="flex gap-4">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-content"
						>
							{item.letter}
						</div>
						<div class="min-w-0 flex-1">
							<div class="prose prose-sm max-w-none text-base-content">
								<p>{@html formatInlineMarkdown(item.body).replace(/\n/g, '<br/>')}</p>
							</div>
							{#each pack.modalButtons.filter((b) => b.letter === item.letter) as btn (btn.label)}
								<button
									type="button"
									class="btn mt-2 gap-1 text-primary btn-ghost btn-sm"
									onclick={() => void showDialog(btn.modal, btn.label)}
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
									{btn.label}
								</button>
							{/each}
						</div>
					</div>
				{/each}

				<button type="button" class="btn mt-2 btn-primary" onclick={goToInstructions}>
					Go to Instructions
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
							d="M13 7l5 5m0 0l-5 5m5-5H6"
						/></svg
					>
				</button>
			</div>
		</div>

		<div
			id={stepsPanelId}
			role="tabpanel"
			aria-labelledby={stepsTabId}
			hidden={tab !== 'steps'}
			class="card border border-base-300 bg-base-100 shadow-sm"
		>
			<div
				role="region"
				aria-label="Instruction step content"
				class="card-body gap-4 touch-pan-y"
				ontouchstart={onStepsTouchStart}
				ontouchend={onStepsTouchEnd}
				ontouchcancel={onStepsTouchCancel}
			>
				<div class="flex flex-wrap items-center justify-between gap-2 text-sm opacity-80">
					<span>Step {stepIndex + 1} / {pack.steps.length}</span>
					<span class="sm:hidden">Swipe horizontally to change steps</span>
					<span class="hidden sm:inline">Use arrow keys to change steps</span>
				</div>

				<h2 class="text-xl font-semibold">{step.title}</h2>

				{#if step.video != null}
					<video
						class="aspect-video w-full rounded-lg bg-black"
						controls
						playsinline
						loop
						aria-label={step.title}
					>
						<source src="/assets/video/{step.video}.mp4" type="video/mp4" />
					</video>
				{/if}

				<p class="whitespace-pre-line text-base-content/90">{step.body.trim()}</p>

				{#if plusModalId != null}
					<button
						type="button"
						class="btn gap-1 self-start text-primary btn-ghost btn-sm"
						onclick={() => plusModalId != null && openPlusModal(plusModalId)}
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
						{PLUS_LABELS[plusModalId]}
					</button>
				{/if}

				<div class="flex justify-between pt-4">
					<button
						type="button"
						class="btn btn-outline"
						disabled={stepIndex === 0}
						onclick={prevStep}
					>
						Previous
					</button>
					<button
						type="button"
						class="btn btn-primary"
						disabled={stepIndex >= pack.steps.length - 1}
						onclick={nextStep}
					>
						Next
					</button>
				</div>
			</div>
		</div>
	</div>
</section>

<dialog
	bind:this={dialogEl}
	class="modal"
	onclick={onModalBackdropClick}
	onclose={() => {
		activeModal = null;
		modalTitle = '';
	}}
>
	<div class="modal-box prose prose-sm max-h-[85vh] max-w-lg overflow-y-auto">
		{#if modalTitle}
			<h3 class="modal-title mb-4 text-lg font-bold">{modalTitle}</h3>
		{/if}
		{#if activeModal === 'plus-9' && 'plus9' in pack.modals && pack.modals.plus9}
			{#each pack.modals.plus9.subsections as sub (sub.label)}
				<h4 class="mt-4 font-semibold">{sub.label}</h4>
				{#each sub.paragraphs as p, j (`${sub.label}-${j}`)}
					<p>{p}</p>
				{/each}
			{/each}
		{:else}
			{#each modalParagraphs() as p, i (i)}
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
