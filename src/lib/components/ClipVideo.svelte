<script lang="ts">
	/**
	 * A short instruction video with a large play button over it. While the video is paused, the whole
	 * picture is a play button (transparent, only the round icon is drawn). Before the first start no
	 * player controls are shown; after it, the bottom strip stays free for the player's own control bar
	 * (pause, seek, full screen).
	 */
	type Props = {
		src: string;
		poster?: string | null;
		title: string;
		/** Classes for the `<video>` element. */
		class?: string;
		/** Exposes the element, e.g. to pause it from outside. */
		element?: HTMLVideoElement;
	};

	let { src, poster, title, class: className = '', element = $bindable() }: Props = $props();

	let paused = $state(true);
	let started = $state(false);
</script>

<div class="relative">
	<video
		bind:this={element}
		bind:paused
		class={className}
		controls={started}
		muted
		playsinline
		loop
		preload="none"
		poster={poster ?? undefined}
		aria-label={title}
		onplay={() => (started = true)}
	>
		<source {src} type="video/mp4" />
	</video>

	{#if paused}
		<button
			type="button"
			class={[
				'peer absolute inset-x-0 top-0 cursor-pointer rounded-[inherit] bg-transparent',
				started ? 'bottom-12' : 'bottom-0'
			]}
			aria-label={`Play video: ${title}`}
			onclick={() => element?.play()}
		></button>
		<!-- The icon is centred on the whole video, also when the button leaves the control bar free. -->
		<span
			class="pointer-events-none absolute top-1/2 left-1/2 flex size-16 -translate-1/2 items-center justify-center rounded-full bg-black/55 text-white shadow-lg ring-2 ring-white/80 transition-transform peer-hover:scale-110 peer-focus-visible:scale-110 sm:size-20"
			aria-hidden="true"
		>
			<svg viewBox="0 0 24 24" class="size-8 fill-current sm:size-10">
				<path
					d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.04-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14Z"
				/>
			</svg>
		</span>
	{/if}
</div>
