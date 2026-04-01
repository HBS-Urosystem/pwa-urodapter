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
};

/** `###` subheads, single-line `- ` bullets, paragraphs. */
export function formatBlockMarkdown(block: string, options?: FormatBlockMarkdownOptions): string {
	const h3Class = options?.h3Class ?? 'text-lg font-semibold !mt-4 mb-2';
	const parts = block.split(/\n(?=### )/);
	let out = '';
	for (const p of parts) {
		const h = p.trimStart().match(/^### ([^\n]+)(?:\n([\s\S]*))?/);
		if (h) {
			out += `<h3 class="${h3Class}">${escapeHtml(h[1].trim())}</h3>`;
			out += formatListAndParagraphs(h[2] ?? '');
		} else {
			out += formatListAndParagraphs(p);
		}
	}
	return out;
}

function formatListAndParagraphs(s: string): string {
	const lines = s.trim().split('\n');
	let html = '';
	let inList = false;
	for (const line of lines) {
		if (!line.trim()) continue;
		const bullet = line.match(/^\s*-\s+(.*)/);
		if (bullet) {
			if (!inList) {
				html += '<ul class="list-disc pl-5 my-2 space-y-1">';
				inList = true;
			}
			html += `<li>${formatInlineMarkdown(bullet[1])}</li>`;
		} else {
			if (inList) {
				html += '</ul>';
				inList = false;
			}
			if (line.trim()) {
				html += `<p class="my-2">${formatInlineMarkdown(line)}</p>`;
			}
		}
	}
	if (inList) html += '</ul>';
	return html;
}
