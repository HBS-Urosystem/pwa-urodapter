<script lang="ts">
	import { siteContent } from '$lib/content';

	const { title, videoId, notes } = siteContent.pageCopy.educationalVideo;
</script>

<svelte:head>
	<title>{title} | Urodapter</title>
	<meta name="description" content={title} />
</svelte:head>

<section class="min-h-full bg-base-200/40 px-4 py-8">
	<div class="mx-auto max-w-3xl text-center">
		<h1 class="mb-4 text-3xl font-bold">{title}</h1>
		{#if notes}
			<p class="mx-auto mb-6 max-w-xl text-base-content/80">{notes}</p>
		{/if}
		<video
			class="aspect-video w-full rounded-lg bg-black shadow-lg"
			controls
			playsinline
			aria-label={title}
		>
			<source src="/assets/video/{videoId}.mp4" type="video/mp4" />
		</video>
	</div>
</section>
