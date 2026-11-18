<script lang="ts">
	import PlayIcon from '$lib/components/PlayIcon.svelte';
	import type { RealCaseVideo } from '$lib/data/real-case-videos';

	/**
	 * The real-case videos of one gender, one under the other, each with its title above it.
	 * Before a video is started, its poster is blurred and covered by a play button with the warning
	 * "Explicit medical content · 18+"; the whole picture starts the video. After the start the player's
	 * own controls take over. Nothing is downloaded before the start (`preload="none"`).
	 */
	let { videos }: { videos: readonly RealCaseVideo[] } = $props();

	const WARNING = 'Explicit medical content · 18+';

	let started = $state<Record<string, boolean>>({});
	let elements = $state<Record<string, HTMLVideoElement | undefined>>({});

	function start(src: string) {
		started[src] = true;
		void elements[src]?.play();
	}
</script>

<div class="flex flex-col gap-6">
	{#each videos as video (video.src)}
		<!-- Not a <figure>: daisyUI centres and shrinks the content of a figure inside a card. -->
		<div class="flex flex-col gap-2">
			{#if videos.length > 1}
				<h3 class="text-lg font-semibold">{video.title}</h3>
			{/if}
			<div class="relative overflow-hidden rounded-lg bg-black">
				<video
					bind:this={elements[video.src]}
					class="aspect-video w-full"
					controls={started[video.src]}
					playsinline
					preload="none"
					aria-label={`Real-case video: ${video.title}`}
				>
					<source src={video.src} type="video/mp4" />
				</video>

				{#if !started[video.src]}
					<button
						type="button"
						class="group absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden text-white focus-visible:outline-none"
						aria-label={`Play video: ${video.title}. ${WARNING}`}
						onclick={() => start(video.src)}
					>
						<!-- Blurred poster; scaled up so the blur does not leave light edges. -->
						<img
							src={video.poster}
							alt=""
							loading="lazy"
							class="absolute inset-0 h-full w-full scale-110 object-cover blur-xl brightness-75"
						/>
						<span
							class="relative flex size-16 items-center justify-center rounded-full bg-black/55 shadow-lg ring-2 ring-white/80 transition-transform group-hover:scale-110 group-focus-visible:scale-110 group-focus-visible:ring-4 sm:size-20"
							aria-hidden="true"
						>
							<PlayIcon class="ml-1 size-8 sm:size-10" />
						</span>
						<span
							class="relative rounded-full bg-black/55 px-3 py-1 text-sm font-semibold"
							aria-hidden="true">{WARNING}</span
						>
					</button>
				{/if}
			</div>
		</div>
	{/each}
</div>
