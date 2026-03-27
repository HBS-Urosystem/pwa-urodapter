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
| Primary colors | `#0B3B54` (navy), `#072C3F` (dark navy), `#52B2D6` (highlight) | DaisyUI OKLCH: navy `#0b3b54` + highlight `#52b2d6` (light theme primary / dark theme surfaces); teal palette removed |
| Secondary colors | N/A | Purple/magenta secondary unchanged (OKLCH hue ~322) |
| Neutral colors | N/A | Grayscale neutral unchanged |
| Heading font | Source Sans 3 | Josefin Sans (Google Fonts) |
| Body font | Source Sans 3 | System font stack (Tailwind default) |
| Theme color (meta) | `#0b3b54` | `#0b3b54` (manifest + `app.html` aligned) |
| Dark mode | N/A | Second DaisyUI theme `urodapter-dark` (`prefers-color-scheme: dark`): base surfaces from navy `#0b3b54`, primary/accent from `#52b2d6`; secondary/neutral tokens match light theme |

## Logo

| Variant | Original | New |
|---|---|---|
| `logo_blue.svg` | `fill="#0B3B54"` | `fill="#52b2d6"` (brand highlight blue) |
| `logo_highlight_blue.svg` | `fill="#52B2D6"` (separate file) | **Discarded** -- `logo_blue.svg` used instead |
| `logo_white.svg` | `fill="#FFFFFF"` | Unchanged (`fill="#FFFFFF"`) |

## Intro Page

| Aspect | Original | New |
|---|---|---|
| Animation | JS image sequence (PNG frames: `intro_loop_000.png` ... `intro_loop_NNN.png`) | Single looping `<video>` (`intro_loop_seq.mp4`, 212KB) |
| Background | SVG radial gradient (`intro_bg_gradient.svg`: `#205a74` → `#023249`) + canvas-driven sequence | CSS `radial-gradient` and `intro_bg_gradient.svg` use `#52b2d6` → `#0b3b54` / `#072c3f` (no teal stops), plus `<video>` with `autoplay`, `muted`, `loop`, `playsinline` |
| Black bg removal | N/A (PNG frames had transparent backgrounds) | `mix-blend-mode: screen` on `<video>` makes the MP4's black background transparent against the radial gradient |

The original frame-by-frame animation cost a lot of bandwidth and CPU. One 212 KB MP4 is friendlier to low-end devices.

## Navigation & Layout

| Aspect | Original | New |
|---|---|---|
| Header | Custom Bootstrap navbar + jQuery hamburger toggle | DaisyUI drawer + navbar component |
| Mobile menu | jQuery-driven slide panel (`#header-menu-mobile`) | DaisyUI drawer sidebar |
| Footer | Bootstrap grid with links | DaisyUI footer with app version display |
| Icons | icomoon icon font | icomoon font (preserved) or inline SVGs |

- On the home page, table-of-contents icon handling is now data-driven and normalized to consistent `24x24` inline SVGs, and the `Install App` action appears beside `Share` in the footer action row instead of as a card.
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

- **PWA / Offline support**: service worker with precache (app shell, images, fonts) and runtime video caching
- **Download all videos**: button on home page triggers service worker to cache all 23 instruction videos (~390MB) for full offline use
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
| `img/` | `static/assets/img/` | Logo colors updated, `logo_highlight_blue.svg` removed |
| `fonts/icomoon/` | `static/assets/fonts/icomoon/` | Copied as-is |
| `media/video/*.mp4` | `static/assets/video/` | 23 files (~390MB), copied as-is |
| `favicon/` + `favicon.ico` | `static/favicon/` + `static/favicon.ico` | Copied as-is |
| `css/app.css` | Not copied | Replaced by Tailwind + DaisyUI |
| `js/app.js` | Not copied | Replaced by SvelteKit components |
| `img/intro/seq/*.png` | Not copied | Replaced by `intro_loop_seq.mp4` |
