import { companies } from "@/lib/company-directory";
import { notFound } from "next/navigation";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = companies.find((c) => c.id === id);
  return { title: c?.name || "Company not found", description: c?.description };
}
export default async function Shop({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = companies.find((c) => c.id === id);
  if (!c) notFound();
  return (
    <section className="section narrow editorial">
      <a href="/suppliers">← Company directory</a>
      <div className="eyebrow">
        {c.operator ? "OPERATOR / FEATURED LISTING" : "PUBLIC COMPANY RECORD"}
      </div>
      <h1>{c.name}</h1>
      <p className="lead">
        {c.city}, {c.state}
      </p>
      <p>{c.description}</p>
      <div className="panel">
        <h2>Production specification</h2>
        <dl className="shop-specs">
          <div>
            <dt>Units per month</dt>
            <dd>{c.unitsPerMonth ?? "Not confirmed"}</dd>
          </div>
          <div>
            <dt>CNC / automated production</dt>
            <dd>
              {c.automatedProduction === undefined
                ? "Not confirmed"
                : c.automatedProduction
                  ? "Reported"
                  : "Not reported"}
            </dd>
          </div>
          <div>
            <dt>Maximum project size</dt>
            <dd>{c.maxProjectUnits ?? "Not confirmed"}</dd>
          </div>
          <div>
            <dt>Typical lead time</dt>
            <dd>
              {c.leadWeeks
                ? `${c.leadWeeks} weeks`
                : "Request current schedule"}
            </dd>
          </div>
          <div>
            <dt>Commercial experience</dt>
            <dd>{c.commercialEvidence || "Confirm project references"}</dd>
          </div>
        </dl>
      </div>
      <p>
        Confirm service territory, specifications, prices and availability
        directly. A public listing does not establish a marketplace partnership.
      </p>
      <a
        className="button"
        href={c.source}
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit company website & source ↗
      </a>
      {c.capabilities && (
        <p>
          <a href={c.capabilities}>Source for project specialties ↗</a>
        </p>
      )}
      <p>
        Is this your shop?{" "}
        <a href="/supplier">
          Request an update through supplier registration →
        </a>
      </p>
    </section>
  );
}
