<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<!-- Patient journey: keep out of search results until the content is approved after the medical review.
	     At launch, remove this and add the hub and approach pages to SITEMAP_PATHS in $lib/seo.ts. -->
	<meta name="robots" content="noindex" />
</svelte:head>

{@render children()}
