<script lang="ts">
	import { resolve } from '$app/paths';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import UpdateToast from '$lib/components/UpdateToast.svelte';

	let { children } = $props();

	function closeDrawer() {
		const el = document.getElementById('app-drawer');
		if (el) (el as HTMLInputElement).checked = false;
	}
</script>

<svelte:head>
	<title>Urodapter - How to Use</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="drawer drawer-end">
	<input id="app-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col min-h-screen">
		<Header />
		<main class="flex-1 flex flex-col">
			{@render children()}
		</main>
		<Footer />
	</div>
	<div class="drawer-side z-50">
		<label for="app-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<div
			class="bg-base-100 flex min-h-full max-h-dvh w-72 flex-col overflow-y-auto overscroll-y-contain"
		>
			<div
				class="sticky top-0 z-10 flex shrink-0 items-center justify-end gap-1 border-b border-base-200 bg-base-100 px-4 pb-2 pt-4"
			>
				<a
					href={resolve('/')}
					class="btn btn-ghost btn-square"
					aria-label="Home"
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
				<label for="app-drawer" class="btn btn-ghost btn-square" aria-label="Close menu">
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
			<nav class="menu p-4">
				<ul>
					<li><a href={resolve('/')} onclick={closeDrawer}>Table of Contents</a></li>
					<li>
						<a href={resolve('/how-the-urodapter-works' as any)} onclick={closeDrawer}>Educational Video</a>
					</li>
					<li>
						<a href={resolve('/what-to-do-prior-to-instillation' as any)} onclick={closeDrawer}
							>What to do prior to instillation</a
						>
					</li>
					<li>
						<a href={resolve('/instructions-for-doctors-on-female-patients' as any)} onclick={closeDrawer}
							>Instructions for female patients</a
						>
					</li>
					<li>
						<a href={resolve('/instructions-for-doctors-on-male-patients' as any)} onclick={closeDrawer}
							>Instructions for male patients</a
						>
					</li>
					<li><a href={resolve('/faq' as any)} onclick={closeDrawer}>FAQ</a></li>
					<div class="divider"></div>
					<li><a href={resolve('/install')} onclick={closeDrawer}>Install App</a></li>
					<li><a href={resolve('/privacy-policy' as any)} onclick={closeDrawer}>Privacy Policy</a></li>
					<li><a href={resolve('/cookie-policy' as any)} onclick={closeDrawer}>Cookie Policy</a></li>
					<li><a href={resolve('/contact' as any)} onclick={closeDrawer}>Contact</a></li>
				</ul>
			</nav>
		</div>
	</div>
</div>
<UpdateToast />
