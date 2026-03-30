# Launch QA checklist (Urodapter PWA)

Run against the **production** deploy URL after setting `PUBLIC_SITE_URL` in Netlify to match that host (for accurate Open Graph and sitemap URLs).

## Netlify Forms

- [ ] Submit the contact form with valid fields; confirm the entry appears in **Netlify → Forms**.
- [ ] Confirm notification email/Slack (if configured) receives the submission.

## PWA

- [ ] **Install** the app from the browser (iOS Safari / Android Chrome / desktop) per `/install`.
- [ ] Open installed app; confirm **offline**: shell loads without network (airplane mode).
- [ ] Play at least one instruction video online, then retry offline (runtime cache).
- [ ] Use **Download all videos** on the home page; wait for completion; verify offline playback.
- [ ] Deploy a trivial change; confirm **Update** toast appears and refresh applies the new version.

## Navigation and content

- [ ] Home **Table of Contents** links reach all sections.
- [ ] Footer and drawer links (Privacy, Cookie, Contact, Install) work.
- [ ] Instruction pages: **arrow keys** change steps; **swipe** on mobile if applicable.
- [ ] `/sitemap.xml` and `/robots.txt` return 200 and list the correct absolute `Sitemap:` URL.

## Social / SEO (manual spot check)

- [ ] Use a link preview debugger (e.g. Facebook Sharing Debugger or open graph preview tool) on `/`, `/faq`, and one instruction URL; confirm title, description, and image.
