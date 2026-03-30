<script lang="ts">
	type Props = {
		src: string;
		title: string;
		poster?: string;
		class?: string;
	};

	let { src, title, poster, class: className = '' }: Props = $props();
</script>

<video class={className} controls playsinline aria-label={title} {poster}>
	<source {src} type="video/mp4" />
</video>
