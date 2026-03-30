<script lang="ts">
	import { resolve } from '$app/paths';
	import SeoHead from '$lib/components/SeoHead.svelte';

	const title = 'Install App | Urodapter';
	const description =
		'Install the Urodapter PWA on your device for quick access from your home screen. Works offline once installed — instructions and videos without an internet connection.';
</script>

<SeoHead {title} {description} path="/install" />

<section class="mx-auto max-w-2xl px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">Install Urodapter App</h1>

	<p class="mb-4">
		Install the Urodapter app on your device for quick access from your home screen. The app works
		offline once installed — no internet connection needed for viewing instructions and videos.
	</p>

	<div role="alert" class="mb-6 alert alert-info">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			class="h-6 w-6 shrink-0 stroke-current"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			></path>
		</svg>
		<span>
			Videos are cached as you watch them, or use the "Download all videos" button on the home page
			to prepare for fully offline use.
		</span>
	</div>

	<div class="collapse-arrow collapse mb-2 bg-base-200">
		<input type="radio" name="install-accordion" checked />
		<div class="collapse-title font-semibold">iOS — Safari</div>
		<div class="collapse-content">
			<ol class="list-inside list-decimal space-y-1">
				<li>Open this page in <strong>Safari</strong> (not Chrome or other browsers)</li>
				<li>
					Tap the <strong>Share</strong> button (square with arrow) at the bottom of the screen
				</li>
				<li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
				<li>Tap <strong>"Add"</strong> in the top right corner</li>
				<li>The Urodapter icon will appear on your home screen</li>
			</ol>
			<p class="mt-3 text-sm opacity-70">
				Important: On iOS, PWAs can only be installed through Safari.
			</p>
		</div>
	</div>

	<div class="collapse-arrow collapse mb-2 bg-base-200">
		<input type="radio" name="install-accordion" />
		<div class="collapse-title font-semibold">Android — Chrome</div>
		<div class="collapse-content">
			<ol class="list-inside list-decimal space-y-1">
				<li>Tap the <strong>three-dot menu</strong> (⋮) in the top right corner</li>
				<li>Tap <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong></li>
				<li>Tap <strong>"Install"</strong> to confirm</li>
				<li>The app will appear in your app drawer and home screen</li>
			</ol>
			<p class="mt-3 text-sm opacity-70">
				If you see an install banner at the bottom of the screen, you can tap it directly.
			</p>
		</div>
	</div>

	<div class="collapse-arrow collapse mb-2 bg-base-200">
		<input type="radio" name="install-accordion" />
		<div class="collapse-title font-semibold">Desktop — Chrome / Edge</div>
		<div class="collapse-content">
			<ol class="list-inside list-decimal space-y-1">
				<li>Click the <strong>install icon</strong> (⊕) in the address bar on the right side</li>
				<li>Click <strong>"Install"</strong> in the dialog that appears</li>
				<li>
					The app opens in its own window and is accessible from your Start menu / Applications
				</li>
			</ol>
			<p class="mt-3 text-sm opacity-70">
				You can also use the browser menu (⋮) → "Install Urodapter..."
			</p>
		</div>
	</div>

	<a href={resolve('/')} class="btn mt-6 btn-primary">Back to Home</a>
</section>
