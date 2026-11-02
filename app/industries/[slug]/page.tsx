import Link from "@/components/link";
import { notFound } from "next/navigation";
import { sectors } from "@/lib/catalog";
export function generateStaticParams() {
  return sectors.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = sectors.find((s) => s.slug === slug);
  return {
    title: s ? `${s.name} cabinet suppliers` : "Industry not found",
    description: s?.description,
    alternates: { canonical: "/industries/" + slug },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = sectors.find((s) => s.slug === slug);
  if (!s) notFound();
  return (
    <>
      <section className="sector-hero">
        <div>
          <Link href="/industries">← All industries</Link>
          <div className="eyebrow">{s.name.toUpperCase()}</div>
          <h1>{s.headline}</h1>
          <p>{s.description}</p>
          <Link className="button" href={"/quote?sector=" + s.slug}>
            {s.cta} ↗
          </Link>
        </div>
        <img
          src={s.image}
          alt={`Illustrative cabinetry inspiration for ${s.name.toLowerCase()}`}
        />
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">GET THE SCOPE RIGHT</div>
            <h2>
              Your {s.name.toLowerCase()}
              <br />
              procurement checklist.
            </h2>
          </div>
          <p>
            Give each supplier the same assumptions.
            <br />
            Make differences in their quotes visible.
          </p>
        </div>
        <div className="steps">
          {s.checklist.map((item, i) => (
            <article key={item}>
              <small>0{i + 1} / INCLUDE IN YOUR REQUEST</small>
              <h3>{item}</h3>
              <p>
                Identify the responsible project contact, attach the relevant
                schedule and ask suppliers to list any exclusions or assumptions
                against this requirement.
              </p>
            </article>
          ))}
        </div>
        <div className="panel">
          <h2>Compare more than a unit price.</h2>
          <p>
            For {s.name.toLowerCase()}, begin with{" "}
            {s.checklist[0].toLowerCase()}. Require a written breakdown of
            materials, freight, installation and alternates. Review{" "}
            {s.checklist[1].toLowerCase()} before accepting a lead-time
            commitment, and include {s.checklist[2].toLowerCase()} in the
            release plan.
          </p>
          <p>
            Confirm applicable standards and accessibility details with your
            project’s design team. A marketplace category does not certify
            compliance.
          </p>
          <Link
            className="button"
            href={"/suppliers?experience=" + encodeURIComponent(s.experience)}
          >
            Explore relevant supplier experience →
          </Link>{" "}
          <Link href="/estimator">Build a preliminary budget ↗</Link>
        </div>
        <h2>Bring a clear package to the conversation.</h2>
        <p>
          Upload a PDF with your cabinet schedule, elevations and project
          requirements. Select the suppliers you want to hear from; no supplier
          receives the request by default.
        </p>
        <Link className="text-link" href={"/quote?sector=" + s.slug}>
          Start your {s.name.toLowerCase()} brief ↗
        </Link>
        <p className="fine">
          Photography is illustrative. Sector guidance is procurement planning
          support, not certification or project-specific design advice.
        </p>
      </section>
    </>
  );
}
