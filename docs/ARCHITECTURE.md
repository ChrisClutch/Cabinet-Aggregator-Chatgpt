# Commercial Cabinets Marketplace — local MVP

## Product decisions

Buyer-controlled supplier selection, transparent featured placement, comparable project scopes and unknown capability fields follow the research in RESEARCH.md. Clutch is founder affiliated and featured, with no inferred origin, certifications, minimum order or lead time. Other seeded profiles are explicitly fictional. No synthetic reviews, supplier prices or claims of verified projects are used.

## Architecture

- React 19, TypeScript and Vinext (Next.js App Router-compatible, currently a beta framework) with Cloudflare Workers build output. Framework maturity is a production consideration; pin and review dependencies before launch.
- Public routes: homepage, supplier directory/detail, comparison, 12 industry guides, editable estimator, supplier application and quote intake.
- Protected API routes: cookie-authenticated supplier workspace and administrator dashboard; all authorization enforced on the server, not just hidden UI.
- D1 SQL: supplier profiles and approval state, hashed passwords, session-token hashes, quotes, recipient grants, attachment metadata, responses, estimator defaults and event counts.
- R2: private PDFs stored under random keys. Downloads require an authenticated administrator or an explicitly selected supplier.
- Local persistence: `.wrangler/state`; no cloud service is provisioned or billed.
- Public seed data has no contact details. Authenticated supplier account email stays outside its public profile.
- Quote recipients are explicit and deduplicated. Clutch has no automatic entitlement. Demo listings cannot receive external messages. No email provider is integrated.

## Authentication and files

Passwords use PBKDF2-SHA256 with a unique salt and 100,000 iterations (local MVP choice; benchmark/harden for production). Session tokens are random, hashed at rest and expire in eight hours; cookies are HttpOnly, SameSite=Strict and Secure on HTTPS. Writes require a matching Origin. Local rate limits cover login, registration, events and quotes. Administrator bootstrap secret lives only in ignored `.dev.vars`.

Uploads accept one PDF up to 10 MB, require a PDF MIME type, extension and signature, use random storage keys, and download as attachments. Content inspection and malware scanning are not implemented. Use test plans only until a quarantine/scanning workflow, operational retention policy and production security review are complete. Failed SQL writes delete an uploaded object. Private endpoints use no-store responses.

## Monetization extension points

Featured placement already has a server-controlled flag and clear disclosure. Later add plans/entitlements, subscriptions, lead qualification records, consent snapshots, billing ledger, sponsorship campaigns, referral attribution and commissions in separate tables. Keep ranking, verification and billing separate. Implement refunds/duplicate-lead rules before collecting lead fees. Never infer an award from an RFQ or charge merely for a demo action. No payment processor is integrated.

## SEO and acquisition

Industry content and headings render on the server. Each industry has a distinct procurement introduction, checklist, next steps, title, description and canonical URL. Sitemap includes public discovery routes. This local demonstration deliberately sends noindex metadata and disallows crawling; do not enable indexing until domain ownership, real inventory and editorial review are complete. Private/admin and demo supplier pages must remain excluded after launch. Keyword phrases in the research are hypotheses, not measured traffic estimates.

## Production work still required

Production identity (email verification, reset, MFA for admins, admin account management), signed onboarding for Clutch, supplier evidence verification, document scanning, notification delivery, abuse controls, audit/retention/deletion workflows, monitoring, accessibility review and load testing. Traffic counts are local events including tests, not unique visitor analytics. Award conversion is administrator-recorded, not payment-verified. No buyer account or quote inbox is implemented; an administrator coordinates responses in this version.
