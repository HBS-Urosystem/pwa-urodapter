# Site content (source of truth)

Human-editable copy for the SvelteKit app. After changing files here, run `npm run content:build` (or `npm run build`, which runs it automatically).

## Conventions

- **Markdown** (`.md`): long prose, FAQ, legal, page blurbs. Top-level sections use `##` headings unless noted.
- **YAML** (`.yaml`): ordered instruction steps (`video`, `plusModalId`, multiline `body`). **`pages/doctor-prior-instillation.meta.yaml`** (step 1 of the clinician instructions): `modalButtons` use `placement: afterLetter` and `letter: A` | `C`; letter **C** may list buttons too (none at the moment; the disinfection texts in `doctor-prior-instillation-modals.md` are not shown). `pages/pre-instillation.md` (patient preparation) is not shown anywhere at the moment.
- **Self-instillation at home** (`patient/`): `overview.md` (text above the approach tabs: `## intro`, `## practise`, `## not-for-everyone`, `## how-to-use`) and one YAML per approach (`lying`, `shower`, `partner`) with exactly 8 steps in a fixed order (`prepare`, `position`, `disinfect`, `locate`, `place`, `seal`, `instill`, `feedback`). Each step has `label` (summary row), `title` (step page heading), `summary`, `body` and optional `tips`. In `body`, `### ` is a subheading, `- ` a bullet, `1. ` a numbered item, a line indented by two spaces under a bullet a further paragraph of that bullet, and a line `[[figure:anatomy]]` or `[[figure:sealing]]` places a figure, and a line `[[video:158]]` places a clinician instruction video in a closed section that opens on request (any `video` id from `instructions/female/steps.yaml`; the section title is that step's title unless the marker is written `[[video:170|Own title]]`; lines `(A) text`, `(B) text` directly after a marker are shown as lettered points under the video). The video markers and the step 8 text were added by hand after generation (`lying.yaml` 2026-10-16, `shower.yaml` and `partner.yaml` 2026-11-13), so `build.py` would overwrite them. The files are generated from the patient docx by `_workfiles/patient-source/` (see its README); the text is verbatim.
- **Locale**: English only for now; a future locale could mirror this tree under e.g. `content/hu/`.

## Route → files

| Route                                          | Content files                                                                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/how-the-urodapter-works`                     | `pages/educational-video.md`                                                                                                                      |
| `/instructions-for-doctors-on-female-patients` | `instructions/female/modals.md`, `steps.yaml`; step 1 (`prior-to-instillation`): `pages/doctor-prior-instillation.md`, `.meta.yaml`, `-modals.md` |
| `/instructions-for-doctors-on-male-patients`   | `instructions/male/modals.md`, `steps.yaml`; step 1 (`prior-to-instillation`): `pages/doctor-prior-instillation.md`, `.meta.yaml`, `-modals.md`   |
| `/faq`                                         | `pages/faq.md`                                                                                                                                    |
| `/contact`                                     | `pages/contact.md`                                                                                                                                |
| `/privacy-policy`                              | `legal/privacy-policy.md`                                                                                                                         |
| `/cookie-policy`                               | `legal/cookie-policy.md`                                                                                                                          |
| `/self-instillation`                           | `patient/overview.md` (approach cards: `cardTitle`, `cardDescription`, `image`, `imageAlt` in `patient/*.yaml`; the menu uses `label`)            |
| `/self-instillation/{lying,shower,partner}`    | `patient/{id}.yaml` (`intro`, step `label` + `summary`, `safety`)                                                                                 |
| `/self-instillation/{approach}/{step}`         | `patient/{approach}.yaml` (step `title`, `body`, `tips`; `safety` on the last step); figures in `static/assets/patient/`                          |

## Build output

`scripts/compile-content.mjs` validates content with Zod and writes `src/lib/content/generated.ts` (and `generated-patient-nav.ts`, the small approach list used by the menu). App code should import from `$lib/content` only (see `src/lib/content/index.ts`).

## Video assets

The real-case videos (`real-case-female-1…3.mp4`, `real-case-male.mp4`, posters `.jpg` beside them) are listed in `src/lib/data/real-case-videos.ts`; they are shown on the page after the last step of every step sequence (`/self-instillation/<approach>/real-case-videos`, and the last step `real-case-videos` of both clinician pages).

Instruction step `video` IDs must match files under `static/assets/video/*.mp4`. If `<id>-patient.mp4` exists (a shortened copy, e.g. `165-patient.mp4`, the first 14 s of video 165), the self-instillation pages play it instead of `<id>.mp4`; the clinician manual keeps the full video. The checklist in `src/lib/data/video-manifest.ts` should stay in sync with all `video` values used in `steps.yaml` (including the educational video id in `pages/educational-video.md`).
