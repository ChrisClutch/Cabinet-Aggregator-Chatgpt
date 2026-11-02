# GitHub and Cloudflare preparation

Source repository: https://github.com/ChrisClutch/Cabinet-Aggregator-Chatgpt. The user created this public repository. Cloudflare resources have not been provisioned and the website is not deployed. This source builds a Cloudflare Worker with D1/R2 bindings. The current domain is proposed, not registered or verified.

## Credentials and approvals needed

1. Repository upload authorized by the owner. Exclude `.dev.vars`, `.wrangler/state`, uploaded plans, local test records and access credentials from every commit.
2. Cloudflare account and explicit approval to provision Workers, D1 and R2. Free allowances do not guarantee zero charges; approve a budget and limits before provisioning.
3. Domain ownership/DNS access for the approved final domain. No domain purchase has been attempted.
4. Approved production authentication and email delivery services, sender-domain DNS verification, and protected secrets. Do not carry the local `admin@local` bootstrap account or password into production.
5. Approval of the live supplier inventory, founder affiliation disclosures, privacy/retention terms and any future fee model.

## Release sequence

- Pin and audit dependencies, review Vinext beta suitability, run the checks and resolve the production gaps listed in ARCHITECTURE.md.
- Use the existing GitHub repository; commit only source and migrations. Configure CI to typecheck, test and build before production.
- Provision D1 and R2 with least-privilege credentials. Supply real database/bucket IDs in the deployment configuration; the all-zero database ID in local generated config is a development placeholder.
- Apply reviewed schema migrations to staging. Never upload `.wrangler/state` or the demo/test database.
- Configure verified supplier accounts, production identity and invitation/password recovery flows, document quarantine/scanning, transactional email and monitoring.
- Test buyer-selected recipient permissions and document access in staging, including unrelated supplier denial, session expiry and CSRF protections.
- Replace illustrative suppliers with verified/consented listings. Keep demo pages noindex. Review real profile structured data before adding it; never add fabricated ratings.
- Set canonical host, enable public-page indexing deliberately, keep private pages noindex, publish sitemap and connect Search Console after domain verification.
- Obtain final deployment approval, then deploy the tested artifact. Add rollback, backup/restore and deletion runbooks.

The included `.openai/hosting.json` provides logical DB/BUCKET bindings for the source scaffold. It contains no hosted Site identity; there is no Sites registration or public deployment. For direct Cloudflare deployment, retain the compiled Worker/assets configuration but replace local resource identifiers and bootstrap authentication before running any remote command.


## Cloudflare Workers Builds settings

- Build command: `npm run build`
- Deploy command: `npm run deploy`
- Node version: 24
- Keep the committed lockfile and pinned Wrangler. Do not use a bare `npx wrangler deploy`, which can trigger automatic framework setup because this Vite project generates its config under `dist/server`.

Build variables (not runtime secrets):
- `CF_D1_DATABASE_ID`: UUID of the existing production/staging D1 database.
- `CF_R2_BUCKET_NAME`: name of the existing R2 bucket.
- `CF_WORKER_NAME`: exact Worker name in the dashboard; defaults to `cabinet-aggregator-chatgpt`.
- `CF_D1_DATABASE_NAME`: optional database name.

The deploy script validates resource inputs, preserves the generated module/assets paths, and invokes the locally installed Wrangler. It does not provision resources or apply migrations. Apply `drizzle/0000_cloudy_vertigo.sql` to the intended remote D1 database before serving traffic. Configure the `ADMIN_PASSWORD` runtime secret separately; never put it in source or reuse the local preview password. Keep the production readiness requirements above in effect.

The initial deployment log showed an attempted Wrangler 4.156.1 upgrade conflicting with workers-types 4.20260515.1. Explicit deployment avoids that automatic dependency rewrite; do not suppress dependency errors with `--force` or `--legacy-peer-deps`.
