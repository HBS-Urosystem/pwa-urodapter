<script lang="ts">
	import { resolve } from '$app/paths';
	import LogoWordmark from '$lib/components/LogoWordmark.svelte';
</script>

<nav class="navbar sticky top-0 z-40 bg-base-100 px-4 shadow-sm">
	<div class="flex-1">
		<!-- Logo opens the Table of Contents. The splash screen shows there only if it was not passed yet in this tab, or after a reload. -->
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<a
			href={resolve('/')}
			class="btn text-primary btn-ghost hover:border-transparent hover:bg-transparent hover:shadow-none max-[359px]:px-1"
			aria-label="Table of Contents"
		>
			<!-- Below 360px the logo is slightly smaller so the "Contents" button fits beside it. -->
			<LogoWordmark class="h-8 max-[359px]:h-7" />
		</a>
	</div>
	<div class="flex-none gap-1">
		<!-- Text instead of an icon: no icon says "table of contents" unambiguously, and a house would suggest a separate home page. -->
		<a
			href={resolve('/')}
			class="btn px-3 btn-ghost max-[359px]:px-2"
			aria-label="Table of Contents">Contents</a
		>
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
