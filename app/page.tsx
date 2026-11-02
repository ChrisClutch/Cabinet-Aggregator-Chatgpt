import Link from "@/components/link";
import { photos, sectors, apartmentHero } from "@/lib/catalog";
import CompanyDirectory from "@/components/company-directory";
import PriceExamples from "@/components/price-examples";
import HeroMotion from "@/components/hero-motion";
import { allSuppliers } from "@/lib/server";
export const dynamic = "force-dynamic";
export default async function Home() {
  const suppliers = await allSuppliers();
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="dot" /> FIELD GUIDE / CABINET MAKERS & SUPPLIERS
          </div>
          <h1>
            Good buildings.
            <br />
            Start with <em>good cabinets.</em>
          </h1>
          <p className="hero-sub">
            Find the shop behind your next project.
            <br />
            Compare companies, inspect the details, and work out the numbers.
          </p>
          <Link className="hero-price" href="#cabinet-costs">
            <span>EXAMPLE KITCHEN CABINET MATERIALS</span>
            <strong>
              $2,520 <small>/ apartment</small>
            </strong>
            <span>
              14 cabinets × $180 assumed each · Illustrative, not a quote
            </span>
            <b>See all cost examples ↓</b>
          </Link>
          <form className="hero-search" action="/suppliers">
            <span>⌕</span>
            <input
              aria-label="Search cabinet suppliers"
              name="q"
              placeholder="Try multifamily, plywood, or a supplier"
            />
            <button className="button" type="submit">
              Find suppliers ↗
            </button>
          </form>
          <div className="hero-links">
            <Link href="/quote">
              Get project quotes <span>↗</span>
            </Link>
            <Link href="/compare">
              Compare manufacturers <span>→</span>
            </Link>
          </div>
          <div className="hero-proof">
            <span>✓ Buyer-selected suppliers</span>
            <span>✓ No sourcing fees in this MVP</span>
          </div>
        </div>
        <HeroMotion />
      </section>
      <section className="sector-strip">
        <span>PURPOSE-BUILT FOR</span>
        <Link href="/industries/multifamily">Multifamily</Link>
        <Link href="/industries/build-to-rent">Build-to-rent</Link>
        <Link href="/industries/senior-living">Senior living</Link>
        <Link href="/industries/hospitality">Hospitality</Link>
        <Link href="/industries/student-housing">Student housing</Link>
      </section>
      <div className="project-entry section">
        <span>CHOOSE YOUR STARTING POINT</span>
        <a href="/suppliers?units=1">
          01 / Single kitchen <b>Residential research ↗</b>
        </a>
        <a href="/suppliers?units=12">
          02 / Small development <b>Light commercial ↗</b>
        </a>
        <a href="/commercial">
          03 / Repeatable production <b>Commercial & volume ↗</b>
        </a>
      </div>
      <CompanyDirectory />
      <PriceExamples />
      <section className="section pale">
        <div className="section-heading">
          <div>
            <div className="eyebrow">SEC. C / THE DIRECTORY OPERATOR</div>
            <h2>Meet our founding supplier.</h2>
          </div>
          <Link className="text-link" href="/suppliers">
            Browse all suppliers ↗
          </Link>
        </div>
        <div className="supplier-grid">
          {suppliers
            .filter((s) => !s.demo)
            .slice(0, 3)
            .map((s) => (
              <article className="supplier-card" key={s.id}>
                <div
                  className="card-image"
                  style={{ backgroundImage: `url(${apartmentHero})` }}
                >
                  <span className={"badge " + (s.featured ? "gold" : "")}>
                    {s.featured
                      ? "OPERATOR / FEATURED"
                      : s.demo
                        ? "DEMONSTRATION PROFILE"
                        : "SUPPLIER-PROVIDED PROFILE"}
                  </span>
                </div>
                <div className="card-body">
                  <small>
                    {s.location.toUpperCase()} ·{" "}
                    {s.demo
                      ? "ILLUSTRATIVE CAPABILITIES"
                      : s.id === "clutch"
                        ? "FOUNDER-PROVIDED LISTING"
                        : "SUPPLIER-PROVIDED LISTING"}
                  </small>
                  <h3>
                    <Link href={"/suppliers/" + s.id}>{s.name}</Link>
                  </h3>
                  <p>{s.description}</p>
                  <div className="tags">
                    <span>
                      {s.demo ? s.construction : "Wholesale cabinets"}
                    </span>
                    <span>{s.demo ? s.material : "Confirm project fit"}</span>
                  </div>
                  <Link className="card-link" href={"/suppliers/" + s.id}>
                    View supplier <span>↗</span>
                  </Link>
                </div>
              </article>
            ))}
        </div>
        <p className="fine">
          Featured placement is disclosed and does not imply verification.
          Clutch Cabinets NW is affiliated with the marketplace founder.
          Photography is illustrative, not supplier project evidence.
        </p>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">BUILT AROUND YOUR INDUSTRY</div>
            <h2>
              Different buildings.
              <br />
              Different sourcing needs.
            </h2>
          </div>
          <Link className="text-link" href="/industries">
            Explore all 12 industries ↗
          </Link>
        </div>
        <div className="industry-grid">
          {[sectors[0], sectors[5], sectors[7], sectors[9]].map((s, i) => (
            <Link
              className="industry-tile"
              href={"/industries/" + s.slug}
              key={s.slug}
              style={{
                backgroundImage: `linear-gradient(transparent,rgba(0,0,0,.75)),url(${i === 0 ? apartmentHero : photos[i]})`,
              }}
            >
              <small>0{i + 1} / PROJECT SPECIALTIES</small>
              <h3>
                {s.name} <span>↗</span>
              </h3>
            </Link>
          ))}
        </div>
      </section>
      <section className="estimator-banner">
        <div>
          <div className="eyebrow">EARLY NUMBERS. BETTER DECISIONS.</div>
          <h2>
            A clearer cabinet budget,
            <br />
            before the first quote.
          </h2>
          <p>
            Model materials, freight and installation with assumptions
            <br />
            you can see and change. No invented supplier pricing.
          </p>
          <Link className="button light" href="/estimator">
            Estimate your project ↗
          </Link>
        </div>
        <div className="budget-sample">
          <span>YOUR NEXT PROJECT</span>
          <div className="sample-row">
            Unit count <strong>48 units</strong>
          </div>
          <div className="sample-row">
            Scope <strong>Kitchens + vanities</strong>
          </div>
          <div className="sample-row">
            Budget basis <strong>You set the assumptions</strong>
          </div>
          <small>
            A planning tool. Your suppliers provide the actual quotes.
          </small>
        </div>
      </section>
    </>
  );
}
