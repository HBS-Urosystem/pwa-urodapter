<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import './layout.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import UpdateToast from '$lib/components/UpdateToast.svelte';
	import LogoMark from '$lib/components/LogoMark.svelte';
	import MirrorLayer from '$lib/mirror/MirrorLayer.svelte';
	import { EXTERNAL_LINKS, MORE_LINKS, TOC_GROUPS, TOC_LABEL } from '$lib/data/site-nav';
	import { markIntroSeen } from '$lib/stores/intro.svelte';

	let { children } = $props();

	/** The pre-paint hint from app.html only covers the prerendered splash; from here on `introPlayed` decides. */
	onMount(() => document.documentElement.removeAttribute('data-intro-seen'));

	/**
	 * A reader who is on any page other than the home page is already inside the app, also after opening
	 * that page directly or reloading it. Marking the splash as passed there makes every "Table of
	 * Contents" link and every logo open the Table of Contents.
	 */
	afterNavigate(({ to }) => {
		if (to && to.url.pathname !== '/') markIntroSeen();
	});

	function closeDrawer() {
		const el = document.getElementById('app-drawer');
		if (el) (el as HTMLInputElement).checked = false;
	}
</script>

<div class="drawer drawer-end">
	<input id="app-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex min-h-screen flex-col">
		<Header />
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
				<!-- U+ logo opens the Table of Contents, like the header logo. -->
				<a
					href={resolve('/')}
					class="btn me-auto btn-square text-primary btn-ghost"
					aria-label="Table of Contents"
					onclick={closeDrawer}
				>
					<LogoMark class="h-7" />
				</a>
				<!-- Text instead of an icon: no icon says "table of contents" unambiguously, and a house would suggest a separate home page. -->
				<a
					href={resolve('/')}
					class="btn px-3 btn-ghost"
					aria-label="Table of Contents"
					onclick={closeDrawer}>Contents</a
				>
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
			<!-- One menu for the whole app: Table of Contents + its sections (sub-entries indented), then the app links, then the external links ($lib/data/site-nav.ts). -->
			<nav class="menu p-4">
				<ul>
					<li><a href={resolve('/')} onclick={closeDrawer}>{TOC_LABEL}</a></li>
					{#each TOC_GROUPS as group (group.heading)}
						{#each group.sections as section (section.path)}
							<li>
								<a href={resolve(section.path as '/')} onclick={closeDrawer}>{section.title}</a>
								{#if section.children}
									<ul>
										{#each section.children as child (child.path)}
											<li>
												<a href={resolve(child.path as '/')} onclick={closeDrawer}>{child.title}</a>
											</li>
										{/each}
									</ul>
								{/if}
							</li>
						{/each}
					{/each}
					<div class="divider"></div>
					{#each MORE_LINKS as link (link.path)}
						<li><a href={resolve(link.path as '/')} onclick={closeDrawer}>{link.label}</a></li>
					{/each}
					<div class="divider"></div>
					{#each EXTERNAL_LINKS as link (link.path)}
						<li>
							<!-- External site: resolve() applies to app routes only -->
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<a href={link.path} target="_blank" rel="noopener noreferrer" onclick={closeDrawer}
								>{link.label}</a
							>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	</div>
</div>
<UpdateToast />
<MirrorLayer />
