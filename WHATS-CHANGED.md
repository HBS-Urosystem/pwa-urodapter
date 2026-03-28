# What's Changed from the Scraped Version

This document tracks all changes between the original scraped site (`scraped/app.urodapter.com/`) and the new SvelteKit PWA. It must be kept up to date whenever modifications are made.

---

## Platform & Framework

| Aspect | Original (scraped) | New (SvelteKit PWA) |
|---|---|---|
| Framework | Laravel + jQuery + Bootstrap 4 | SvelteKit + Svelte 5 (runes) |
| CSS | Bootstrap 4 + custom `app.css` (~11K lines) | Tailwind CSS v4 + DaisyUI v5 |
| JS | jQuery + Webpack bundle (`app.js`, ~24K lines) | SvelteKit with Vite |
| Adapter | Server-rendered (Laravel) | Netlify (`@sveltejs/adapter-netlify`) |
| PWA | None (no service worker, no manifest) | Full PWA with service worker, manifest, offline support |

## Branding

| Element | Original | New |
|---|---|---|
| Brand reference (scraped site) | Navy `#0B3B54`, dark navy `#072C3F`, highlight `#52B2D6` | UI colors come from DaisyUI themes in `src/routes/layout.css` (below). OS / PWA chrome still use legacy navy as `theme-color` (see row at end). |
| Light theme — `urodapter` | N/A | **Core:** primary `#78c7c9`, secondary `#02979d`, neutral `#005c5b`, accent `#caa8cf` (OKLCH). **Surfaces:** `base-100`–`base-300` white/light gray. **`base-content`** same teal as neutral (body text). **`primary-content` / `secondary-content`:** white. **`accent-content`:** dark purple-tinted. **`neutral-content`:** very light teal. **Semantic (`info`, `success`, `warning`, `error`):** lighter pastel OKLCH fills than the dark theme. |
| Dark theme — `urodapter-dark` | N/A | **Blueish:** `base-*` navy family (~`#0b3b54`). **Primary:** highlight `#52b2d6` (white `primary-content`). **Secondary:** pale `#c7e1f0` (dark navy-tinted `secondary-content`). **Accent:** lavender purple (~`#caa8cf` / hue ~322). **Neutral:** grayscale. **Semantic:** stronger default OKLCH fills; explicit light `*-content` on semantic colors where set. Applied when `prefers-color-scheme: dark`. |
| `@theme` (Tailwind) | N/A | Extra ramp: `primary-light`, `primary-mid` (= light secondary), `primary-dark` (= light neutral), `secondary-dark`, `neutral-light` — teal-aligned helpers alongside Josefin in `layout.css`. |
| Heading font | Source Sans 3 | Josefin Sans (Google Fonts) |
| Body font | Source Sans 3 | System font stack (Tailwind default) |
| Theme color (meta / manifest) | `#0b3b54` | `#78c7c9` in `app.html` and `static/manifest.webmanifest` (unchanged; does not switch with light UI teal) |

## Logo

| Variant | Original | New |
|---|---|---|
| Wordmark (`logo_blue.svg` in scraped site) | `<img>` with `fill="#0B3B54"` | **`LogoWordmark.svelte`** (`src/lib/components/`) used in `Header.svelte` and the home intro (`+page.svelte`): `fill="currentColor"` on the path, so the mark inherits **`text-primary`** and tracks the active DaisyUI theme’s **primary** (teal in light, highlight blue in dark). The old `<img src="/assets/img/logo_blue.svg">` approach is commented out / unused there. |
| `logo_blue.svg` (static file) | N/A in new app as header source | May still exist under `static/assets/img/` for reference; **not** used for navbar or intro wordmark in favor of the inline SVG. |
| `logo_highlight_blue.svg` | `fill="#52B2D6"` (separate file) | **Discarded** (scraped); not used in the new header/intro flow. |
| `logo_white.svg` | `fill="#FFFFFF"` | Still used as `<img>` on **`bg-primary`** (e.g. footer) — white fill, unchanged. |

## Intro Page

| Aspect | Original | New |
|---|---|---|
| Animation | JS image sequence (PNG frames: `intro_loop_000.png` ... `intro_loop_NNN.png`) | Single looping `<video>` (`intro_loop_seq.mp4`, 212KB) |
| Background | SVG radial gradient (`intro_bg_gradient.svg`: `#205a74` → `#023249`) + canvas-driven sequence | CSS `radial-gradient` and `intro_bg_gradient.svg` match: stops at 0% / 61% / 100% (`#2a6d8c` → `#0b3b54` → `#072c3f`), plus `<video>` with `autoplay`, `muted`, `loop`, `playsinline` |

The original frame-by-frame animation cost a lot of bandwidth and CPU. One 212 KB MP4 is friendlier to low-end devices.

## Navigation & Layout

| Aspect | Original | New |
|---|---|---|
| Header | Custom Bootstrap navbar + jQuery hamburger toggle | DaisyUI drawer + navbar component |
| Mobile menu | jQuery-driven slide panel (`#header-menu-mobile`) | DaisyUI drawer sidebar |
| Footer | Bootstrap grid with links | DaisyUI footer with app version display |
| Icons | icomoon icon font | icomoon font (preserved) or inline SVGs |

- On the home page, table-of-contents icon handling is now data-driven and normalized to consistent `24x24` inline SVGs, and the `Install App` action appears beside `Share` in the footer action row instead of as a card.
- The site-wide footer groups **Contact** and **Install App** as two adjacent icon-only links (envelope + download tray, Heroicons-style strokes) with `aria-label`s; Privacy Policy and Cookie Policy stay text links.
- The home TOC strip uses `bg-accent/20` from theme tokens (no hardcoded `dark:` background). Card icons use `text-accent`. Footer uses `bg-primary` / `dark:bg-base-300` instead of a hardcoded teal OKLCH fill.

## Pages & Routes

| Original URL | New Route | Notes |
|---|---|---|
| `index.html` | `/` | Intro overlay + table of contents |
| `how-the-urodapter-works/` | `/how-the-urodapter-works` | Same content |
| `what-to-do-prior-to-instillation/` | `/what-to-do-prior-to-instillation` | Same content |
| `instructions-for-doctors-on-female-patients/` | `/instructions-for-doctors-on-female-patients` | Added step memory, keyboard nav |
| `instructions-for-doctors-on-male-patients/` | `/instructions-for-doctors-on-male-patients` | Added step memory, keyboard nav |
| `faq/` | `/faq` | DaisyUI collapse replaces Bootstrap accordion |
| `privacy-policy/` | `/privacy-policy` | Content cleaned up (see below) |
| `cookie-policy/` | `/cookie-policy` | Content cleaned up (see below) |
| `contact/` | `/contact` | Netlify Forms replaces Laravel POST |
| N/A | `/install` | **New page**: PWA install instructions |

## New Features (not in original)

- **PWA / Offline support**: service worker with precache (app shell, images, fonts) and runtime video caching; `/assets/video/*` uses **cache-first** (cached response if present, otherwise fetch and store).
- **Download all videos**: home page button precaches all 23 instruction videos (~390MB). **Benefits**: full offline viewing after download; when still online, replays use the cached file—**less mobile data**, **faster starts**, **fewer stalls** on weak Wi‑Fi (same files are not re-downloaded each time).
- **PWA install guide**: `/install` page with platform-specific instructions (iOS, Android, desktop)
- **Step memory**: instruction slider remembers last-viewed step in `localStorage`
- **Keyboard navigation**: arrow keys navigate instruction slider steps
- **Update notification**: toast when a new service worker version is deployed
- **Share / QR**: Web Share API button for easy clinic distribution
- **SEO / Open Graph**: per-page `<title>`, `og:*` meta tags, `<meta name="description">`
- **Accessibility**: `aria-label` on videos, `playsinline`, proper heading hierarchy, keyboard-navigable slider

## Removed

- **Google Analytics**: `gtag.js` with tracking ID `G-9EBFHB2BPH` -- removed entirely. No analytics cookies, no third-party data transfers to Google.
- **Cookie consent banner**: not needed (only strictly necessary cookies remain)
- **jQuery**: entire jQuery dependency removed
- **Bootstrap 4**: replaced by Tailwind CSS + DaisyUI
- **CSRF tokens**: Laravel artifact, not applicable
- **Server-side search**: `POST /search` form removed (was server-dependent)
- **reCAPTCHA**: contact form now uses Netlify's built-in honeypot spam filtering
- **AJAX modal content**: `func_plus_data` modals loaded via `/showInstructionPlusDataModal/:id` -- server endpoint no longer exists; content needs to be sourced separately or is static in the new version
- **`ajaxSetFirstOpen`**: Laravel session tracking on first "Enter" click -- removed

## Contact Form

| Aspect | Original | New |
|---|---|---|
| Submission | `POST https://app.urodapter.com/postcontact` (Laravel) | Netlify Forms (`data-netlify="true"` via `static/_forms.html`) |
| Spam protection | Google reCAPTCHA v3 | Netlify honeypot field (`bot-field`) |
| Feedback | Bootstrap modal (success/fail icons) | DaisyUI alert component |

## Privacy Policy Changes

- Removed irrelevant third-party list (Facebook, Instagram, PayPal, Pinterest, Playbuzz, Viber, Vimeo, YouTube) from Section 8
- Added **Netlify** as the sole external data processor (hosting + form submissions)
- Added "Last Updated" date
- Added disclosure about PWA/service worker local caching
- Fixed "app. urodapter.com" spacing

## Cookie Policy Changes

- Fixed "Webshop" / "purchasing goods" references to "Webpage" / "contact" in Terms and Definitions
- Removed redundant preamble (replaced with cross-reference to Privacy Policy)
- Simplified to only describe strictly necessary cookies (no analytics)
- Added "Last Updated" date

## Static Assets

| Original location | New location | Notes |
|---|---|---|
| `img/` | `static/assets/img/` | `logo_highlight_blue.svg` removed; wordmark in UI is inlined with `currentColor` + `text-primary` (see Logo section); `logo_white.svg` kept for footer on primary background |
| `fonts/icomoon/` | `static/assets/fonts/icomoon/` | Copied as-is |
| `media/video/*.mp4` | `static/assets/video/` | 23 files (~390MB), copied as-is |
| `favicon/` + `favicon.ico` | `static/favicon/` + `static/favicon.ico` | Copied as-is |
| `css/app.css` | Not copied | Replaced by Tailwind + DaisyUI |
| `js/app.js` | Not copied | Replaced by SvelteKit components |
| `img/intro/seq/*.png` | Not copied | Replaced by `intro_loop_seq.mp4` |
