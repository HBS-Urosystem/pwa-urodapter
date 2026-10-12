<script lang="ts">
	import { resolve } from '$app/paths';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import LogoWordmark from '$lib/components/LogoWordmark.svelte';
	import TocCards from '$lib/components/TocCards.svelte';
	import { JOURNEYS } from '$lib/data/journeys';
	import { videoFiles } from '$lib/data/video-manifest';
	import { introPlayed, markIntroSeen } from '$lib/stores/intro.svelte';

	/**
	 * The splash is in the prerendered HTML too, so it covers the page from the first paint
	 * (the Table of Contents no longer flashes before the app starts). When the splash was already
	 * passed in this tab and the load is not a reload, the script in `app.html` hides it before the
	 * first paint; after hydration `introPlayed.seen` decides.
	 */
	const showIntro = $derived(!introPlayed.seen);
	let downloading = $state(false);
	let progress = $state(0);
	let copied = $state(false);

	function downloadAllVideos() {
		if (!navigator.serviceWorker?.controller) return;
		downloading = true;
		progress = 0;

		navigator.serviceWorker.controller.postMessage({
			type: 'CACHE_ALL_VIDEOS',
			urls: videoFiles
		});

		const onMessage = (event: MessageEvent) => {
			if (event.data?.type === 'CACHE_PROGRESS') {
				const pct = Math.round((event.data.completed / event.data.total) * 100);
				progress = pct;
				if (pct >= 100) {
					navigator.serviceWorker.removeEventListener('message', onMessage);
				}
			}
		};

		navigator.serviceWorker.addEventListener('message', onMessage);
	}

	// let error = $state<string | null>(null);
	async function share() {
		if (navigator.share) {
			// await navigator.share({ title: 'Urodapter - How to Use', url: window.location.origin });
			try {
				// console.log(window.location.origin);
				// error = 'Waiting';
				await navigator.share({ title: 'Urodapter - How to Use', url: window.location.origin });
				// console.log('Shared successfully');
				// error = null;
			} catch (err) {
				// error = 'Cancelled';
			}
		} else {
			await navigator.clipboard.writeText(window.location.origin);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}

	const homeTitle = 'Urodapter – How to Use';
	const homeDescription =
		'Everything you need to know about the urological syringe adapter which can completely replace the catheter in the field of Bladder Instillation';

	/** First intro frame (PNG) + loop — preloaded in `<head>` when the splash is shown for LCP / fetch priority. */
	const introVideoSrc = '/assets/intro_loop_seq.mp4';
	const introPosterSrc = '/assets/intro_loop_seq-poster.jpg';

	/** `fetchpriority` on `<video>` (Chromium) — setAttribute avoids older DOM typings. */
	function introVideoFetchPriority(node: HTMLVideoElement) {
		node.setAttribute('fetchpriority', 'high');
	}

	$effect(() => {
		if (!showIntro) return;

		const html = document.documentElement;
		const body = document.body;
		const scrollY = window.scrollY;

		const prevHtmlOverflow = html.style.overflow;
		const prevBodyOverflow = body.style.overflow;
		const prevHtmlOverscroll = html.style.overscrollBehavior;
		const prevBodyOverscroll = body.style.overscrollBehavior;
		const prevBodyPosition = body.style.position;
		const prevBodyTop = body.style.top;
		const prevBodyLeft = body.style.left;
		const prevBodyRight = body.style.right;
		const prevBodyWidth = body.style.width;

		html.style.overflow = 'hidden';
		body.style.overflow = 'hidden';
		html.style.overscrollBehavior = 'none';
		body.style.overscrollBehavior = 'none';
		body.style.position = 'fixed';
		body.style.top = `-${scrollY}px`;
		body.style.left = '0';
		body.style.right = '0';
		body.style.width = '100%';

		return () => {
			html.style.overflow = prevHtmlOverflow;
			body.style.overflow = prevBodyOverflow;
			html.style.overscrollBehavior = prevHtmlOverscroll;
			body.style.overscrollBehavior = prevBodyOverscroll;
			body.style.position = prevBodyPosition;
			body.style.top = prevBodyTop;
			body.style.left = prevBodyLeft;
			body.style.right = prevBodyRight;
			body.style.width = prevBodyWidth;
			window.scrollTo(0, scrollY);
		};
	});
</script>

<SeoHead title={homeTitle} description={homeDescription} path="/" />

<svelte:head>
	{#if !introPlayed.seen}
		<!-- LCP: poster + video URLs are discoverable in the initial document (not injected later). -->
		<link rel="preload" href={introPosterSrc} as="image" fetchpriority="high" />
		<link rel="preload" href={introVideoSrc} as="video" type="video/mp4" fetchpriority="high" />
	{/if}
</svelte:head>

{#snippet splashArrow()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="mt-1 ml-1 h-6 w-6"
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
	>
		<path
			fill-rule="evenodd"
			d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
			clip-rule="evenodd"
		/>
	</svg>
{/snippet}

{#if showIntro}
	<div
		class="intro-splash fixed inset-0 z-40 flex touch-none flex-col items-center justify-center overscroll-none bg-[radial-gradient(circle,#2a6d8c_0%,#0b3b54_61%,#072c3f_100%)] text-primary"
	>
		<LogoWordmark class="mb-4 w-48" />

		<h1 class="mb-2 text-3xl text-white">How to Use</h1>

		<video
			use:introVideoFetchPriority
			src={introVideoSrc}
			poster={introPosterSrc}
			width="192"
			height="192"
			preload="auto"
			autoplay
			muted
			loop
			playsinline
			class="mt-12 mb-4 h-48 w-48 object-contain mix-blend-screen"
		></video>

		<svg
			class="-mt-8 w-48"
			viewBox="0 0 320 64"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			><radialGradient
				id="a"
				cx="160"
				cy="32"
				gradientTransform="matrix(1 0 0 .15 0 20.7)"
				gradientUnits="userSpaceOnUse"
				r="160"
				><stop offset="0" stop-color="#22303a" stop-opacity=".1" /><stop
					offset="1"
					stop-color="#22303a"
					stop-opacity="0"
				/></radialGradient
			><rect fill="url(#a)" height="100%" width="100%" /></svg
		>
		<!-- <img src="/assets/img/intro-img-shadow.svg" alt="" class="w-48 -mt-8" /> -->

		<p class="mt-4 max-w-md px-4 text-center text-white">
			Everything you need to know about the urological syringe adapter which can completely replace
			the catheter in the field of Bladder Instillation
		</p>

		<!-- Journey choice: clinicians stay on this page (their Table of Contents); Self-instillation starts the patient journey (its own Table of Contents). -->
		<div class="mt-6 grid gap-3 sm:grid-cols-2">
			<button
				type="button"
				class="btn--lg btn rounded-full text-neutral-content btn-primary"
				onclick={markIntroSeen}
			>
				For Clinicians
				{@render splashArrow()}
			</button>
			<a
				href={resolve('/self-instillation')}
				class="btn--lg btn rounded-full text-neutral-content btn-primary"
				onclick={markIntroSeen}
			>
				Self-instillation
				{@render splashArrow()}
			</a>
		</div>
	</div>
{/if}

<section class="flex-1 bg-primary/20 py-12">
	<div class="mx-auto">
		<h1 class="mb-8 text-center text-3xl">How to Use</h1>

		<p class="mx-auto mb-8 max-w-2xl border-b pb-4 px-1 text-center font-bold">
			This detailed manual entails all the necessary information regarding instructions and the tips
			and tricks you may need to make the use of the UroDapter® most efficient.
		</p>

		<h2 class="mb-4 text-center text-lg font-bold">Table of Contents</h2>

		<TocCards sections={JOURNEYS.clinician.sections} />

		<div class="mt-12 mb-4 text-center">
			{#if progress >= 100}
				<p class="font-bold text-success">Downloaded!</p>
			{:else}
				<button
					class="btn btn-outline btn-secondary"
					onclick={downloadAllVideos}
					disabled={downloading}
				>
					Download all videos for offline use
				</button>
			{/if}

			{#if downloading && progress < 100}
				<div class="mt-4 flex justify-center">
					<progress class="progress w-64 progress-primary" value={progress} max="100"></progress>
				</div>
			{/if}
		</div>

		<div class="mt-4 flex flex-wrap items-center justify-center gap-2">
			<a href={resolve('/install')} class="btn btn-ghost btn-sm">
				<svg xmlns="http://www.w3.org/2000/svg" class="mt-1 h-6 w-6" viewBox="0 0 40 40">
					<path
						d="M16.5 3v18m0 0l-6-6m6 6l6-6M5 24v3h23v-3"
						fill="none"
						stroke="currentColor"
						stroke-width="4"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				Install App
			</a>

			<button class="btn btn-ghost btn-sm" onclick={share}>
				{#if copied}
					Copied!
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mt-1 h-6 w-6"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path
							stroke-width="1"
							d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
						/>
					</svg>
					Share
				{/if}
			</button>
			<!-- {#if error != null}
				<span class="text-info text-center text-sm">{error}</span>
			{/if} -->
		</div>
	</div>
</section>
