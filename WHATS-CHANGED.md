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
| Entry     | Single **Enter** button into the manual    | Single **Enter** button into the Table of Contents, with a line below it saying the app is for clinicians and for people who perform bladder instillation at home |


---

## Navigation & Layout


| Aspect       | Original                                                                                                                                               | New                                                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How you move | **Star-shaped:** the **table of contents** was the hub; **each page was only reachable from there**, with no path that walked you through in sequence. | **Step-by-step** flow between the main sections (easier evaluation-style reading), while the **table of contents stays one click away** for the full overview anytime. The flow forks after **What to do prior to instillation**: the page ends with two choices, **Instillation by a clinician** and **Self-instillation at home**; the one matching the selected Doctor / Patient tab comes first and is the "next" link of the bottom bar. Arriving back from a branch, the page opens the matching tab (Patient from the self-instillation pages, Doctor from the clinician instructions). Both branches continue to the **FAQ**, whose "previous" link leads back to the branch last opened (to **What to do prior to instillation** when neither branch has been opened yet). |
| Logo         | Header and footer logo link to the Table of Contents | Header and footer logo, and the U+ logo at the top left of the menu, open the Table of Contents; the splash screen shows only on first entry in a browser tab and after a reload of the home page. The header's Table of Contents button is the word **Contents** instead of a house icon. Every "Table of Contents" link opens the Table of Contents itself, also after an inner page was opened directly or reloaded |
| Menu         | One menu for the whole site | One menu for the whole app, in the order of the Table of Contents; **Female patients / Male patients** are listed under *Instillation by a clinician* and the three approaches under *Self-instillation at home*. Below the app links (Install App, Privacy / Cookie Policy, Contact) the menu links to **Sample order** and to the **Shop** (urosystem.com) |
| Table of Contents | Icon cards, one per page | Text cards grouped under three headings: **Before instillation** (Educational Video, What to do prior to instillation), **Instillation: choose who performs it** (Instillation by a clinician, Self-instillation at home) and **Questions** (FAQ). The self-instillation pages are not yet in search results (`noindex`) or the sitemap until the content is approved. The introductory sentence above the cards says "This detailed **guide**" instead of "This detailed manual". When the window is taller than the page content, the spare height is shared evenly between the six blocks of the page (title with introduction, "Table of Contents" heading, the three card groups, the download and Install App / Share actions) |
| Tabs         | — | The selected tab (Doctor / Patient, Female / Male patients, the three self-instillation approaches) is filled with the text colour, for a readable contrast in the light and the dark appearance. One rule for the scroll position on a tab change: the page does not move while the tabs are at their place, and scrolls to the start of the content below the tabs once the tabs are held under the header |
| Text size    | — | One scale on every page: page title 30px, section heading 24px, step heading 20px, sub-heading 18px, body text and card descriptions **16px** (the clinician instruction steps were 14px), small labels 14px |


---

## New Features (not in original)

- **PWA:** Installable app, offline use, service worker, and manifest.
- **Offline video:** Instruction videos can be cached; optional **download all** on the home page for full offline viewing and fewer repeat downloads on poor connections.
- **Install guide:** `/install` with steps per platform.
- **Doctor steps:** The page is titled **Instillation by a clinician**. Numbered **step circles** under the Female / Male tabs open any step directly (the same size as the self-instillation step circles, in one row that scrolls sideways when the circles do not fit; the edge of the row fades out where more circles are hidden), and the step heading carries its number. **Every step has its own address** (e.g. `/instructions-for-doctors-on-female-patients/spooning`), so a step can be linked; the address without a step opens the step last viewed. The **bottom bar steps through the instructions** with the number and title of the previous / next step (before the first step it leads to *Prior to instillation*, after the last step to the *FAQ*), replacing the back / next / start over buttons inside the card; a **Start at step 1** button appears below the card from step 2 on. The card is as tall as the current step. Changing the step in any way (circle, bottom bar, arrow keys, swipe) leaves the top of the card visible, and the browser's Back button leaves the instructions in one go instead of walking back through the steps. Each instruction video shows a large **play button** over the picture while it is paused, so the whole picture starts the video (the same applies to the videos of the self-instillation pages; the educational video page keeps the standard player). Carousel remembers **which step** you were on after reload; **arrow keys** and swipe; **reduced motion** respected where relevant.
- **Updates:** Users are **notified** with a Refresh button only when the app they are running is **not the latest deployed version** (e.g. an installed PWA resumed from the background). If the update was installed automatically and the app already loaded the fresh version, no button is shown.
- **Share:** Share action for distributing the app (e.g. in clinics).
- **SEO:** Per-page titles and descriptions, canonical URLs, **Open Graph / Twitter** previews, **sitemap** and **robots.txt**.
- **Accessibility:** Better structure and keyboard use on key flows (e.g. instruction carousel).
- **Self-instillation at home:** guidance for bladder instillation at home in three approaches – lying or semi-reclined, standing in the shower, partner-assisted. The three approaches are **three tabs of one page** (`/self-instillation`), each with its own address; the introductory text ("Read first") is a section above the tabs that opens on request (open on the first visit; when it closes because the reader chose a tab, the page scrolls to the line that asks the reader to choose an approach), and the page opens the approach last viewed. Each approach has a picture, a **short summary** (8 numbered steps) and **detailed instructions** with one page per step (step circles 1–8 with a list icon “0” back to the short summary, previous / next bar, breadcrumb; moving from step to step does not add entries to the browser history, so the Back button returns to the summary in one go). The anatomical figure opens on request, and selecting it shows it full screen. In all three approaches, steps 5–8 also show clinician instruction videos that open on request the same way (in step 6 the sealing video replaces the sealing drawing); the video in step 7 is titled “Instilling the solution”; in step 8 the leakage video section lists the three lettered checks (A–C) under the video and plays a version shortened to its first 14 seconds (the clinician manual keeps the full video), and the two other videos are titled “Relaxing the sphincter” and “Adjusting the angle”; the step 8 text is the same in all three approaches, in the partner-assisted approach worded for the partner who holds the syringe; the app remembers the last opened step per approach (“Continue at step n”). All patient pages are prerendered and work offline after the first visit.
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

