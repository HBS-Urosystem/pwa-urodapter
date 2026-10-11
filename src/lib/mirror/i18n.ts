/**
 * Every user-facing string of the mirror layer. English only, like the rest
 * of the site; app.urostill also has the Hungarian set.
 */

const en = {
	title: 'Mirror',
	starting: 'Starting the camera',
	retry: 'Try again',
	exit: 'Exit',
	errDenied:
		'Camera access is off. Allow the camera for this site in your browser settings, then tap Try again.',
	errNoCamera: 'No front camera found on this device.',
	errInUse: 'Another app is using the camera. Close it, then tap Try again.',
	errInsecure: 'The camera needs a secure (https) connection.',
	errUnsupported: "This browser can't show the camera. Open the page in Safari or Chrome.",
	lightOff: 'Light: off',
	lightSoft: 'Light: soft',
	lightBright: 'Light: bright',
	zoomReset: 'Zoom {n}×, tap to reset'
} as const;

export type StringKey = keyof typeof en;
export type Strings = Record<StringKey, string>;

export const STRINGS: Strings = en;

/** 1 → "1", 2.54 → "2.5". Shown with tabular figures, so the width is steady. */
export function formatZoom(zoom: number): string {
	return String(Math.round(zoom * 10) / 10);
}

/** Fills `{name}` placeholders. Unknown names are left alone. */
export function fill(template: string, values: Record<string, string | number>): string {
	return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
		name in values ? String(values[name]) : whole
	);
}
