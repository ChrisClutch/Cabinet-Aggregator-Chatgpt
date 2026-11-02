import CompanyDirectory from "@/components/company-directory";
export const metadata = {
  title: "Commercial & high-volume cabinet sourcing",
  description:
    "Research cabinet suppliers for multifamily, hospitality, senior living and phased commercial projects.",
};
export default function Commercial() {
  return (
    <>
      <section className="section commercial-intro">
        <div className="eyebrow">SEC. A / COMMERCIAL & HIGH-VOLUME</div>
        <h1>
          One specification.
          <br />
          <em>Many front doors.</em>
        </h1>
        <p>
          For developers, general contractors and property teams planning
          repeatable kitchens, coordinated deliveries and long-term service.
        </p>
        <div className="commercial-usecases">
          Multifamily / Hospitality / Senior living / Tenant improvements
        </div>
        <a className="button" href="/quote">
          Build a project brief ↗
        </a>
        <div className="ranking-note">
          <h2>How shops are presented</h2>
          <p>
            Clutch Cabinets NW appears first as the disclosed directory
            operator. Remaining companies are alphabetical. This is featured
            placement, not a performance ranking.
          </p>
          <p>
            A defensible capacity ranking needs documented units per month,
            automated production, commercial experience, maximum project size
            and current lead time. Those fields are shown on each specification
            sheet. Unknown values do not count as evidence of suitability;
            confirm them before shortlisting. No company is currently certified
            here as meeting your project size.
          </p>
        </div>
      </section>
      <CompanyDirectory initialUnits={100} />
    </>
  );
}
