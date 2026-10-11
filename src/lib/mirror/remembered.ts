import type { HaloLevel } from './config';
import type { Vec } from './viewport';

/**
 * What the user last set in the mirror, kept in memory for this visit only, so
 * the mirror opens the same way again after Exit. Never persisted — hard rule
 * 2: a reload starts again from the defaults in config.ts.
 */

/** The magnification, and the picture point held in the middle (normalised, as in Mirror). */
export interface RememberedView {
	zoom: number;
	centre: Vec;
}

let light: HaloLevel | null = null;
let view: RememberedView | null = null;

/** Null until the user has changed the light once in this visit. */
export function chosenLight(): HaloLevel | null {
	return light;
}

export function rememberLight(level: HaloLevel): void {
	light = level;
}

/** Null until the mirror has been shown once in this visit. */
export function chosenView(): RememberedView | null {
	return view;
}

export function rememberView(zoom: number, centre: Vec): void {
	view = { zoom, centre: { x: centre.x, y: centre.y } };
}
