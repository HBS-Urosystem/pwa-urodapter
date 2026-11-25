import { browser } from '$app/environment';
import type { BeforeNavigate } from '@sveltejs/kit';

/** Height of the sticky page header in px. */
const HEADER_HEIGHT = 64;
/** Distance in px between the top of the window and the title after the scroll (header + 16px). */
const TITLE_OFFSET = HEADER_HEIGHT + 16;
/** Longest wait in ms for the smooth scroll to end before the held page height is released anyway. */
const RELEASE_FALLBACK_MS = 1500;

/**
 * Self-instillation step pages (steps 1–8 and the real-case videos): after a change of step (bottom bar or
 * step circle) the title of the new step is in view. The links keep the scroll position (`noscroll`); when the
 * title is then hidden under the header or lower than the middle of the window, the page scrolls smoothly
 * (instantly with reduced motion) until the title is just under the header. Otherwise the page does not move.
 *
 * A new step can be shorter than the scroll position of the old one; the browser would then jump up at once.
 * So during the change the page keeps the height of the old step (`holdPageHeight`; the page background fills
 * the extra height), and gets its own height back when the scroll has ended. The scroll never goes further down
 * than the new step's own height allows, so nothing jumps when that height comes back.
 */

function pageColumn(): HTMLElement | null {
	return document.querySelector<HTMLElement>('.drawer-content');
}

/**
 * Largest scroll position of the page at its own height: the held extra height is the part of the
 * stretched block before the bottom bar below its content.
 */
function ownMaxScroll(): number {
	const doc = document.documentElement;
	const stretched = document.querySelector<HTMLElement>('main > :has(+ .content-flow-nav)');
	let extra = 0;
	if (stretched) {
		const rect = stretched.getBoundingClientRect();
		const children = [...stretched.children].map((c) => c.getBoundingClientRect().bottom);
		const contentBottom =
			Math.max(rect.top, ...children) + parseFloat(getComputedStyle(stretched).paddingBottom);
		extra = Math.max(0, rect.bottom - contentBottom);
	}
	return Math.max(0, doc.scrollHeight - extra - window.innerHeight);
}

function releasePageHeight(): void {
	const column = pageColumn();
	if (column) column.style.minHeight = '';
}

/**
 * Call from `beforeNavigate` of a step page: when the link leads to another step of the same approach,
 * the page keeps its current height until `showStepTitle` has brought the new title into view.
 */
export function holdPageHeight({ type, to }: BeforeNavigate, approachPath: string): void {
	if (!browser || type !== 'link' || !to?.url.pathname.startsWith(`${approachPath}/`)) return;
	const column = pageColumn();
	if (column) column.style.minHeight = `${document.documentElement.scrollHeight}px`;
}

export function showStepTitle(title: HTMLElement | undefined): void {
	if (!browser) return;
	if (!title) {
		releasePageHeight();
		return;
	}
	const top = title.getBoundingClientRect().top;
	if (top >= HEADER_HEIGHT && top <= window.innerHeight * 0.5) {
		releasePageHeight();
		return;
	}
	const target = Math.min(window.scrollY + top - TITLE_OFFSET, ownMaxScroll());
	const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (!animate || Math.abs(target - window.scrollY) < 1) {
		window.scrollTo({ top: target });
		releasePageHeight();
		return;
	}
	let timer = 0;
	const done = () => {
		window.clearTimeout(timer);
		window.removeEventListener('scrollend', done);
		releasePageHeight();
	};
	window.addEventListener('scrollend', done, { once: true });
	timer = window.setTimeout(done, RELEASE_FALLBACK_MS);
	window.scrollTo({ top: target, behavior: 'smooth' });
}
