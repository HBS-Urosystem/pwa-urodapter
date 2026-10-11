<script lang="ts">
	import { untrack } from 'svelte';
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import { camera } from './camera.svelte';
	import ErrorView from './ErrorView.svelte';
	import Close from './icons/Close.svelte';
	import { STRINGS as t } from './i18n';
	import Mirror from './Mirror.svelte';
	import { OPENER_SELECTOR } from './openers';
	import { wakeLock } from './wakelock.svelte';

	/**
	 * The camera mirror (app.urostill's main screen) as a full-screen layer over
	 * the site, opened by the mirror words in the text (./openers.ts). Opening it
	 * adds a history entry, so the browser's Back closes it instead of leaving
	 * the page; that entry (`page.state.mirror`) decides whether the layer is open.
	 */

	type Screen = 'closed' | 'starting' | 'live' | 'error' | 'suspended';

	let screen = $state<Screen>('closed');
	let dialog = $state<HTMLDialogElement | null>(null);
	/** Invalidates a start still in flight when the page is hidden or the layer closes. */
	let startToken = 0;
	/** Set between asking the browser to go back and the layer actually closing. */
	let leaving = false;

	const isOpen = $derived(page.state.mirror === true);

	/** `?debug=1` shows the camera's raw error name on the error screen. */
	const debug = () => new URLSearchParams(location.search).get('debug') === '1';

	function showDialog() {
		if (dialog && !dialog.open) dialog.showModal();
	}

	function enterFullscreen() {
		// Android Chrome only — iOS Safari has no element fullscreen. Never fatal.
		if (dialog && !document.fullscreenElement && dialog.requestFullscreen) {
			dialog.requestFullscreen().catch(() => {});
		}
	}

	function leaveFullscreen() {
		if (document.fullscreenElement && document.exitFullscreen) {
			document.exitFullscreen().catch(() => {});
		}
	}

	async function start(): Promise<void> {
		const token = ++startToken;
		// Resuming keeps the mirror on screen rather than flashing the spinner.
		if (screen !== 'suspended') screen = 'starting';

		const ok = await camera.start();
		if (token !== startToken) {
			// Hidden or closed while getUserMedia was resolving.
			camera.stop();
			return;
		}
		if (!ok) {
			screen = 'error';
			return;
		}

		screen = 'live';
		void wakeLock.request();
	}

	/** Releases the camera and the screen, so the camera indicator goes off. */
	function stop() {
		startToken++;
		camera.stop();
		void wakeLock.release();
	}

	function suspend() {
		stop();
		screen = 'suspended';
	}

	/** Every opener lands here, straight from the click, while the gesture still allows fullscreen. */
	function onDocumentClick(event: MouseEvent) {
		if (isOpen || !(event.target instanceof Element)) return;
		if (!event.target.closest(OPENER_SELECTOR)) return;
		event.preventDefault();
		showDialog();
		enterFullscreen();
		pushState('', { mirror: true });
	}

	/** Exit, Escape, and the error screen's Exit: undo the history entry the layer added. */
	function close() {
		if (!isOpen || leaving) return;
		leaving = true;
		history.back();
	}

	function retry() {
		enterFullscreen();
		void start();
	}

	function onPlayFail(error: unknown) {
		camera.failPlayback(error);
		void wakeLock.release();
		screen = 'error';
	}

	function onVisibilityChange() {
		if (!isOpen) return;
		if (document.visibilityState === 'hidden') {
			if (screen === 'live' || screen === 'starting') suspend();
		} else if (screen === 'suspended') {
			void start();
		}
	}

	function onPageHide() {
		if (isOpen && (screen === 'live' || screen === 'starting')) suspend();
	}

	// Opened by an opener or by Forward; closed by Back, by close(), or by leaving the page.
	$effect(() => {
		if (!isOpen) return;

		untrack(() => {
			showDialog();
			void start();
		});

		const root = document.documentElement;
		const overflow = root.style.overflow;
		root.style.overflow = 'hidden';

		return () => {
			stop();
			leaveFullscreen();
			dialog?.close();
			root.style.overflow = overflow;
			screen = 'closed';
			leaving = false;
		};
	});

	// Keyboard focus follows the screen: the spinner's Exit, then the picture, or Try again.
	$effect(() => {
		if (screen === 'closed' || !dialog) return;
		// showModal() leaves the focus on the dialog itself while it is still empty.
		const active = document.activeElement;
		if (active !== dialog && dialog.contains(active)) return;
		dialog.querySelector<HTMLElement>('[tabindex="0"], button')?.focus();
	});
</script>

<svelte:document onclick={onDocumentClick} onvisibilitychange={onVisibilityChange} />
<svelte:window onpagehide={onPageHide} />

<dialog
	bind:this={dialog}
	class="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-black p-0 backdrop:bg-black"
	aria-label={t.title}
	oncancel={(event) => {
		event.preventDefault();
		close();
	}}
	onclose={close}
>
	{#if screen === 'error'}
		<ErrorView
			{t}
			message={t[camera.errorKey ?? 'errUnsupported']}
			detail={debug() ? camera.lastErrorName : ''}
			onretry={retry}
			onexit={close}
		/>
	{:else if screen === 'live' || screen === 'suspended'}
		<Mirror
			{t}
			stream={camera.stream}
			onexit={close}
			onplayfail={onPlayFail}
			onvideoready={(video) => void camera.improveResolution(video)}
		/>
	{:else if screen === 'starting'}
		<div class="flex h-full items-center justify-center text-white">
			<span class="loading loading-lg loading-spinner" role="status" aria-label={t.starting}></span>
			<button
				type="button"
				class="absolute top-[calc(env(safe-area-inset-top)+0.75rem)] right-[max(0.75rem,env(safe-area-inset-right))] flex size-12 items-center justify-center rounded-full focus-visible:outline-white"
				aria-label={t.exit}
				onclick={close}
			>
				<Close />
			</button>
		</div>
	{/if}
</dialog>
