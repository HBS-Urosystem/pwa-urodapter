# Camera mirror layer

Copied from **app.urostill** (`src/lib`, commit `4f0f78d`): the front camera shown live and mirrored, with magnification, moving the picture, the white light frame around the edge of the screen (the "halo"), the control pill, and the screen kept awake. Nothing else from app.urostill was copied.

Every "mirror" or "mirrors" in the site's text opens it.

## Files

| File                                                                                                             | Origin                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Mirror.svelte`, `ControlPill.svelte`, `ErrorView.svelte`, `icons/`                                              | app.urostill `components/`, `icons/`                                                                                               |
| `camera.svelte.ts`, `gestures.svelte.ts`, `halo.ts`, `viewport.ts`, `wakelock.svelte.ts`, `config.ts`, `i18n.ts` | app.urostill `src/lib/`                                                                                                            |
| `MirrorLayer.svelte`                                                                                             | New. The full-screen layer (a modal `<dialog>`), in place of app.urostill's main page. Mounted once in `src/routes/+layout.svelte` |
| `openers.ts`, `MirrorText.svelte`                                                                                | New. The opener buttons on the word "mirror"                                                                                       |

Left out of the copy: the intro screen, the Hungarian strings, the debug overlay (only the error name on the error screen remains, with `?debug=1`) and the `?debug=1&res=1080` switch, the guided test hooks (`/test`), motion estimation (`motion/`), the benchmark page, and the unit tests (they stay in app.urostill; this project has no test runner).

Changed in the copy: imports point inside this folder; `ControlPill.svelte` carries the smoked-glass style that app.urostill keeps in `app.css`; `ErrorView.svelte` uses this site's theme colours.

Added after the copy, in both projects: the light starts at soft (it was bright), and the light level, the magnification and the position of the picture chosen last are kept in memory until the page is reloaded (`remembered.ts`).

Comments that mention a "phase", "PLAN" or a "hard rule" refer to app.urostill's `PLAN.md` and `CLAUDE.md`.

## How it opens and closes

- An opener is a `<button data-mirror-opener>`. `addMirrorOpeners()` adds them to HTML strings (`formatInlineMarkdown()` and the `###` headings of `formatBlockMarkdown()` call it), and `MirrorText.svelte` to plain text (step summaries, tips, safety notes). Text inside links is left alone.
- One click listener on the document, in `MirrorLayer.svelte`, opens the layer for every opener.
- Opening adds a history entry (SvelteKit shallow routing, `page.state.mirror`), so Back closes the layer instead of leaving the page. Exit and Escape go back in history too.
- The camera stops whenever the layer closes or the page is hidden, and starts again when the page is shown.

## Testing

- Phone: `npm run dev:https`, then open the printed `https://192.168.x.x:5173` address and accept the certificate warning. Plain `http://` on the local network is not a secure origin, so the browser does not give the page the camera.
- Computer: `npm run dev` and `http://localhost:5173` are enough (localhost counts as secure).
- `?debug=1` in the address shows the camera's raw error name under the message on the error screen.

## Privacy

The same as in app.urostill: no photo, video, screenshot or download; nothing stored; nothing sent. The picture goes from the camera to the `<video>` element and nowhere else, and what the user sets (light, magnification, position) lives in memory only. Keep it that way.
