<script lang="ts">
	/**
	 * Round step number (or letter) used across the patient journey: summary list, step heading.
	 * Inverse of the text colour, so the contrast is the same as body text in both themes.
	 */
	let {
		value,
		size = 'md',
		class: className = ''
	}: { value: string | number; size?: 'md' | 'lg'; class?: string } = $props();
</script>

<span
	class={[
		'inline-flex shrink-0 items-center justify-center rounded-full bg-base-content font-bold text-base-100',
		size === 'lg' ? 'h-12 w-12 text-2xl' : 'h-10 w-10 text-lg',
		className
	]}
	aria-hidden="true">{value}</span
>
