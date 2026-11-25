import { browser } from '$app/environment';

/**
 * One rule for what a tab change does to the scroll position, shared by the three pages with tabs
 * ("What to do prior to instillation", the clinician instructions, self-instillation):
 *
 * - While the tab bar is at its place in the page, a tab change does not move the page.
 * - Once the reader has scrolled so far that the tab bar is held under the header, a tab change scrolls
 *   to the start of the content below the tabs, so the reader does not land in the middle of the new tab.
 *
 * A page marks its sticky tab bar with `data-tab-bar` and the first element below it with `data-tab-content`.
 * A tab bar may stick higher than the header's bottom edge, so that its upper part (e.g. pictures) slides
 * under the header and only its lower part stays visible; its own CSS `top` is used for that.
 */

/** Height of the sticky page header in px (`top-16` on the tab bars). */
const HEADER_HEIGHT = 64;

/** Distance in px from the top of the window at which the tab bar sticks (its CSS `top`). */
function stickyTop(bar: HTMLElement): number {
	const top = parseFloat(getComputedStyle(bar).top);
	return Number.isFinite(top) ? top : HEADER_HEIGHT;
}
/** Gap in px between the tab bar and the content after the scroll. */
const GAP = 8;

let stuckBeforeChange = false;

function tabBar(): HTMLElement | null {
	return document.querySelector<HTMLElement>('[data-tab-bar]');
}

/** True when the tab bar is held under the header (the reader has scrolled past its place in the page). */
export function tabsAreStuck(): boolean {
	if (!browser) return false;
	const bar = tabBar();
	return !!bar && bar.getBoundingClientRect().top <= stickyTop(bar) + 1;
}

/** Call before the tab changes; the answer is kept for `tabsWereStuck()` (also across a page change). */
export function rememberTabsStuck(): void {
	stuckBeforeChange = tabsAreStuck();
}

export function tabsWereStuck(): boolean {
	return stuckBeforeChange;
}

/** Scrolls the start of the content below the tabs to just under the tab bar. */
export function scrollToTabContent(smooth = true): void {
	if (!browser) return;
	const bar = tabBar();
	const content = document.querySelector<HTMLElement>('[data-tab-content]');
	if (!bar || !content) return;
	const top =
		window.scrollY +
		content.getBoundingClientRect().top -
		(stickyTop(bar) + bar.offsetHeight + GAP);
	const animate = smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	window.scrollTo({ top: Math.max(0, top), behavior: animate ? 'smooth' : 'auto' });
}
