<script lang="ts">
	import { resolve } from '$app/paths';
	import LogoWordmark from '$lib/components/LogoWordmark.svelte';
	import { resetIntro } from '$lib/stores/intro.svelte';
</script>

<nav class="navbar sticky top-0 z-40 bg-base-100 px-4 shadow-sm">
	<div class="flex-1">
		<!-- Logo brings back the splash screen. -->
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<a
			href={resolve('/')}
			onclick={resetIntro}
			class="btn text-primary btn-ghost hover:border-transparent hover:bg-transparent hover:shadow-none"
			aria-label="Home"
		>
			<LogoWordmark class="h-8" />
		</a>
	</div>
	<div class="flex-none gap-1">
		<a href={resolve('/')} class="btn btn-square btn-ghost" aria-label="Table of Contents">
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
					d="M4 6h4M4 12h4M4 18h4M12 6h8M12 12h8M12 18h8"
				/>
			</svg>
		</a>
		<label for="app-drawer" class="btn btn-square btn-ghost" aria-label="Open menu">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</label>
	</div>
</nav>
