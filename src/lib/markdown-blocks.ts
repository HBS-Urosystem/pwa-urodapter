import { escapeHtml, formatInlineMarkdown } from './markdown-inline';

/** Splits main body on `## ` headings (at line start). */
export function splitMarkdownH2(md: string): { heading: string; body: string }[] {
	const trimmed = md.trim();
	const chunks = trimmed.split(/\n(?=## )/);
	return chunks.map((chunk) => {
		if (chunk.startsWith('## ')) {
			const nl = chunk.indexOf('\n');
			const heading = nl === -1 ? chunk.slice(3).trim() : chunk.slice(3, nl).trim();
			const body = nl === -1 ? '' : chunk.slice(nl + 1).trim();
			return { heading, body };
		}
		return { heading: '', body: chunk.trim() };
	});
}

export type FormatBlockMarkdownOptions = {
	/** Tailwind classes for `###` lines (default: semibold section subheads). */
	h3Class?: string;
	/** Treat `1. ` lines as an ordered list (off by default: the legal pages use numbered lines as paragraphs). */
	orderedLists?: boolean;
};

/** `###` subheads, single-line `- ` bullets, optional `1. ` ordered lists, paragraphs. */
export function formatBlockMarkdown(block: string, options?: FormatBlockMarkdownOptions): string {
	const h3Class = options?.h3Class ?? 'text-lg font-semibold !mt-4 mb-2';
	const ordered = options?.orderedLists ?? false;
	const parts = block.split(/\n(?=### )/);
	let out = '';
	for (const p of parts) {
		const h = p.trimStart().match(/^### ([^\n]+)(?:\n([\s\S]*))?/);
		if (h) {
			out += `<h3 class="${h3Class}">${escapeHtml(h[1].trim())}</h3>`;
			out += formatListAndParagraphs(h[2] ?? '', ordered);
		} else {
			out += formatListAndParagraphs(p, ordered);
		}
	}
	return out;
}

function formatListAndParagraphs(s: string, ordered: boolean): string {
	const lines = s.trim().split('\n');
	let html = '';
	let list: 'ul' | 'ol' | null = null;
	const closeList = () => {
		if (list) html += `</${list}>`;
		list = null;
	};
	for (const line of lines) {
		if (!line.trim()) continue;
		const bullet = line.match(/^\s*-\s+(.*)/);
		const numbered = ordered ? line.match(/^\s*\d+\.\s+(.*)/) : null;
		const item = bullet ?? numbered;
		if (item) {
			const kind = bullet ? 'ul' : 'ol';
			if (list !== kind) {
				closeList();
				html +=
					kind === 'ul'
						? '<ul class="list-disc pl-5 my-2 space-y-1">'
						: '<ol class="list-decimal pl-5 my-2 space-y-1">';
				list = kind;
			}
			html += `<li>${formatInlineMarkdown(item[1])}</li>`;
		} else {
			closeList();
			html += `<p class="my-2">${formatInlineMarkdown(line)}</p>`;
		}
	}
	closeList();
	return html;
}
