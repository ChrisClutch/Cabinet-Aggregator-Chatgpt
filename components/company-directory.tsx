"use client";
import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { siteConfig } from "@/lib/site-config";
import { companies, projectCompanies } from "@/lib/company-directory";

export default function CompanyDirectory({
  initialUnits = 48,
}: {
  initialUnits?: number;
}) {
  const [units, setUnits] = useState(initialUnits);
  const [specialty, setSpecialty] = useState("All specialties");
  const listRef = useRef<HTMLDivElement>(null);
  const positions = useRef<Record<string, number>>({});
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All regions");
  const [selected, setSelected] = useState(companies[0].id);
  const [nearby, setNearby] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");
    const count = Number(params.get("units"));
    if (count >= 1 && count <= 200) setUnits(count);
  }, []);
  const filtered = projectCompanies(
    companies.filter(
      (c) =>
        (specialty === "All specialties" || Boolean(c.commercialEvidence)) &&
        (region === "All regions" || region === c.region) &&
        `${c.name} ${c.city} ${c.state} ${c.description}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    ),
    units,
  );
  useLayoutEffect(() => {
    const next: Record<string, number> = {};
    listRef.current
      ?.querySelectorAll<HTMLElement>("[data-company]")
      .forEach((el) => {
        const id = el.dataset.company!;
        const top = el.offsetTop;
        next[id] = top;
        const old = positions.current[id];
        if (
          old !== undefined &&
          old !== top &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          el.animate(
            [
              { transform: `translateY(${old - top}px)` },
              { transform: "translateY(0)" },
            ],
            { duration: 260, easing: "ease-out" },
          );
      });
    positions.current = next;
  }, [units, query, region, specialty]);
  const active = filtered.find((c) => c.id === selected) || filtered[0];
  const located =
    active && active.lat !== null && active.lon !== null
      ? (active as typeof active & { lat: number; lon: number })
      : null;
  const bbox =
    located && nearby
      ? `${located.lon - 0.35},${located.lat - 0.22},${located.lon + 0.35},${located.lat + 0.22}`
      : "-125,24,-66,50";
  const mapUrl = located
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${located.lat}%2C${located.lon}`
    : "";
  return (
    <section
      className="section company-directory"
      id="company-directory"
      aria-labelledby="directory-heading"
    >
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            SEC. A / {siteConfig.region.toUpperCase()} DIRECTORY
          </div>
          <h2 id="directory-heading">
            Find a shop.
            <br />
            Read the details.
          </h2>
        </div>
        <p>
          Explore cabinet businesses by name and location.
          <br />
          Select a company to see its city on the map.
        </p>
      </div>
      <div className="project-scale">
        <div>
          <label htmlFor="project-scale">HOW BIG IS YOUR PROJECT?</label>
          <output htmlFor="project-scale">
            {units === 200 ? "200+" : units}{" "}
            <span>{units === 1 ? "kitchen" : "units"}</span>
          </output>
        </div>
        <div className="project-range">
          <input
            id="project-scale"
            type="range"
            min="1"
            max="200"
            value={units}
            aria-valuetext={`${units === 200 ? "200 or more" : units} ${units === 1 ? "kitchen" : "units"}`}
            onChange={(e) => setUnits(Number(e.target.value))}
          />
          <div>
            <span>1 KITCHEN</span>
            <span>200+ UNITS</span>
          </div>
          <p>
            {units < 12
              ? "Residential research · alphabetical listings. Contact shops directly for projects below 12 units."
              : "Commercial research · operator featured first, then alphabetical. Capacity still needs confirmation."}
          </p>
        </div>
      </div>
      <div className="company-toolbar">
        <label>
          Company or location
          <input
            type="search"
            placeholder="Search companies, cities or specialties"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          Company location
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option>All regions</option>
            <option>West</option>
            <option>South</option>
          </select>
        </label>
        <label>
          Specialty
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          >
            <option>All specialties</option>
            <option>Documented commercial experience</option>
          </select>
        </label>
        <span role="status">
          {filtered.length} {filtered.length === 1 ? "company" : "companies"}
        </span>
      </div>
      <p className="fine">
        Public sources checked November 1, 2026; operator information is
        founder-provided. Unknown capacity remains visible at every project
        size. Listings do not imply membership or endorsement. Confirm
        commercial capacity, pricing and delivery territory with each company.
      </p>
      <div className="company-layout">
        <div className="company-list" ref={listRef}>
          {filtered.map((c) => (
            <article
              data-company={c.id}
              key={c.id}
              className={
                "company-row " + (active?.id === c.id ? "is-selected" : "")
              }
            >
              <div className="company-monogram" aria-hidden="true">
                {c.name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")}
              </div>
              <div>
                <small className={c.operator ? "operator-tag" : ""}>
                  {c.operator
                    ? "OPERATOR / FEATURED"
                    : "PUBLIC DIRECTORY LISTING"}
                </small>
                <h3>
                  <a href={`/shops/${c.id}`}>{c.name}</a>
                </h3>
                <p className="company-location">
                  {c.city}, {c.state}
                </p>
                <p>{c.description}</p>
                <details className="spec-disclosure">
                  <summary>
                    Open production spec sheet <span>+</span>
                  </summary>
                  <dl className="shop-specs">
                    <div>
                      <dt>Units / month</dt>
                      <dd>{c.unitsPerMonth ?? "Not confirmed"}</dd>
                    </div>
                    <div>
                      <dt>CNC / automation</dt>
                      <dd>
                        {c.automatedProduction === undefined
                          ? "Not confirmed"
                          : c.automatedProduction
                            ? "Reported"
                            : "Not reported"}
                      </dd>
                    </div>
                    <div>
                      <dt>Max. project size</dt>
                      <dd>{c.maxProjectUnits ?? "Not confirmed"}</dd>
                    </div>
                    <div>
                      <dt>Lead time</dt>
                      <dd>
                        {c.leadWeeks
                          ? `${c.leadWeeks} weeks`
                          : "Ask for current schedule"}
                      </dd>
                    </div>
                    <div>
                      <dt>Commercial experience</dt>
                      <dd>
                        {c.commercialEvidence || "Request project references"}
                      </dd>
                    </div>
                  </dl>
                </details>
                <div className="company-actions">
                  <button
                    type="button"
                    aria-pressed={active?.id === c.id}
                    onClick={() => setSelected(c.id)}
                  >
                    Show on map ↗
                  </button>
                  <a href={c.source} target="_blank" rel="noopener noreferrer">
                    Company website & source ↗
                  </a>
                  {c.capabilities && (
                    <a
                      href={c.capabilities}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Project specialties ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
          {!filtered.length && (
            <div className="company-empty">
              <h3>No companies match yet.</h3>
              <p>Try a company name or state, or clear your filters.</p>
              <button
                className="button"
                onClick={() => {
                  setQuery("");
                  setRegion("All regions");
                  setSpecialty("All specialties");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        <aside className="company-map" aria-label="Company location map">
          {active ? (
            <>
              <div className="map-heading">
                <div>
                  <small>SELECTED COMPANY</small>
                  <h3>{active.name}</h3>
                  <p>
                    {active.city}, {active.state}
                  </p>
                </div>
                <button
                  disabled={!located}
                  type="button"
                  onClick={() => setNearby(!nearby)}
                >
                  {nearby ? "View U.S." : "Zoom to city"}
                </button>
              </div>
              {located ? (
                <iframe
                  title={`Map showing ${active.name} in ${active.city}, ${active.state}`}
                  src={mapUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="map-unconfirmed">
                  <span>LOCATION RECORD / PENDING</span>
                  <h3>Oregon</h3>
                  <p>
                    An exact company location and service area have not been
                    confirmed. No facility pin is shown.
                  </p>
                  <a
                    href={active.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Confirm with the company ↗
                  </a>
                </div>
              )}
              <p className="fine">
                Approximate city location, not a delivery area or exact facility
                address. Map © OpenStreetMap contributors.
              </p>
              {located && (
                <a
                  href={`https://www.openstreetmap.org/?mlat=${active.lat}&mlon=${active.lon}#map=10/${active.lat}/${active.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open larger map ↗
                </a>
              )}
            </>
          ) : (
            <p>Select a matching company to see its location.</p>
          )}
        </aside>
      </div>
      <div className="directory-footer">
        <span>
          Run a cabinet business? Add your capabilities and project
          requirements.
        </span>
        <a className="button secondary" href="/supplier">
          List your company ↗
        </a>
      </div>
    </section>
  );
}
