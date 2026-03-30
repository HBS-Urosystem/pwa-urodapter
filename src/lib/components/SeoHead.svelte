<script lang="ts">
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import { DEFAULT_OG_IMAGE_PATH, SITE_NAME } from '$lib/seo';

	type Props = {
		title: string;
		description: string;
		path: string;
		imagePath?: string;
		ogType?: 'website' | 'article';
	};

	let {
		title,
		description,
		path,
		imagePath = DEFAULT_OG_IMAGE_PATH,
		ogType = 'website'
	}: Props = $props();

	const base = $derived.by(() => {
		const e = env.PUBLIC_SITE_URL?.trim();
		if (e) return e.replace(/\/$/, '');
		return page.url.origin;
	});

	const normalizedPath = $derived(path.startsWith('/') ? path : `/${path}`);
	const canonicalUrl = $derived(`${base}${normalizedPath}`);
	const ogImageUrl = $derived(`${base}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:image" content={ogImageUrl} />
	<meta property="og:image:alt" content={title} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImageUrl} />
</svelte:head>
