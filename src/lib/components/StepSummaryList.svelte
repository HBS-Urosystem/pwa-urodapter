<script lang="ts">
	import { resolve } from '$app/paths';
	import NumberBadge from '$lib/components/NumberBadge.svelte';

	/** One-page summary of an approach: numbered rows, each opening its detailed step. */
	let {
		approachId,
		steps
	}: {
		approachId: string;
		steps: readonly { id: string; label: string; summary: string }[];
	} = $props();
</script>

<ol class="space-y-1">
	{#each steps as step, i (step.id)}
		<li class="relative">
			{#if i < steps.length - 1}
				<!-- Line joining this number to the next one -->
				<span
					class="absolute top-14 -bottom-3 left-[1.9375rem] w-0.5 bg-base-content/20"
					aria-hidden="true"
				></span>
			{/if}
			<a
				href={resolve('/self-instillation/[approach]/[step]', {
					approach: approachId,
					step: step.id
				})}
				class="group relative flex gap-4 rounded-box p-3 no-underline transition-colors hover:bg-base-100/70 focus-visible:bg-base-100/70"
			>
				<NumberBadge value={i + 1} />
				<span class="min-w-0 flex-1 pt-1.5">
					<span class="block [font-family:var(--font-heading)] text-lg leading-snug font-semibold"
						>{step.label}</span
					>
					<span class="mt-1 block text-base-content/80">{step.summary}</span>
				</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mt-2.5 h-5 w-5 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</a>
		</li>
	{/each}
</ol>
