# Project brief applied to the existing marketplace

## Design
The millwork shop-floor direction replaces the previous neutral SaaS presentation: raw maple background, sawdust panels, walnut headings, blackened steel text, safety orange controls, and graphite rules. Fraunces display type, Source Sans 3 body text, and IBM Plex Mono annotations replace the old typography. The moving apartment hero and transparent cost examples remain.

## Product changes
- Home: project entry points, 1–200+ project-size slider, company specification sheets, budget examples.
- Directory: real sourced companies plus the disclosed operator; search, region and documented-commercial-experience filters; animated reorder with reduced-motion support.
- Commercial page: use cases and an explicit explanation of placement vs. a future documented capacity ranking.
- Company detail pages at `/shops/:id`; per-company metadata and update request link.
- About page and footer: operator disclosure.
- Quote request: three steps with per-step validation, retained values and explicit recipient consent.
- Brand and color settings in `lib/site-config.ts`; public company data in `lib/company-directory.ts`.

## Deliberate adaptations
This was an improvement of the existing commercial marketplace, not a replacement build. Existing real directory entries, the 12-unit quote minimum, supplier accounts, private storage and buyer-selected recipients remain. Clutch gets disclosed commercial featured placement, not a fabricated merit score. Unknown capacity remains visible, while any documented maximum limits can filter oversized projects. Unknown coordinates and service territories are not drawn as confirmed coverage. Public directory entries are not automatically made RFQ recipients.

The brief's fake-only shop data, automatic Clutch lead routing, Astro migration, account removal and new CMS were not applied because they conflict with or replace established product decisions. No quote email, service areas, capacity figures, verified reviews or manufacturing claims were invented. Production search indexing remains disabled until the business data and deployment are ready. No Lighthouse score or Impeccable command result is claimed. The `/impeccable` command is unavailable in this environment.

## Operate and extend
Run and deployment instructions remain in README.md and docs/DEPLOYMENT.md. Change name/region/colors in `lib/site-config.ts`; add public companies to `lib/company-directory.ts` with sources, nullable coordinates and only supported claims. Supplier-provided marketplace records continue through registration and admin review. No remote deployment, GitHub push or email delivery was performed.
