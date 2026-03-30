<script>
	import { fly } from 'svelte/transition';

	let showUpdate = $state(false);
	const CONTROLLER_KEY = 'sw-controller-url';

	/**
	 * iOS standalone may suspend the app and drop SW message timing.
	 * Persist and compare controller script URL to surface updates after resume.
	 */
	function detectControllerChange() {
		const current = navigator.serviceWorker?.controller?.scriptURL ?? '';
		const previous = sessionStorage.getItem(CONTROLLER_KEY) ?? '';
		if (current && previous && current !== previous) {
			showUpdate = true;
		}
		if (current) sessionStorage.setItem(CONTROLLER_KEY, current);
	}

	async function checkForUpdateNow() {
		if (!navigator.serviceWorker) return;
		try {
			const registration = await navigator.serviceWorker.getRegistration();
			if (!registration) return;

			if (registration.waiting) {
				showUpdate = true;
			}

			await registration.update();
			if (registration.waiting) {
				showUpdate = true;
			}
		} catch {
			// ignore transient update check failures
		}
		detectControllerChange();
	}

	$effect(() => {
		if (typeof navigator === 'undefined' || !navigator.serviceWorker) return;

		/** @param {MessageEvent} event */
		const handler = (event) => {
			if (event.data?.type === 'SW_UPDATED') {
				showUpdate = true;
			}
		};

		const onControllerChange = () => {
			showUpdate = true;
			detectControllerChange();
		};

		const onResume = () => {
			void checkForUpdateNow();
		};

		const onVisibilityChange = () => {
			if (document.visibilityState === 'visible') onResume();
		};

		navigator.serviceWorker.addEventListener('message', handler);
		navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
		window.addEventListener('pageshow', onResume);
		window.addEventListener('focus', onResume);
		document.addEventListener('visibilitychange', onVisibilityChange);

		detectControllerChange();
		void checkForUpdateNow();

		return () => {
			navigator.serviceWorker.removeEventListener('message', handler);
			navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
			window.removeEventListener('pageshow', onResume);
			window.removeEventListener('focus', onResume);
			document.removeEventListener('visibilitychange', onVisibilityChange);
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
				<button class="btn btn-sm btn-ghost" onclick={() => (showUpdate = false)}>
					✕
				</button>
			</div>
		</div>
	</div>
{/if}
