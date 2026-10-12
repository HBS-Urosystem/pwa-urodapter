<script lang="ts">
	/** An illustration that stays closed until the reader opens it; selecting the picture shows it full screen. */
	let {
		label,
		figure
	}: {
		label: string;
		figure: { src: string; alt: string; width: number; height: number };
	} = $props();

	let dialog = $state<HTMLDialogElement>();
</script>

<details class="not-prose collapse-arrow collapse my-6 border border-base-300 bg-base-100">
	<summary class="collapse-title min-h-12 font-semibold">{label}</summary>
	<div class="collapse-content">
		<button
			type="button"
			class="block w-full cursor-zoom-in rounded-box"
			aria-label={`${label}: show full screen`}
			onclick={() => dialog?.showModal()}
		>
			<img
				src={figure.src}
				alt={figure.alt}
				width={figure.width}
				height={figure.height}
				loading="lazy"
				class="h-auto w-full rounded-box bg-white"
			/>
		</button>
	</div>
</details>

<!-- Full-screen view: the picture fits the screen; a tap anywhere, the Close button or Escape closes it. -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	class="m-0 h-dvh max-h-none w-dvw max-w-none bg-black/90 p-0 backdrop:bg-black"
	aria-label={label}
	onclick={() => dialog?.close()}
>
	<div class="flex h-full w-full items-center justify-center p-2">
		<img
			src={figure.src}
			alt={figure.alt}
			class="max-h-full max-w-full cursor-zoom-out rounded-box bg-white object-contain"
		/>
	</div>
	<button
		type="button"
		class="btn absolute top-3 right-3 btn-circle btn-neutral"
		aria-label="Close"
		onclick={(e) => {
			e.stopPropagation();
			dialog?.close();
		}}
	>
		✕
	</button>
</dialog>
