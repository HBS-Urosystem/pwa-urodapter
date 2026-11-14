/**
 * Client-only: without a step in the address the page opens the step stored in `localStorage`
 * on first paint (no SSR/hydration mismatch).
 */
export const ssr = false;
