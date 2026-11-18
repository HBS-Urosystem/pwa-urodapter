<script lang="ts">
	type Props = {
		src: string;
		title: string;
		poster?: string;
		class?: string;
		/** `none` loads nothing until the reader starts the video (for pages with several videos). */
		preload?: 'none' | 'metadata' | 'auto';
	};

	let { src, title, poster, class: className = '', preload }: Props = $props();
</script>

<video class={className} controls playsinline aria-label={title} {poster} {preload}>
	<source {src} type="video/mp4" />
</video>
