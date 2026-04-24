/** Trusted editorial markdown: **bold** and [text](url). */
export function escapeHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/**
 * @param linkClass - Tailwind classes for `[text](url)` links. Use a strong contrast (e.g. `!text-base-content`) on pale surfaces such as `alert-info`.
 */
export function formatInlineMarkdown(
	s: string,
	linkClass = 'link link-primary underline'
): string {
	let t = escapeHtml(s);
	t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
	t = t.replace(
		/\[([^\]]+)\]\(([^)]+)\)/g,
		(_m, text: string, href: string) =>
			`<a href="${href}" class="${escapeHtml(linkClass)}">${text}</a>`
	);
	return t;
}
