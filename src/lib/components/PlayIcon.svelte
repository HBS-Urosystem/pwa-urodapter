<script lang="ts">
	/** Play triangle, drawn in the current text colour. Marks the real-case video page wherever a step number would stand. */
	let { class: className = 'h-5 w-5' }: { class?: string } = $props();
</script>

<svg viewBox="0 0 24 24" class={['fill-current', className]} aria-hidden="true">
	<path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.04-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14Z" />
</svg>
