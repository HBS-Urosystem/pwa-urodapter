<script lang="ts">
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

<div class="drawer">
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
		<nav class="menu bg-base-100 min-h-full w-72 p-4 pt-20">
			<ul>
				<li><a href="/" onclick={closeDrawer}>Table of Contents</a></li>
				<li><a href="/how-the-urodapter-works" onclick={closeDrawer}>Educational Video</a></li>
				<li>
					<a href="/what-to-do-prior-to-instillation" onclick={closeDrawer}
						>What to do prior to instillation</a
					>
				</li>
				<li>
					<a href="/instructions-for-doctors-on-female-patients" onclick={closeDrawer}
						>Instructions for female patients</a
					>
				</li>
				<li>
					<a href="/instructions-for-doctors-on-male-patients" onclick={closeDrawer}
						>Instructions for male patients</a
					>
				</li>
				<li><a href="/faq" onclick={closeDrawer}>FAQ</a></li>
				<div class="divider"></div>
				<li><a href="/install" onclick={closeDrawer}>Install App</a></li>
				<li><a href="/privacy-policy" onclick={closeDrawer}>Privacy Policy</a></li>
				<li><a href="/cookie-policy" onclick={closeDrawer}>Cookie Policy</a></li>
				<li><a href="/contact" onclick={closeDrawer}>Contact</a></li>
			</ul>
		</nav>
	</div>
</div>
<UpdateToast />
