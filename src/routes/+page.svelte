<script lang="ts">
	import { videoFiles } from '$lib/data/video-manifest';
	import { introPlayed } from '$lib/stores/intro.svelte';

	let showIntro = $state(!introPlayed.seen);
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

	async function share() {
		if (navigator.share) {
			await navigator.share({ title: 'Urodapter - How to Use', url: window.location.origin });
		} else {
			await navigator.clipboard.writeText(window.location.origin);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}

	const cards = [
		{ title: 'Educational Video', href: '/how-the-urodapter-works', icon: 'tool' },
		{ title: 'What to do prior to instillation', href: '/what-to-do-prior-to-instillation', icon: 'gear' },
		{ title: 'Instructions for female patients', href: '/instructions-for-doctors-on-female-patients', icon: 'female' },
		{ title: 'Instructions for male patients', href: '/instructions-for-doctors-on-male-patients', icon: 'male' },
		{ title: 'FAQ', href: '/faq', icon: 'help' },
		{ title: 'Install App', href: '/install', icon: 'download' }
	];
</script>

<svelte:head>
	<title>Urodapter – How to Use</title>
	<meta
		name="description"
		content="Everything you need to know about the urological syringe adapter which can completely replace the catheter in the field of Bladder Instillation"
	/>
</svelte:head>

{#snippet cardIcon(icon: string)}
	{#if icon === 'tool'}
		<svg class="block h-8 w-8 shrink-0" viewBox="0 0 33 33" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M27.91,19.51l-3.91-3.91,5.14-5.14c1.48-1.48,1.79-3.78.76-5.6-.14-.25-.46-.34-.71-.2-.25.14-.34.46-.2.71.8,1.41.56,3.2-.59,4.35l-5.14,5.14-5.13-5.13,5.14-5.14c1.15-1.15,2.94-1.39,4.35-.59.25.14.57.05.71-.2.14-.25.05-.57-.2-.71-1.82-1.03-4.12-.72-5.6.76l-5.14,5.14-3.91-3.91c-.2-.2-.53-.2-.73,0-.2.2-.2.53,0,.73l3.91,3.91-5.41,5.41-.35-.35c-.73-.73-1.91-.73-2.64,0l-3.31,3.31c-.73.73-.73,1.91,0,2.64l.35.35-2.66,2.66c-.2.2-.2.53,0,.73l5.87,5.87c.2.2.53.2.73,0l2.66-2.66.35.35c.73.73,1.91.73,2.64,0l3.31-3.31c.73-.73.73-1.91,0-2.64l-.35-.35,5.41-5.41,3.91,3.91c.2.2.53.2.73,0,.2-.2.2-.53,0-.73h0ZM17.47,24l-3.31,3.31c-.33.33-.85.33-1.18,0l-4.26-4.26c-.2-.2-.53-.2-.73,0-.2.2-.2.53,0,.73l3.18,3.18-2.3,2.3-5.13-5.13,2.66-2.66c.2-.2.2-.53,0-.73,0,0,0,0-.01,0l-.7-.7c-.32-.32-.32-.85,0-1.18l3.31-3.31c.33-.33.85-.33,1.18,0l.7.7s0,0,0,.01c0,0,0,0,.01,0l5.84,5.84s0,0,0,.01c0,0,0,0,.01,0l.7.7c.32.32.32.85,0,1.18h0ZM17.13,21.01l-5.13-5.13,5.41-5.41,5.13,5.13-5.41,5.41Z"/></svg>
	{:else if icon === 'gear'}
		<svg class="block h-8 w-8 shrink-0" viewBox="0 0 33 33" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.29,30l-.32-.08c-.52-.13-1.05-.3-1.58-.51l-.31-.12-.3-3.59c-.47-.29-.93-.61-1.35-.97l-3.54.83-.21-.25c-.34-.41-.67-.86-.98-1.34l-.18-.27,1.89-3.08c-.21-.51-.39-1.04-.51-1.57l-3.35-1.39-.02-.32c-.02-.27-.03-.55-.03-.82s.01-.55.03-.82l.02-.32,3.35-1.39c.13-.53.3-1.06.51-1.57l-1.89-3.08.18-.27c.31-.48.64-.93.98-1.34l.21-.25,3.54.83c.42-.35.87-.68,1.35-.97l.3-3.59.31-.12c.53-.21,1.07-.38,1.58-.51l.32-.08,2.37,2.73c.55-.04,1.11-.04,1.67,0l2.37-2.73.32.08c.51.13,1.05.3,1.58.51l.31.12.3,3.59c.47.29.93.61,1.35.97l3.54-.83.21.25c.34.41.67.86.98,1.34l.18.27-1.89,3.08c.21.51.39,1.04.51,1.57l3.35,1.39.02.32c.02.27.03.55.03.82s-.01.55-.03.82l-.02.32-3.35,1.39c-.13.53-.3,1.06-.51,1.57l1.89,3.08-.18.27c-.31.48-.64.93-.98,1.34l-.21.25-3.54-.83c-.42.35-.87.68-1.35.97l-.3,3.59-.31.12c-.53.21-1.07.38-1.58.51l-.32.08-2.37-2.73c-.55.04-1.12.04-1.67,0l-2.37,2.73h0ZM17.78,26.17l2.29,2.64c.28-.08.55-.17.84-.27l.29-3.48.24-.14c.58-.33,1.13-.73,1.62-1.17l.21-.18,3.43.8c.18-.22.35-.46.52-.71l-1.83-2.98.11-.25c.27-.61.48-1.25.62-1.89l.06-.27,3.25-1.34c0-.14.01-.29.01-.44s0-.29-.01-.44l-3.25-1.34-.06-.27c-.14-.64-.35-1.28-.62-1.89l-.11-.25,1.83-2.98c-.17-.24-.34-.48-.52-.71l-3.43.8-.21-.18c-.5-.44-1.04-.83-1.62-1.17l-.24-.14-.29-3.48c-.28-.1-.56-.19-.84-.27l-2.29,2.64-.28-.02c-.67-.06-1.35-.06-2.01,0l-.28.02-2.29-2.64c-.28.08-.55.17-.84.27l-.29,3.48-.24.14c-.59.33-1.13.73-1.62,1.17l-.21.18-3.43-.8c-.18.22-.35.46-.52.71l1.83,2.98-.11.25c-.27.61-.48,1.24-.62,1.89l-.06.27-3.25,1.34c0,.14-.01.29-.01.44s0,.29.01.44l3.25,1.34.06.27c.14.64.35,1.28.62,1.89l.11.25-1.83,2.98c.17.24.34.48.52.71l3.43-.8.21.18c.5.44,1.04.83,1.62,1.17l.24.14.29,3.48c.28.1.56.19.84.27l2.29-2.64.28.02c.67.07,1.35.07,2.01,0l.28-.02ZM16.5,22.76c-3.48,0-6.32-2.81-6.32-6.26s2.83-6.26,6.32-6.26,6.32,2.81,6.32,6.26-2.83,6.26-6.32,6.26ZM16.5,11.29c-2.9,0-5.27,2.34-5.27,5.21s2.36,5.21,5.27,5.21,5.27-2.34,5.27-5.21-2.36-5.21-5.27-5.21Z"/></svg>
	{:else if icon === 'female'}
		<svg class="block h-8 w-8 shrink-0" viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.23,1.5c-.35,0-.63.28-.63.63s.28.63.63.63h7.1l-7.13,7.13c-2.2-1.99-5.11-3.21-8.3-3.21C7.06,6.68,1.5,12.25,1.5,19.09s5.56,12.41,12.41,12.41,12.41-5.56,12.41-12.41c0-3.2-1.22-6.1-3.21-8.3l7.13-7.13v7.1c0,.35.28.63.63.63s.63-.28.63-.63V1.5h-9.27ZM13.91,30.23c-6.14,0-11.14-5-11.14-11.14S7.76,7.95,13.91,7.95s11.14,5,11.14,11.14-5,11.14-11.14,11.14Z"/></svg>
	{:else if icon === 'male'}
		<svg class="block h-8 w-8 shrink-0" viewBox="0 0 33 33" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M24.28,18.52c2.08-2.05,3.22-4.77,3.22-7.67s-1.14-5.62-3.22-7.67c-4.29-4.24-11.27-4.24-15.55,0-2.08,2.05-3.22,4.77-3.22,7.67s1.14,5.62,3.22,7.67c2,1.98,4.59,3.02,7.22,3.15v4.76h-4.99c-.31,0-.56.25-.56.55s.25.55.56.55h4.99v4.92c0,.31.25.55.56.55s.56-.25.56-.55v-4.92h4.99c.31,0,.56-.25.56-.55s-.25-.55-.56-.55h-4.99v-4.76c2.62-.13,5.22-1.17,7.22-3.15h0ZM6.62,10.84c0-2.6,1.03-5.05,2.89-6.89,1.92-1.9,4.46-2.85,6.99-2.85s5.06.95,6.99,2.85c1.87,1.84,2.89,4.29,2.89,6.89s-1.03,5.05-2.89,6.89c-3.85,3.8-10.12,3.8-13.97,0-1.87-1.84-2.89-4.29-2.89-6.89Z"/></svg>
	{:else if icon === 'help'}
		<svg class="block h-8 w-8 shrink-0" viewBox="0 0 33 33" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16.5,4c-6.89,0-12.5,5.61-12.5,12.5s5.61,12.5,12.5,12.5,12.5-5.61,12.5-12.5-5.6-12.5-12.5-12.5ZM16.5,27.75c-6.21,0-11.25-5.05-11.25-11.25s5.05-11.25,11.25-11.25,11.25,5.05,11.25,11.25-5.05,11.25-11.25,11.25h0ZM18.6,10.43c-.84-.54-1.97-.71-3.02-.47-1.05.25-1.93.9-2.47,1.82-.14.24-.06.55.18.69.24.14.55.06.69-.18.52-.88,1.29-1.22,1.83-1.35.78-.18,1.64-.06,2.24.33.6.38.98.99,1.07,1.68.08.65-.12,1.29-.59,1.79-2.14,2.32-3,3.63-2.74,5.66.03.25.25.44.5.44h.06c.28-.03.47-.29.44-.56-.21-1.62.44-2.64,2.48-4.85.67-.73.97-1.65.85-2.6-.12-.98-.68-1.85-1.53-2.4h0ZM16.35,21.91c-.47,0-.86.38-.86.86s.38.85.86.85.86-.38.86-.85-.38-.86-.86-.86Z"/></svg>
	{:else if icon === 'download'}
		<svg class="block h-8 w-8 shrink-0" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 3v18m0 0l-6-6m6 6l6-6M5 24v3h23v-3" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>
	{/if}
{/snippet}

{#if showIntro}
	<div class="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[radial-gradient(circle,#205a74_0%,#0f445c_36%,#05364e_71%,#023249_100%)]">
		<img src="/assets/img/logo_blue.svg" alt="Urodapter" class="w-48 mb-4" />
		<h1 class="text-3xl font-bold text-white mb-2">How to Use</h1>

		<video
			src="/assets/intro_loop_seq.mp4"
			autoplay
			muted
			loop
			playsinline
			class="w-48 h-48 object-contain my-4 mix-blend-screen"
		></video>

		<img src="/assets/img/intro-img-shadow.png" alt="" class="w-48 -mt-4 opacity-50" />

		<p class="text-white text-center max-w-md px-4 mt-4">
			Everything you need to know about the urological syringe adapter which can completely replace
			the catheter in the field of Bladder Instillation
		</p>

		<button class="btn btn-accent btn-lg mt-6" onclick={() => { showIntro = false; introPlayed.seen = true; }}>
			Enter
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 ml-1 mt-1"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</div>
{/if}

<section class="bg-accent/20 py-12 flex-1">
	<div class="container mx-auto">
		<h2 class="text-2xl font-bold text-center mb-8">Table of Contents</h2>

		<p class="font-bold text-center border-b pb-4 max-w-2xl mx-auto mb-8">
			This detailed manual entails all the necessary information regarding instructions and the tips
			and tricks you may need to make the use of the UroDapter® most efficient.
		</p>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto px-4">
			{#each cards as card (card.href)}
				<a href={card.href} class="no-underline">
					<div class="card items-center bg-base-100 shadow-md hover:shadow-lg transition-shadow pt-6">
						<figure class="m-0 text-[#52B2D6]">
							{@render cardIcon(card.icon)}
						</figure>
						<div class="card-body items-center text-center p-4">
							<h3 class="card-title text-sm">{card.title}</h3>
						</div>
					</div>
				</a>
			{/each}
		</div>

		<div class="text-center mt-8 mb-4">
			{#if progress >= 100}
				<p class="text-success font-bold">Downloaded!</p>
			{:else}
				<button class="btn btn-primary btn-outline" onclick={downloadAllVideos} disabled={downloading}>
					Download all videos for offline use
				</button>
			{/if}

			{#if downloading && progress < 100}
				<div class="flex justify-center mt-4">
					<progress class="progress progress-primary w-64" value={progress} max="100"></progress>
				</div>
			{/if}
		</div>

		<div class="text-center mt-4">
			<button class="btn btn-ghost btn-sm" onclick={share}>
				{#if copied}
					Copied!
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 mr-1"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
					<path
							d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
					/>
					</svg>
					Share
				{/if}
			</button>
		</div>
	</div>
</section>
