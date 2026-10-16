# What's Changed

Differences between the original scraped site (`scraped/app.urodapter.com/`) and this app.

---

## Branding

The app **follows the device light/dark setting automatically**. **Light** appearance is based on the **Urodapter brandbook**; **dark** appearance is based on the **Urosystem brandbook**.

---

## Intro Page


| Aspect    | Original                                  | New                                                                     |
| --------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| Animation | JS image sequence (~5.5 MB of PNG frames) | **~212 KB** looping **video** with a poster frame—far less data and CPU |
| Entry     | Single **Enter** button into the manual    | Two entry buttons: **For Clinicians** opens the existing manual (its Table of Contents); **Self-instillation** opens the **patient journey** (bladder instillation at home) with its own Table of Contents (`/self-instillation`) and menu. Not yet in search results (`noindex`) or the sitemap until the content is approved |


---

## Navigation & Layout


| Aspect       | Original                                                                                                                                               | New                                                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How you move | **Star-shaped:** the **table of contents** was the hub; **each page was only reachable from there**, with no path that walked you through in sequence. | **Step-by-step** flow between the main sections (easier evaluation-style reading), while the **table of contents stays one click away** for the full overview anytime. |
| Logo         | Header and footer logo link to the Table of Contents | Header and footer logo, and the U+ logo at the top left of the menu (in both journeys), bring back the **splash screen**, where the user chooses a journey again |
| Menu         | One menu for the whole site | The menu and the header's Table of Contents button belong to the current journey (clinician manual or patient journey). Shared pages (Contact, Install App, Privacy / Cookie Policy) keep the menu of the journey the user came from. Between two dividers the menu links to the other journey (**For Clinicians** or **Self-instillation**), opening its Table of Contents directly. The clinician menu links to **Sample order**, the patient menu to the **Shop** (urosystem.com/shop?app) |


---

## New Features (not in original)

- **PWA:** Installable app, offline use, service worker, and manifest.
- **Offline video:** Instruction videos can be cached; optional **download all** on the home page for full offline viewing and fewer repeat downloads on poor connections.
- **Install guide:** `/install` with steps per platform.
- **Doctor steps:** Each instruction video shows a large **play button** over the picture while it is paused, so the whole picture starts the video (the same applies to the videos in the patient journey; the educational video page keeps the standard player). Carousel remembers **which step** you were on after reload; **arrow keys**, on-screen **back / next / start over**, and scrolling the active step into view; **reduced motion** respected where relevant.
- **Updates:** Users are **notified** with a Refresh button only when the app they are running is **not the latest deployed version** (e.g. an installed PWA resumed from the background). If the update was installed automatically and the app already loaded the fresh version, no button is shown.
- **Share:** Share action for distributing the app (e.g. in clinics).
- **SEO:** Per-page titles and descriptions, canonical URLs, **Open Graph / Twitter** previews, **sitemap** and **robots.txt**.
- **Accessibility:** Better structure and keyboard use on key flows (e.g. instruction carousel).
- **Patient journey (Self-instillation):** guidance for bladder instillation at home in three approaches – lying or semi-reclined, standing in the shower, partner-assisted. Each approach has a **short summary** (8 numbered steps) and **detailed instructions** with one page per step (step circles 1–8 with a list icon “0” back to the short summary, previous / next bar, breadcrumb). The anatomical figure opens on request, and selecting it shows it full screen. In the lying or semi-reclined approach, steps 5–8 also show clinician instruction videos that open on request the same way (in step 6 the sealing video replaces the sealing drawing); the app remembers the last opened step per approach (“Continue at step n”). All patient pages are prerendered and work offline after the first visit.
- **Camera mirror:** every "mirror" in a heading is a button that opens the front camera as a full-screen lighted mirror: the live picture, mirrored; magnification up to 5× (pinch, mouse wheel or trackpad, `+` / `-`); dragging or the arrow keys move the magnified picture; a white light frame around the edge of the screen (off / soft / bright; starts at soft); the screen stays on. Until the page is reloaded, the mirror opens again with the light, magnification and position last chosen. Exit, Escape or the browser's Back closes it and returns to the same place on the page. Nothing is recorded, stored or sent.

---

## Removed


| Item                     | Original | New                                                        |
| ------------------------ | -------- | ---------------------------------------------------------- |
| Google Analytics         | Yes      | Removed entirely; **can be added back on request**.        |
| Cookie consent banner    | Missing  | Not needed — **no cookies are used**.                      |
| reCAPTCHA (contact form) | Yes      | **Netlify** spam handling instead (invisible to the user). |


---

## Privacy Policy Changes

- Removed irrelevant third-party list (Facebook, Instagram, PayPal, Pinterest, Playbuzz, Viber, Vimeo, YouTube) from Section 8
- Added **Netlify** as the sole external data processor (hosting + form submissions)
- Added "Last Updated" date
- Added disclosure about PWA/service worker local caching
- Fixed "app. urodapter.com" spacing

## Cookie Policy Changes

- Fixed "Webshop" / "purchasing goods" references to "Webpage" / "contact" in Terms and Definitions
- Removed redundant preamble (replaced with cross-reference to Privacy Policy)
- States that **no cookies** are used; PWA/cache storage is not cookie-based and is covered in the Privacy Policy (no analytics)
- Added "Last Updated" date

