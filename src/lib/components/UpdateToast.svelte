<script>
	import { fly } from 'svelte/transition';

	let showUpdate = $state(false);

	$effect(() => {
		if (typeof navigator === 'undefined' || !navigator.serviceWorker) return;

		/** @param {MessageEvent} event */
		const handler = (event) => {
			if (event.data?.type === 'SW_UPDATED') {
				showUpdate = true;
			}
		};

		navigator.serviceWorker.addEventListener('message', handler);

		return () => {
			navigator.serviceWorker.removeEventListener('message', handler);
		};
	});
</script>

{#if showUpdate}
	<div class="toast toast-center toast-bottom z-50" transition:fly={{ y: 80, duration: 300 }}>
		<div class="alert alert-info shadow-lg gap-2">
			<span>App update available</span>
			<div class="flex gap-1">
				<button class="btn btn-sm btn-primary" onclick={() => window.location.reload()}>
					Refresh
				</button>
				<button class="btn btn-sm btn-ghost" onclick={() => (showUpdate = false)}>
					✕
				</button>
			</div>
		</div>
	</div>
{/if}
