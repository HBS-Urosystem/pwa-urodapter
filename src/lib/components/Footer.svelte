<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<footer
	class="footer footer-center bg-primary text-primary-content dark:bg-base-300 dark:text-base-content p-6"
>
	<nav class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
		<a href={resolve('/privacy-policy' as any)} class="link link-hover">Privacy Policy</a>
		<a href={resolve('/cookie-policy' as any)} class="link link-hover">Cookie Policy</a>
		<a href={resolve('/contact' as any)} class="link link-hover">Contact</a>
		<a href={resolve('/install')} class="link link-hover">Install App</a>
	</nav>
	<div class="flex flex-wrap items-center justify-center gap-2 text-sm">
		<a href={resolve('/')}>
			<img src="/assets/img/logo_white.svg" alt="Urodapter" class="h-4" />
		</a>
		<span>
			For more information visit
			<a href="https://www.urodapter.com" target="_blank" rel="noopener noreferrer" class="link link-hover underline">
				urodapter.com
			</a>
		</span>
	</div>
</footer>
