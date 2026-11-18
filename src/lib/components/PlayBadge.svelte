<script lang="ts">
	import PlayIcon from '$lib/components/PlayIcon.svelte';

	/** Round play icon in place of a step number (`NumberBadge`), for the real-case video page. Same sizes and colours. */
	let {
		size = 'md',
		light = false,
		class: className = ''
	}: { size?: 'md' | 'lg'; light?: boolean; class?: string } = $props();
</script>

<span
	class={[
		'inline-flex shrink-0 items-center justify-center rounded-full',
		light ? 'bg-white text-black' : 'bg-base-content text-base-100',
		size === 'lg' ? 'h-12 w-12' : 'h-10 w-10',
		className
	]}
	aria-hidden="true"
>
	<PlayIcon class={size === 'lg' ? 'ml-0.5 h-6 w-6' : 'ml-0.5 h-5 w-5'} />
</span>
