<script>
	import { fly } from 'svelte/transition';

	let showUpdate = $state(false);
	const CONTROLLER_KEY = 'sw-controller-url';

	/**
	 * iOS standalone may suspend the app and drop SW message timing.
	 * Persist and compare controller script URL to surface updates after resume.
	 * (Path is stable across deploys, so this only helps when the SW script URL changes.)
	 */
	function detectControllerChange() {
		const current = navigator.serviceWorker?.controller?.scriptURL ?? '';
		const previous = sessionStorage.getItem(CONTROLLER_KEY) ?? '';
		if (current && previous && current !== previous) {
			showUpdate = true;
		}
		if (current) sessionStorage.setItem(CONTROLLER_KEY, current);
	}

	$effect(() => {
		if (typeof navigator === 'undefined' || !navigator.serviceWorker) return;

		/** @type {WeakSet<ServiceWorker>} */
		const wiredInstalling = new WeakSet();

		/** @param {ServiceWorker} worker */
		function watchInstallingWorker(worker) {
			if (wiredInstalling.has(worker)) return;
			wiredInstalling.add(worker);
			worker.addEventListener('statechange', () => {
				// skipWaiting can move through installed quickly; cover both.
				if (worker.state === 'installed' || worker.state === 'activated') {
					showUpdate = true;
				}
			});
		}

		/** @param {ServiceWorkerRegistration} registration */
		function onUpdateFound(registration) {
			const worker = registration.installing;
			if (worker) watchInstallingWorker(worker);
		}

		/** @param {ServiceWorkerRegistration | undefined} registration */
		async function checkForUpdateNow(registration) {
			if (!navigator.serviceWorker) return;
			try {
				const reg =
					registration ??
					(await navigator.serviceWorker.ready) ??
					(await navigator.serviceWorker.getRegistration());
				if (!reg) return;

				if (reg.waiting) {
					showUpdate = true;
				}
				if (reg.installing) {
					watchInstallingWorker(reg.installing);
				}

				await reg.update();

				if (reg.waiting) {
					showUpdate = true;
				}
				if (reg.installing) {
					watchInstallingWorker(reg.installing);
				}
			} catch {
				// ignore transient update check failures
			}
			detectControllerChange();
		}

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
			void checkForUpdateNow(undefined);
		};

		const onVisibilityChange = () => {
			if (document.visibilityState === 'visible') onResume();
		};

		/** @type {ServiceWorkerRegistration | null} */
		let reg = null;
		/** @type {(() => void) | null} */
		let updateFoundHandler = null;

		navigator.serviceWorker.addEventListener('message', handler);
		navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
		window.addEventListener('pageshow', onResume);
		window.addEventListener('focus', onResume);
		document.addEventListener('visibilitychange', onVisibilityChange);

		void navigator.serviceWorker.ready.then((registration) => {
			reg = registration;
			updateFoundHandler = () => onUpdateFound(registration);
			registration.addEventListener('updatefound', updateFoundHandler);
			onUpdateFound(registration);

			if (registration.waiting) {
				showUpdate = true;
			}

			detectControllerChange();
			void checkForUpdateNow(registration);
		});

		return () => {
			if (reg && updateFoundHandler) {
				reg.removeEventListener('updatefound', updateFoundHandler);
			}
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
