import { env } from '$env/dynamic/public';
import { SITEMAP_PATHS } from '$lib/seo';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ url }) => {
	const base = (env.PUBLIC_SITE_URL?.trim() || url.origin).replace(/\/$/, '');
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_PATHS.map((p) => `  <url><loc>${base}${p}</loc></url>`).join('\n')}
</urlset>
`;
	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
