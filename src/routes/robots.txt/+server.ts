import { env } from '$env/dynamic/public';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ url }) => {
	const base = (env.PUBLIC_SITE_URL?.trim() || url.origin).replace(/\/$/, '');
	const body = `# allow crawling everything by default
User-agent: *
Disallow:

Sitemap: ${base}/sitemap.xml
`;
	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
