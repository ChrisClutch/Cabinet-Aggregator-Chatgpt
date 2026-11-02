# Cabinet-Aggregator-Chatgpt

Chat GPT built "Build Commercial Cabinets B2B". Nov 1 2026

Commercial Cabinets Marketplace — ChatGPT

Local TypeScript full-stack MVP for cabinet procurement on projects of 12+ units. Not production-ready; never use real confidential plans in the development preview.

## Run

Requires Node 24 (Node 22.13+ supported by scaffold), npm and a local installation of dependencies.

```sh
npm ci
node scripts/setup-local.mjs
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_cloudy_vertigo.sql
npm run start
```

Replace `0000_cloudy_vertigo.sql` with the actual generated migration filename in `drizzle/`. Apply each migration once, in order. Build before applying migrations so the local Wrangler configuration exists. `npm run start` serves the built application with local D1/R2. `npm run dev` is available for HMR. Keep `.wrangler/state` to retain local records.

Create `.dev.vars` with a random strong `ADMIN_PASSWORD` before starting. Admin email is `admin@local`. The supplied local preview credential is in `outputs/LOCAL_ACCESS.md`, excluded from source control. Supplier accounts are created through `/supplier` and require admin approval for public listing. Never use a known default password in production.

## Check

```sh
npx tsc --noEmit
npm run build
node --experimental-strip-types --test tests/calculator.test.ts
node tests/integration.mjs
```

Integration checks use `BASE_URL` (default `http://127.0.0.1:8787`) and the local `.dev.vars` admin secret. They create clearly labeled local test accounts and requests, including private test PDFs. Do not point these checks at production.

## Core routes

`/`, `/suppliers`, `/suppliers/:id`, `/compare`, `/industries`, `/industries/:slug`, `/estimator`, `/quote`, `/supplier`, `/admin`, `/how-it-works`, `/privacy`.

## Deployment

See `docs/DEPLOYMENT.md`, `docs/ARCHITECTURE.md`, `docs/RESEARCH.md` and `docs/TEST_REPORT.md`. Source repository: https://github.com/ChrisClutch/Cabinet-Aggregator-Chatgpt. Cloudflare is not deployed and no domain has been purchased. Local `.dev.vars`, `.wrangler`, generated builds, work files and access credentials are ignored by Git.

## Directory design and content

The millwork visual direction follows the supplied PROJECT-BRIEF.md, adapted to the existing commercial marketplace. See `docs/BRIEF-IMPLEMENTATION.md` for decisions and limitations.

- Edit brand name, region, quote-email placeholder and palette in `lib/site-config.ts`.
- Add public businesses in `lib/company-directory.ts`. Link authoritative sources; leave capacity and coordinates unknown unless supported. These entries are intentionally not RFQ recipients.
- `/commercial` explains disclosed operator placement. `/about` describes ownership. `/shops/:id` shows a public company record.
- Marketplace profile administration remains in `/admin`; public research records are code-maintained, with no external CMS configured.
- Cloudflare deployment remains the existing Workers/D1/R2 architecture. Migrating this application to static Pages would require reworking private account, file and quote handling; do not simply upload the client directory.
