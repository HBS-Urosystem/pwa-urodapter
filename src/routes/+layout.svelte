<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import './layout.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import UpdateToast from '$lib/components/UpdateToast.svelte';
	import LogoMark from '$lib/components/LogoMark.svelte';
	import { JOURNEYS, journeyForPath } from '$lib/data/journeys';
	import { lastJourney, rememberJourney, restoreJourney } from '$lib/stores/journey.svelte';
	import { resetIntro } from '$lib/stores/intro.svelte';

	let { children } = $props();

	onMount(restoreJourney);

	afterNavigate(({ to }) => {
		const id = to ? journeyForPath(to.url.pathname) : null;
		if (id) rememberJourney(id);
	});

	/** Journey pages use their own journey; shared pages (Contact, Install App, legal) keep the last one. */
	const journey = $derived(JOURNEYS[journeyForPath(page.url.pathname) ?? lastJourney.id]);

	function closeDrawer() {
		const el = document.getElementById('app-drawer');
		if (el) (el as HTMLInputElement).checked = false;
	}

	function goToSplash() {
		resetIntro();
		closeDrawer();
	}
</script>

<div class="drawer drawer-end">
	<input id="app-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex min-h-screen flex-col">
		<Header tocPath={journey.tocPath} />
		<main class="flex min-h-0 flex-1 flex-col">
			{@render children()}
			<div class="w-full shrink-0">
				<Footer />
			</div>
		</main>
	</div>
	<div class="drawer-side z-50">
		<label for="app-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<div
			class="flex max-h-dvh min-h-full w-72 flex-col overflow-y-auto overscroll-y-contain bg-base-100"
		>
			<div
				class="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-end gap-1 bg-base-100 px-4 pt-2 pb-2 shadow-sm"
			>
				<!-- U+ logo brings back the splash screen (journey choice), like the header logo. -->
				<a
					href={resolve('/')}
					class="btn me-auto btn-square text-primary btn-ghost"
					aria-label="Home"
					onclick={goToSplash}
				>
					<LogoMark class="h-7" />
				</a>
				<a
					href={resolve(journey.tocPath as '/')}
					class="btn btn-square btn-ghost"
					aria-label="Table of Contents"
					onclick={closeDrawer}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2"
						/>
					</svg>
				</a>
				<label for="app-drawer" class="btn btn-square btn-ghost" aria-label="Close menu">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</label>
			</div>
			<!-- Menu of the current journey: Table of Contents + its entries, then links below the divider ($lib/data/journeys.ts). -->
			<nav class="menu p-4">
				<ul>
					<li><a href={resolve(journey.tocPath as '/')} onclick={closeDrawer}>{journey.tocLabel}</a></li>
					{#each journey.sections as section (section.path)}
						<li><a href={resolve(section.path as '/')} onclick={closeDrawer}>{section.title}</a></li>
					{/each}
					<div class="divider"></div>
					{#each journey.moreLinks as link (link.path)}
						<li>
							{#if link.external}
								<!-- External site: resolve() applies to app routes only -->
								<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
								<a href={link.path} target="_blank" rel="noopener noreferrer" onclick={closeDrawer}
									>{link.label}</a
								>
							{:else}
								<a href={resolve(link.path as '/')} onclick={closeDrawer}>{link.label}</a>
							{/if}
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	</div>
</div>
<UpdateToast />
