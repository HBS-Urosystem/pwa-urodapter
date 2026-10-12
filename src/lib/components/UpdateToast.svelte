<script>
	import { fly } from 'svelte/transition';
	import { updated } from '$app/state';

	/**
	 * Show the refresh prompt only when the running app is not the latest deployed build.
	 * `updated.current` compares the build version baked into this page with the server's
	 * `/_app/version.json`. A freshly loaded page (including one served by an already
	 * auto-updated service worker) matches, so no prompt appears. A stale page, such as an
	 * installed PWA resumed from the background, does not match, so the prompt appears.
	 */
	let dismissed = $state(false);
	const showUpdate = $derived(updated.current && !dismissed);

	$effect(() => {
		const check = () => {
			if (document.visibilityState === 'visible') void updated.check();
		};

		check();

		window.addEventListener('pageshow', check);
		window.addEventListener('focus', check);
		document.addEventListener('visibilitychange', check);
		// A new service worker taking control means the server version may have just changed.
		navigator.serviceWorker?.addEventListener('controllerchange', check);

		return () => {
			window.removeEventListener('pageshow', check);
			window.removeEventListener('focus', check);
			document.removeEventListener('visibilitychange', check);
			navigator.serviceWorker?.removeEventListener('controllerchange', check);
		};
	});
</script>

{#if showUpdate}
	<div class="toast toast-center toast-bottom z-50" transition:fly={{ y: 80, duration: 300 }}>
		<div class="alert alert-info shadow-lg gap-2">
			<span>App update available</span>
			<div class="flex gap-1">
				<button class="btn btn-sm btn-secondary" onclick={() => window.location.reload()}>
					Refresh
				</button>
				<button class="btn btn-sm btn-ghost" onclick={() => (dismissed = true)}>
					✕
				</button>
			</div>
		</div>
	</div>
{/if}
