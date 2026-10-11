/**
 * Every "mirror" (and "mirrors") in the site's text opens the camera mirror
 * layer. An opener is a plain button with the `data-mirror-opener` attribute;
 * one click listener on the document (MirrorLayer.svelte) handles them all, so
 * they also work inside HTML rendered with {@html}.
 */

export const OPENER_SELECTOR = '[data-mirror-opener]';
export const OPENER_CLASS = 'link link-primary decoration-dashed underline-offset-2';
export const OPENER_TITLE = 'Open the camera mirror';

/** Whole words, any case. The capturing group keeps the word itself in `split`. */
const MIRROR_WORD = /\b(mirrors?)\b/i;

export interface TextPart {
	text: string;
	opener: boolean;
}

/** Plain text as runs of text and the mirror words between them. */
export function splitMirrorWords(text: string): TextPart[] {
	return text
		.split(MIRROR_WORD)
		.map((part, i) => ({ text: part, opener: i % 2 === 1 }))
		.filter((part) => part.text !== '');
}

function openerHtml(word: string): string {
	return `<button type="button" data-mirror-opener class="${OPENER_CLASS}" title="${OPENER_TITLE}">${word}</button>`;
}

/**
 * Wraps the mirror words of an HTML string in openers. Only text is changed:
 * tags and their attributes are left alone, and so is the text of links and
 * buttons, because a button cannot sit inside either.
 */
export function addMirrorOpeners(html: string): string {
	return html
		.split(/(<a\b[\s\S]*?<\/a>|<button\b[\s\S]*?<\/button>|<[^>]*>)/i)
		.map((part, i) =>
			i % 2 === 1 ? part : part.replace(new RegExp(MIRROR_WORD.source, 'gi'), openerHtml)
		)
		.join('');
}
