<script lang="ts">
	import { OPENER_CLASS, OPENER_TITLE, splitMirrorWords } from './openers';

	/** Plain text with every mirror word as an opener. For HTML strings, use addMirrorOpeners(). */
	let { text, class: className = '' }: { text: string; class?: string } = $props();

	const parts = $derived(splitMirrorWords(text));
</script>

{#each parts as part, i (i)}{#if part.opener}<button
			type="button"
			data-mirror-opener
			class={[OPENER_CLASS, className]}
			title={OPENER_TITLE}>{part.text}</button
		>{:else}{part.text}{/if}{/each}
