<script lang="ts">
	import { resolve } from '$app/paths';

	/** Links to the summary (0) and all steps of an approach; the current step is filled with the theme's dark colour, the others are transparent. */
	let {
		approachId,
		steps,
		currentId
	}: {
		approachId: string;
		steps: readonly { id: string; title: string }[];
		currentId: string;
	} = $props();
</script>

<nav aria-label="Steps">
	<ol class="flex gap-1.5">
		<li class="flex-1">
			<a
				href={resolve('/self-instillation/[approach]', { approach: approachId })}
				class="mx-auto flex aspect-square max-w-11 items-center justify-center rounded-full border border-base-content/30 bg-transparent text-base-content no-underline transition-colors hover:border-base-content"
				aria-label="Short summary"
				title="Short summary"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
				</svg>
			</a>
		</li>
		{#each steps as step, i (step.id)}
			{@const current = step.id === currentId}
			<li class="flex-1">
				<a
					href={resolve('/self-instillation/[approach]/[step]', {
						approach: approachId,
						step: step.id
					})}
					class={[
						'mx-auto flex aspect-square max-w-11 items-center justify-center rounded-full border text-base font-bold no-underline transition-colors',
						current
							? 'border-base-content bg-base-content text-base-100'
							: 'border-base-content/30 bg-transparent text-base-content hover:border-base-content'
					]}
					aria-current={current ? 'step' : undefined}
					aria-label={`Step ${i + 1}: ${step.title}`}
					title={step.title}>{i + 1}</a
				>
			</li>
		{/each}
	</ol>
</nav>
