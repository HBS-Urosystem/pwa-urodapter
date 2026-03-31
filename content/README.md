# Site content (source of truth)

Human-editable copy for the SvelteKit app. After changing files here, run `npm run content:build` (or `npm run build`, which runs it automatically).

## Conventions

- **Markdown** (`.md`): long prose, FAQ, legal, page blurbs. Top-level sections use `##` headings unless noted.
- **YAML** (`.yaml`): ordered instruction steps (`video`, `plusModalId`, multiline `body`). **`pages/doctor-prior-instillation.meta.yaml`**: `modalButtons` use `placement: afterLetter` and `letter: A` | `C`; letter **C** may list multiple buttons (e.g. separate female vs male disinfection modals).
- **Locale**: English only for now; a future locale could mirror this tree under e.g. `content/hu/`.

## Route → files

| Route                                          | Content files                                                                                                                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/how-the-urodapter-works`                     | `pages/educational-video.md`                                                                                                                                             |
| `/what-to-do-prior-to-instillation`            | `pages/pre-instillation.md` (patient A/B); doctor tab copy: `doctor-prior-instillation.md`, `doctor-prior-instillation.meta.yaml`, `doctor-prior-instillation-modals.md` |
| `/instructions-for-doctors-on-female-patients` | `instructions/female/modals.md`, `steps.yaml`                                                                                                                            |
| `/instructions-for-doctors-on-male-patients`   | `instructions/male/modals.md`, `steps.yaml`                                                                                                                              |
| `/faq`                                         | `pages/faq.md`                                                                                                                                                           |
| `/contact`                                     | `pages/contact.md`                                                                                                                                                       |
| `/privacy-policy`                              | `legal/privacy-policy.md`                                                                                                                                                |
| `/cookie-policy`                               | `legal/cookie-policy.md`                                                                                                                                                 |

## Build output

`scripts/compile-content.mjs` validates content with Zod and writes `src/lib/content/generated.ts`. App code should import from `$lib/content` only (see `src/lib/content/index.ts`).

## Video assets

Instruction step `video` IDs must match files under `static/assets/video/*.mp4`. The checklist in `src/lib/data/video-manifest.ts` should stay in sync with all `video` values used in `steps.yaml` (including the educational video id in `pages/educational-video.md`).
