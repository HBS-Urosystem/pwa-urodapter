<script lang="ts" module>
	/** Open or closed state of each section by its key; kept in memory until the page is reloaded. */
	// Not reactive on purpose: it is only read when a section is created.
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const openSections = new Map<string, boolean>();
</script>

<script lang="ts">
	import ClipVideo from './ClipVideo.svelte';

	/**
	 * An illustration or a video that stays closed until the reader opens it.
	 * A picture shows full screen when selected; a video uses its own full-screen control and stops when the section is closed.
	 * Each section remembers whether it is open by its `key` (unique per page and position) until the page is reloaded.
	 */
	type Figure = { src: string; alt: string; width: number; height: number };
	type Video = { src: string; poster: string; title: string };

	let {
		key,
		label,
		figure,
		video
	}: { key: string; label: string } & (
		| { figure: Figure; video?: never }
		| { video: Video; figure?: never }
	) = $props();

	// The parent recreates this component when the key changes, so reading the key once is enough.
	// svelte-ignore state_referenced_locally
	let open = $state(openSections.get(key) ?? false);

	let dialog = $state<HTMLDialogElement>();
	let videoEl = $state<HTMLVideoElement>();
</script>

<details
	class="not-prose collapse-arrow collapse my-6 border border-base-300 bg-base-100"
	bind:open
	ontoggle={() => {
		openSections.set(key, open);
		if (!open) videoEl?.pause();
	}}
>
	<summary class="collapse-title min-h-12 font-semibold">{label}</summary>
	<div class="collapse-content">
		{#if video}
			<ClipVideo
				bind:element={videoEl}
				class="instruction-step-video aspect-video w-full rounded-box bg-black"
				src={video.src}
				poster={video.poster}
				title={video.title}
			/>
		{:else if figure}
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
		{/if}
	</div>
</details>

{#if figure}
	<!-- Full-screen view: the picture fits the screen; a tap anywhere, the Close button or Escape closes it. -->
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
{/if}
