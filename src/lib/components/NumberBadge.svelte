<script lang="ts">
	/**
	 * Round step number (or letter) used across the patient journey: summary list, step heading.
	 * Inverse of the text colour (same contrast as body text in both themes), or white with `light`.
	 */
	let {
		value,
		size = 'md',
		light = false,
		class: className = ''
	}: { value: string | number; size?: 'md' | 'lg'; light?: boolean; class?: string } = $props();
</script>

<span
	class={[
		'inline-flex shrink-0 items-center justify-center rounded-full font-bold',
		light ? 'bg-white text-black' : 'bg-base-content text-base-100',
		size === 'lg' ? 'h-12 w-12 text-2xl' : 'h-10 w-10 text-lg',
		className
	]}
	aria-hidden="true">{value}</span
>
