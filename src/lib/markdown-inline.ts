/** Trusted editorial markdown: **bold** and [text](url). */
export function escapeHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export function formatInlineMarkdown(s: string): string {
	let t = escapeHtml(s);
	t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
	t = t.replace(
		/\[([^\]]+)\]\(([^)]+)\)/g,
		'<a href="$2" class="link link-primary underline">$1</a>'
	);
	return t;
}
