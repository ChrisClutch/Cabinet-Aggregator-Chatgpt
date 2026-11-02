# Local MVP verification — November 1, 2026

## Passed

- TypeScript strict typecheck (`npm run typecheck`).
- Cloudflare Worker build (`npm run build`). Vinext reports a static-analysis classification notice for several routes; the routes were exercised successfully at runtime.
- Three automated calculator/content checks: 48-unit budget totals, zero-allowance single-unit math, twelve distinct industry guides.
- Fifty HTTP integration checks against local Workers/D1/R2, including all twelve industry routes and the public navigation destinations.
- Anonymous dashboard access denied; cross-origin writes denied; admin login succeeds; session cookie is HttpOnly and SameSite=Strict; logout invalidates the server session.
- Supplier registration persists, pending profiles stay out of the directory, approval publishes a profile, edits return it to review, and supplier accounts cannot use admin actions.
- Quote validation rejects fewer than 12 units, missing consent and a spoofed PDF.
- A valid PDF and quote persist, the request appears in admin, and only the explicit recipient is granted access. Clutch is not added automatically.
- Selected supplier can view and download its assigned request; an unselected supplier cannot view, download or respond. Anonymous download is denied.
- Supplier responses, administrative pipeline states and estimator defaults persist.

## Browser checks

Tested the live application in the Codex browser at desktop 1440×1000 and mobile 390×844:

- Homepage navigation opens the directory.
- Plywood plus a 10-week maximum yields exactly Cascade's demonstration profile.
- Shortlist selection survives resetting filters; Cascade and Atlas appear side by side with their respective capability values.
- Mobile comparison uses an independently scrollable table: page width remains 390 px while the table is 660 px.
- Changing the estimator from 48 to 96 units changes the displayed total from $237,199 to $474,397; page width remains 390 px.
- Submitted a mobile browser test inquiry, received a saved-request reference, and independently confirmed that it appears in the admin API with Cascade as the only recipient.
- Reviewed the apartment-building hero after the founder's correction and adjusted mobile heading/button sizing.
- Private records survive the local preview server restart.

## Issues found and resolved

- Initial npm cache permissions: used a workspace-local install cache.
- Unknown JSON response types: corrected TypeScript annotations/parsing.
- Local Wrangler secret discovery: startup copies ignored `.dev.vars` beside the generated local Worker configuration.
- macOS file-watcher limits: startup uses polling.
- Vinext client prefetch errors: navigation now uses standard accessible anchor links and server-rendered pages.
- Oversized phone headline and wrapped header CTA: adjusted mobile sizing.

## Limits

These are local functional checks, not a penetration test, load test, exhaustive accessibility audit or production certification. PDF content is not scanned for malware. No external email delivery, payment processing, production identity recovery/MFA or remote Cloudflare deployment was tested or implemented. Test accounts and requests remain clearly labeled in the local database and are excluded from the source archive. Demonstration supplier data is fictional. Event counters include QA activity and are not unique-visitor analytics.

## Visual revision verification

Rebuilt successfully after the charcoal/bronze palette, SVG logo and moving hero changes. In the browser, both hero images loaded and animation entered its running state with a changing exterior transform. The kitchen phase became fully visible; Pause set both image animations and the timeline to paused; Play resumed the sequence. Reduced-motion CSS provides a static exterior fallback.

## Directory and price examples follow-up
- TypeScript, existing three calculation/content tests and production build pass.
- Browser: company name search selects Cosmo and updates map title/location; West filter shows Bellmont only; All regions restores four public companies.
- OpenStreetMap embed loads its map controls and selected-city marker; city/U.S. toggle changes geographic bounds.
- At 390px viewport, document scroll width is 390px (no horizontal overflow).
- Price selector changes project totals and calculator links to 100 apartments. Compact example opens estimator with 100 units, 10 cabinets, one vanity and $750 installation; total $341,484 matches the displayed card.
- Public research listings are kept outside the supplier recipient catalog; no leads or messages sent to these businesses.

## Project brief redesign — November 1, 2026
- Final TypeScript check, production build and all five unit tests passed.
- Browser keyboard slider: Home (1 kitchen) sorts Bellmont first alphabetically; End (200+) moves the disclosed operator first. Unknown capacity is not treated as verified suitability.
- Documented-commercial-experience filter shows Cosmo; expandable spec sheet exposes source-backed experience and clearly unknown capacity fields.
- Guided quote: empty step blocks progression, fields persist through Back/Continue, no recipient is selected by default, and local test request ec44f4ed-0c60-4191-b0c8-ff4ff4a40cff saved successfully for Cascade demonstration supplier only. No external email sent.
- Phone-width checks: main routes, five new company-detail routes and all twelve industry routes render with document width 390px at a 390px viewport. Home and commercial page screenshots visually inspected. This is a responsive smoke check, not a full accessibility certification.
- Corrected commercial intro text contrast; computed text is raw maple on walnut (10.09:1). Accent button text uses #111111 to improve contrast over safety orange.
- Moving hero pause/play remains functional. Animated reorder and CSS motion respect reduced-motion preferences.
- No Lighthouse score claimed. Impeccable CLI unavailable; direct checks performed instead.
