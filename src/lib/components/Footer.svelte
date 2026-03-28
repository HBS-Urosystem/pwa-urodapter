<script lang="ts">
	import { resolve } from '$app/paths';
	import LogoWordmark from '$lib/components/LogoWordmark.svelte';
</script>

<footer
	class="footer footer-center bg-primary dark:bg-base-100 text-neutral-content p-6"
>
	<nav class="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-sm">
		<span class="inline-flex flex-wrap items-center gap-x-6 gap-y-2 justify-center">
			<a href={resolve('/privacy-policy' as any)} class="link link-hover">Privacy Policy</a>
			<a href={resolve('/cookie-policy' as any)} class="link link-hover">Cookie Policy</a>
		</span>
		<span class="inline-flex items-center gap-x-2">
			<a
				href={resolve('/contact' as any)}
				class="link link-hover inline-flex h-10 w-10 items-center justify-center rounded-lg"
				aria-label="Contact"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
			</a>
			<a
				href={resolve('/install')}
				class="link link-hover inline-flex h-10 w-10 items-center justify-center rounded-lg"
				aria-label="Install app"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
					/>
				</svg>
			</a>
		</span>
	</nav>
	<div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-sm">
		<a href={resolve('/')}>
			<!-- <img src="/assets/img/logo_white.svg" alt="Urodapter" class="h-4" /> -->
			<LogoWordmark class="h-4" />
		</a>
		<span>
			For more information visit
			<a href="https://www.urodapter.com" target="_blank" rel="noopener noreferrer" class="link link-hover underline">
				urodapter.com
			</a>
		</span>
	</div>
</footer>
