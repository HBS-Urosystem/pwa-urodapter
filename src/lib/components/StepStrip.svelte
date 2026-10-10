<script lang="ts">
	import { resolve } from '$app/paths';

	/** Links to all steps of an approach; the current step is filled. */
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
							: 'border-base-content/30 bg-base-100 text-base-content hover:border-base-content'
					]}
					aria-current={current ? 'step' : undefined}
					aria-label={`Step ${i + 1}: ${step.title}`}
					title={step.title}>{i + 1}</a
				>
			</li>
		{/each}
	</ol>
</nav>
