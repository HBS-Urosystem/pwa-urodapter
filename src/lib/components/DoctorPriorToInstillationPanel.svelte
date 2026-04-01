<script lang="ts">
	import { tick } from 'svelte';
	import type { SiteContent } from '$lib/content';
	import { formatBlockMarkdown } from '$lib/markdown-blocks';

	type DoctorPrior = SiteContent['pageCopy']['doctorPriorInstillation'];

	let { data }: { data: DoctorPrior } = $props();

	let dialogEl = $state<HTMLDialogElement | undefined>(undefined);
	let activeModal = $state<null | 'emptyingTheBladder' | 'disinfectionFemale' | 'disinfectionMale'>(
		null
	);
	let modalTitle = $state('');

	async function openModal(
		kind: 'emptyingTheBladder' | 'disinfectionFemale' | 'disinfectionMale',
		title: string
	) {
		activeModal = kind;
		modalTitle = title;
		await tick();
		dialogEl?.showModal();
	}

	function modalParagraphs(): string[] {
		if (!activeModal) return [];
		if (activeModal === 'emptyingTheBladder') return [...data.modals.emptyingTheBladder];
		if (activeModal === 'disinfectionFemale') return [...data.modals.disinfectionFemale];
		if (activeModal === 'disinfectionMale') return [...data.modals.disinfectionMale];
		return [];
	}

	function onModalBackdropClick(e: MouseEvent) {
		const dialog = e.currentTarget as HTMLDialogElement;
		const box = dialog.querySelector('.modal-box');
		if (!box || !(e.target instanceof Node) || box.contains(e.target)) return;
		dialog.close();
	}
</script>

<div class="card border border-base-300 bg-base-100 shadow-sm">
	<div class="card-body gap-8">
		<h2 class="text-2xl !mt-4 mb-2">For healthcare professionals</h2>
		{#each data.beforeStarting as item (item.letter)}
			<div class="flex gap-4">
				<div
					class="mt-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-content"
				>
					{item.letter}
				</div>
				<div class="min-w-0 flex-1">
					<div class="prose max-w-none flex-1 text-base-content max-sm:prose-sm">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html formatBlockMarkdown(item.paragraphs.join('\n\n'), {
							h3Class: 'text-lg !mt-4 mb-2'
						})}
					</div>
					{#each data.modalButtons.filter((b) => b.letter === item.letter) as btn (btn.label)}
						<button
							type="button"
							class="btn mt-2 gap-1 text-primary btn-ghost btn-sm min-h-8 h-auto text-left"
							onclick={() => void openModal(btn.modal, btn.label)}
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
	</div>
</div>

<dialog
	bind:this={dialogEl}
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
		{#each modalParagraphs() as p, i (i)}
			<p>{p}</p>
		{/each}
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
