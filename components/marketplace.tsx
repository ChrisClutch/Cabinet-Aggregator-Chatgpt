"use client";
import { useEffect, useState } from "react";
import Link from "@/components/link";
import {
  type Supplier,
  seed,
  sectors,
  defaults,
  estimate,
  priceExamples,
} from "@/lib/catalog";
type ApiResult = {
  error?: string;
  suppliers: Supplier[];
  assumptions: typeof defaults;
  message: string;
  id: string;
};
const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
async function api(path: string, data?: unknown) {
  const r = await fetch(
    "/api/" + path,
    data === undefined
      ? {}
      : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
  );
  const d = (await r.json()) as ApiResult;
  if (!r.ok) throw Error(d.error || "Unable to complete request");
  return d;
}
function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="notice" role="status">
      {children}
    </p>
  );
}
function Field({
  label,
  name,
  defaultValue,
  required = true,
  type = "text",
  min,
  max,
  children,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  required?: boolean;
  type?: string;
  min?: number;
  max?: number;
  children?: React.ReactNode;
}) {
  return (
    <label className="field">
      {label}
      {children ? (
        <select name={name} defaultValue={defaultValue} required={required}>
          {children}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          required={required}
          min={min}
          max={max}
          maxLength={type === "password" ? 128 : 250}
        />
      )}
    </label>
  );
}
function useCatalog() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api("catalog")
      .then((d) => setSuppliers(d.suppliers))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  return { suppliers, error, loading };
}
function useSelection() {
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => {
    try {
      setSelected(JSON.parse(localStorage.getItem("ccm-shortlist") || "[]"));
    } catch {}
  }, []);
  function toggle(id: string) {
    setSelected((old) => {
      const next = old.includes(id)
        ? old.filter((x) => x !== id)
        : old.length < 4
          ? [...old, id]
          : old;
      localStorage.setItem("ccm-shortlist", JSON.stringify(next));
      return next;
    });
  }
  return { selected, toggle };
}
function Card({
  s,
  selected,
  toggle,
}: {
  s: Supplier;
  selected: string[];
  toggle: (id: string) => void;
}) {
  return (
    <article className="supplier-card">
      <div
        className="card-image"
        style={{ backgroundImage: `url(${s.image})` }}
      >
        <span className={"badge " + (s.featured ? "gold" : "")}>
          {s.featured
            ? "FEATURED PLACEMENT"
            : s.demo
              ? "DEMONSTRATION PROFILE"
              : "SUPPLIER-PROVIDED PROFILE"}
        </span>
      </div>
      <div className="card-body">
        <small>
          {s.location} ·{" "}
          {s.demo
            ? "Illustrative data"
            : "Capabilities not independently verified"}
        </small>
        <h3>
          <Link href={"/suppliers/" + s.id}>{s.name}</Link>
        </h3>
        <p>{s.description}</p>
        <div className="tags">
          <span>{s.material}</span>
          <span>{s.construction}</span>
        </div>
        <dl className="card-facts">
          <div>
            <dt>Lead time</dt>
            <dd>{s.lead ? s.lead + " weeks" : "Confirm directly"}</dd>
          </div>
          <div>
            <dt>Minimum</dt>
            <dd>{s.min ? s.min + " units" : "Confirm directly"}</dd>
          </div>
        </dl>
        <div className="card-actions">
          <label>
            <input
              type="checkbox"
              checked={selected.includes(s.id)}
              disabled={selected.length >= 4 && !selected.includes(s.id)}
              onChange={() => toggle(s.id)}
            />{" "}
            Compare
          </label>
          <Link href={"/quote?supplier=" + s.id}>Request quote ↗</Link>
        </div>
      </div>
    </article>
  );
}
export function Directory() {
  const { suppliers, error, loading } = useCatalog();
  const { selected, toggle } = useSelection();
  const [filters, setFilters] = useState<Record<string, string>>({});
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setFilters({ q: p.get("q") || "", experience: p.get("experience") || "" });
    api("event", { kind: "Directory viewed" }).catch(() => {});
  }, []);
  const set = (k: string, v: string) => setFilters((f) => ({ ...f, [k]: v }));
  const filtered = suppliers.filter((s) => {
    const q = (filters.q || "").toLowerCase();
    if (
      q &&
      !`${s.name} ${s.description} ${s.material} ${s.experience} ${s.location}`
        .toLowerCase()
        .includes(q)
    )
      return false;
    for (const k of [
      "location",
      "material",
      "construction",
      "price",
      "origin",
      "installation",
      "certification",
      "experience",
    ])
      if (filters[k] && s[k as keyof Supplier] !== filters[k]) return false;
    if (
      filters.units &&
      (!s.min ||
        !s.max ||
        Number(filters.units) < s.min ||
        Number(filters.units) > s.max)
    )
      return false;
    if (filters.lead && (!s.lead || s.lead > Number(filters.lead)))
      return false;
    if (filters.min && (!s.min || s.min > Number(filters.min))) return false;
    return true;
  });
  return (
    <>
      <div className="page-intro">
        <div className="eyebrow">FIND YOUR NEXT PARTNER</div>
        <h1>Marketplace profiles.</h1>
        <p>Compare capabilities. Ask better questions. Build your shortlist.</p>
      </div>
      <div className="directory-layout">
        <aside className="filters">
          <div className="filter-heading">
            <h3>Refine your search</h3>
            <button className="link-button" onClick={() => setFilters({})}>
              Reset
            </button>
          </div>
          <label className="field">
            Search
            <input
              placeholder="Supplier, material, project…"
              value={filters.q || ""}
              onChange={(e) => set("q", e.target.value)}
            />
          </label>
          {[
            "location",
            "material",
            "construction",
            "price",
            "origin",
            "installation",
            "certification",
            "experience",
          ].map((k) => (
            <label className="field" key={k}>
              {(
                {
                  price: "Price category",
                  origin: "Manufacturing origin",
                  experience: "Project experience",
                  installation: "Installation capability",
                  certification: "Certifications",
                  construction: "Construction type",
                } as Record<string, string>
              )[k] || k[0].toUpperCase() + k.slice(1)}
              <select
                value={filters[k] || ""}
                onChange={(e) => set(k, e.target.value)}
              >
                <option value="">Any {k}</option>
                {[
                  ...new Set(
                    suppliers.map((s) => String(s[k as keyof Supplier])),
                  ),
                ]
                  .sort()
                  .map((v) => (
                    <option key={v}>{v}</option>
                  ))}
              </select>
            </label>
          ))}
          <label className="field">
            Your project size (units)
            <input
              type="number"
              min="12"
              value={filters.units || ""}
              onChange={(e) => set("units", e.target.value)}
            />
          </label>
          <label className="field">
            Maximum lead time (weeks)
            <input
              type="number"
              min="1"
              value={filters.lead || ""}
              onChange={(e) => set("lead", e.target.value)}
            />
          </label>
          <label className="field">
            Maximum minimum order (units)
            <input
              type="number"
              min="1"
              value={filters.min || ""}
              onChange={(e) => set("min", e.target.value)}
            />
          </label>
          <p className="fine">
            Unknown capabilities are excluded when a related filter is applied.
            Demonstration values are not supplier claims.
          </p>
        </aside>
        <div>
          <div className="result-bar">
            <span>
              {loading ? "Loading suppliers…" : `${filtered.length} suppliers`}{" "}
              <small>· Featured placements first</small>
            </span>
            <Link href="/compare">Compare ({selected.length}/4) →</Link>
          </div>
          {error && <Notice>{error}</Notice>}
          <div className="supplier-grid two">
            {filtered.map((s) => (
              <Card key={s.id} s={s} selected={selected} toggle={toggle} />
            ))}
          </div>
          {!loading && !error && !filtered.length && (
            <div className="empty">
              <h3>No matching suppliers</h3>
              <p>Try fewer filters or clear your search.</p>
              <button onClick={() => setFilters({})}>Clear filters</button>
            </div>
          )}
          <p className="fine">
            Clutch Cabinets NW is affiliated with the marketplace founder.
            Featured status is promotional placement, not a verified
            endorsement. Photos are illustrative.
          </p>
        </div>
      </div>
      {selected.length > 0 && (
        <div className="compare-dock">
          <span>{selected.length} suppliers on your shortlist</span>
          <Link className="button" href="/compare">
            Compare side by side →
          </Link>
        </div>
      )}
    </>
  );
}
export function Compare() {
  const { suppliers, error } = useCatalog();
  const { selected, toggle } = useSelection();
  useEffect(() => {
    api("event", { kind: "Comparison viewed" }).catch(() => {});
  }, []);
  const rows = suppliers.filter((s) => selected.includes(s.id));
  return (
    <section className="section">
      <div className="eyebrow">YOUR SHORTLIST</div>
      <h1>See the whole picture.</h1>
      <p>
        Compare up to four suppliers. Unknown information is a question to ask,
        not a promise.
      </p>
      {error && <Notice>{error}</Notice>}
      <div className="tags selection">
        {suppliers.map((s) => (
          <label key={s.id}>
            <input
              type="checkbox"
              checked={selected.includes(s.id)}
              disabled={selected.length >= 4 && !selected.includes(s.id)}
              onChange={() => toggle(s.id)}
            />
            {s.name}
          </label>
        ))}
      </div>
      {!rows.length ? (
        <div className="empty">
          Choose suppliers above to build your comparison.
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Supplier capabilities</th>
                  {rows.map((s) => (
                    <th key={s.id}>
                      <h3>{s.name}</h3>
                      <span className="fine">
                        {s.demo
                          ? "Demonstration profile"
                          : s.featured
                            ? "Featured · founder affiliated"
                            : "Supplier provided"}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  "location",
                  "material",
                  "construction",
                  "price",
                  "origin",
                  "lead",
                  "min",
                  "max",
                  "installation",
                  "certification",
                  "experience",
                ].map((k) => (
                  <tr key={k}>
                    <th>
                      {(
                        {
                          lead: "Lead time (weeks)",
                          min: "Minimum units",
                          max: "Maximum project units",
                          origin: "Manufacturing origin",
                          price: "Price category",
                        } as Record<string, string>
                      )[k] || k[0].toUpperCase() + k.slice(1)}
                    </th>
                    {rows.map((s) => (
                      <td key={s.id}>
                        {String(s[k as keyof Supplier] || "Confirm directly")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link className="button" href="/quote?shortlist=1">
            Request quotes from this shortlist ↗
          </Link>
        </>
      )}
    </section>
  );
}
export function SupplierDetail({ id }: { id: string }) {
  const { suppliers, error, loading } = useCatalog();
  const s = suppliers.find((s) => s.id === id);
  return (
    <section className="section">
      <Link href="/suppliers">← All suppliers</Link>
      {error && <Notice>{error}</Notice>}
      {!s ? (
        <h1>{loading ? "Loading profile…" : "Supplier unavailable"}</h1>
      ) : (
        <>
          <div className="profile-hero">
            <div>
              <div className="eyebrow">
                {s.featured ? "FEATURED PLACEMENT" : "SUPPLIER PROFILE"}
              </div>
              <h1>{s.name}</h1>
              <p>{s.description}</p>
              <p>
                {s.demo
                  ? "Demonstration listing: no real business, credentials or prices are represented."
                  : "Supplier information is not independently verified. Confirm all project capabilities directly."}
              </p>
              {s.id === "clutch" && (
                <Notice>
                  Founding featured supplier affiliated with the marketplace
                  founder. Your inquiry goes to Clutch only if you select it.
                </Notice>
              )}
              <Link className="button" href={"/quote?supplier=" + s.id}>
                Include in my project request ↗
              </Link>
            </div>
            <img
              src={s.image}
              alt="Illustrative cabinet interior, not a supplier project"
            />
          </div>
          <div className="spec-grid">
            {[
              "location",
              "material",
              "construction",
              "price",
              "origin",
              "installation",
              "certification",
              "experience",
            ].map((k) => (
              <div key={k}>
                <small>{k.toUpperCase()}</small>
                <p>{String(s[k as keyof Supplier])}</p>
              </div>
            ))}
          </div>
          {s.website && (
            <a href={s.website} target="_blank" rel="noreferrer">
              Visit supplier website ↗
            </a>
          )}
          <h2>Questions worth asking</h2>
          <p>
            Request material specifications, finish samples, reference projects,
            delivery terms, a written lead time and clearly identified
            exclusions before awarding work.
          </p>
        </>
      )}
    </section>
  );
}
export function Estimator() {
  const [v, setV] = useState(defaults);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const example = priceExamples.find((p) => p.id === params.get("example"));
    const count = Number(params.get("units"));
    if (example) {
      setV({
        ...example.inputs,
        units: [12, 48, 100].includes(count) ? count : 48,
      });
      setNotice(
        "Loaded the " +
          example.name.toLowerCase() +
          " example. These are editable planning assumptions, not a supplier quote.",
      );
    }
    api("catalog")
      .then((d) => {
        if (!example) setV(d.assumptions);
      })
      .catch(() =>
        setNotice(
          "Using built-in illustrative assumptions; saved defaults unavailable.",
        ),
      );
    api("event", { kind: "Estimator viewed" }).catch(() => {});
  }, []);
  const valid =
    Object.values(v).every((n) => Number.isFinite(n) && n >= 0) &&
    v.units > 0 &&
    v.freight <= 100 &&
    v.contingency <= 100;
  const r = estimate(v);
  const labels: Record<string, string> = {
    units: "Number of units",
    cabinets: "Kitchen cabinets per unit",
    cost: "Material cost per cabinet ($)",
    baths: "Vanities per unit",
    vanity: "Material cost per vanity ($)",
    freight: "Freight allowance (%)",
    install: "Installation per unit ($)",
    contingency: "Contingency (%)",
  };
  return (
    <section className="section">
      <div className="eyebrow">PLAN WITH CLARITY</div>
      <h1>Your project. Your assumptions.</h1>
      <p>
        Build a preliminary cabinet budget. All starting values are illustrative
        assumptions, not quotes or market averages.
      </p>
      {notice && <Notice>{notice}</Notice>}
      <div className="calculator-layout">
        <div className="panel">
          <h3>Adjust the inputs</h3>
          <div className="form-grid">
            {Object.entries(v).map(([k, n]) => (
              <label className="field" key={k}>
                {labels[k]}
                <input
                  type="number"
                  min={k === "units" ? 1 : 0}
                  max={k === "freight" || k === "contingency" ? 100 : 100000}
                  step={
                    k === "units" || k === "cabinets" || k === "baths"
                      ? 1
                      : "any"
                  }
                  value={Number.isNaN(n) ? "" : n}
                  onChange={(e) =>
                    setV((p) => ({
                      ...p,
                      [k]: e.target.value === "" ? NaN : Number(e.target.value),
                    }))
                  }
                />
              </label>
            ))}
          </div>
          <button className="link-button" onClick={() => setV(defaults)}>
            Reset illustrative assumptions
          </button>
        </div>
        <div className="budget-result">
          <div className="eyebrow">ESTIMATED TOTAL PROJECT BUDGET</div>
          <strong className="budget-total">
            {valid ? money(r.total) : "Check inputs"}
          </strong>
          <p>
            {valid ? money(r.perUnit) : "—"} per apartment · including
            allowances
          </p>
          {valid && (
            <>
              <div className="budget-line">
                <span>Cabinet & vanity materials</span>
                <b>{money(r.material)}</b>
              </div>
              <div className="budget-line">
                <span>Freight allowance</span>
                <b>{money(r.freight)}</b>
              </div>
              <div className="budget-line">
                <span>Installation allowance</span>
                <b>{money(r.install)}</b>
              </div>
              <div className="budget-line">
                <span>Contingency</span>
                <b>{money(r.contingency)}</b>
              </div>
              <div className="budget-line">
                <span>Kitchen materials / unit</span>
                <b>{money(r.kitchen)}</b>
              </div>
            </>
          )}
          <Link className="button light" href="/quote">
            Turn your plan into a quote request ↗
          </Link>
        </div>
      </div>
      <p className="fine">
        Formula: units × (cabinets × cost + vanities × vanity cost), plus
        freight on materials, installation per unit and contingency on the
        subtotal. Excludes countertops, appliances, tax, demolition, storage and
        project-specific fees. Obtain written supplier quotes.
      </p>
    </section>
  );
}
export function QuoteForm() {
  const { suppliers, error } = useCatalog();
  const [selected, setSelected] = useState<string[]>([]);
  const [sector, setSector] = useState(sectors[0].name);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [step, setStep] = useState(0);
  function nextStep(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.form;
    const fields = form?.querySelectorAll(
      `[data-step="${step}"] input, [data-step="${step}"] select, [data-step="${step}"] textarea`,
    );
    if (fields) {
      for (const field of fields) {
        if (
          !(
            field as unknown as { reportValidity: () => boolean }
          ).reportValidity()
        )
          return;
      }
    }
    setStep(step + 1);
  }
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (p.get("supplier")) setSelected([p.get("supplier")!]);
    else if (p.has("shortlist")) {
      try {
        setSelected(JSON.parse(localStorage.getItem("ccm-shortlist") || "[]"));
      } catch {}
    }
    const s = sectors.find((s) => s.slug === p.get("sector"));
    if (s) setSector(s.name);
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < 2) return;
    setBusy(true);
    setMessage("");
    const form = new FormData(e.currentTarget);
    const values = Object.fromEntries(form.entries());
    const payload = new FormData();
    payload.set(
      "data",
      JSON.stringify({
        ...values,
        recipients: selected,
        consent: values.consent === "on",
      }),
    );
    const file = form.get("file");
    if (file instanceof File && file.size) payload.set("file", file);
    try {
      const r = await fetch("/api/quote", { method: "POST", body: payload });
      const d = (await r.json()) as ApiResult;
      if (!r.ok) throw Error(d.error || "Unable to save request");
      setMessage(d.message + " Reference: " + d.id);
      setDone(true);
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="section narrow">
      <div className="eyebrow">ONE BRIEF. YOUR CHOSEN PARTNERS.</div>
      <h1>Let’s scope your next project.</h1>
      <p>
        A clear brief makes quotes easier to compare. Projects start at 12
        units.
      </p>
      {error && <Notice>{error}</Notice>}
      {message && <Notice>{message}</Notice>}
      {done ? (
        <Link className="button" href="/suppliers">
          Return to suppliers →
        </Link>
      ) : (
        <form onSubmit={submit}>
          <ol className="quote-progress" aria-label="Quote request progress">
            {[
              "Project & contact",
              "Plans & logistics",
              "Recipients & consent",
            ].map((label, i) => (
              <li key={label} aria-current={i === step ? "step" : undefined}>
                <span>0{i + 1}</span>
                {label}
              </li>
            ))}
          </ol>
          <p role="status" className="fine">
            Step {step + 1} of 3 · Your request goes only to the suppliers you
            select in the final step.
          </p>
          <div className="panel" data-step="0" hidden={step !== 0}>
            <h2>
              <small>01</small> Project essentials
            </h2>
            <div className="form-grid">
              <label className="field">
                Project type
                <select
                  name="type"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                >
                  {sectors.map((s) => (
                    <option key={s.slug}>{s.name}</option>
                  ))}
                </select>
              </label>
              <Field label="Company" name="company" />
              <Field label="Your name" name="name" />
              <Field label="Work email" name="email" type="email" />
              <Field label="Project city" name="city" />
              <Field label="State (two-letter code)" name="state" />
              <Field
                label="Residential units (minimum 12)"
                name="units"
                type="number"
                min={12}
                max={100000}
                defaultValue={48}
              />
              <Field
                label="Number of kitchens"
                name="kitchens"
                type="number"
                min={0}
                defaultValue={48}
              />
              <Field
                label="Number of bathrooms"
                name="bathrooms"
                type="number"
                min={0}
                defaultValue={96}
              />
              <Field
                label="Target delivery / project timeline"
                name="timeline"
              />
              <Field
                label="Budget in USD (0 if undecided)"
                name="budget"
                type="number"
                min={0}
                defaultValue={0}
              />
              <Field label="Installation scope" name="installation">
                <option>Supply only</option>
                <option>Supply and install</option>
                <option>To be determined</option>
              </Field>
            </div>
          </div>
          <div className="panel" data-step="1" hidden={step !== 1}>
            <h2>
              <small>02</small> Specifications & logistics
            </h2>
            <label className="field">
              Cabinet specifications
              <textarea
                name="specifications"
                required
                minLength={20}
                maxLength={10000}
                placeholder="Materials, framed / frameless, finish, unit mix, accessibility details from your design team, approved alternates…"
              />
            </label>
            <Field label="Delivery requirements" name="delivery" />
            <label className="field">
              Plans or cabinet schedule (one PDF, maximum 10 MB)
              <input type="file" name="file" accept="application/pdf,.pdf" />
            </label>
            <p className="fine">
              Stored privately. Only selected supplier accounts and marketplace
              administrators can download it. PDF content is not malware-scanned
              in this local MVP; use test plans only.
            </p>
          </div>
          <div className="panel" data-step="2" hidden={step !== 2}>
            <h2>
              <small>03</small> Choose who receives your request
            </h2>
            <p>No supplier is added automatically. Select up to five.</p>
            {suppliers.map((s) => (
              <label className="recipient" key={s.id}>
                <input
                  type="checkbox"
                  checked={selected.includes(s.id)}
                  disabled={selected.length >= 5 && !selected.includes(s.id)}
                  onChange={() =>
                    setSelected((old) =>
                      old.includes(s.id)
                        ? old.filter((x) => x !== s.id)
                        : [...old, s.id],
                    )
                  }
                />
                <span>
                  <b>{s.name}</b>
                  <small>
                    {s.demo
                      ? "Demonstration supplier · no external delivery"
                      : s.featured
                        ? "Featured placement · founder affiliated"
                        : "Supplier-provided profile"}
                  </small>
                </span>
              </label>
            ))}
            <label className="consent">
              <input type="checkbox" name="consent" required /> I authorize
              sharing this project, my contact details and any attached plans
              with only the selected suppliers and marketplace administrators.
            </label>
            <p className="fine">
              Local preview: requests are saved to the local database. No email
              notifications or external supplier delivery occur.
            </p>
            <button
              className="button"
              disabled={busy || selected.length === 0}
              type="submit"
            >
              {busy
                ? "Saving request…"
                : `Save request for ${selected.length} selected supplier${selected.length === 1 ? "" : "s"} ↗`}
            </button>
          </div>
          <div className="quote-navigation">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)}>
                ← Back
              </button>
            )}
            {step < 2 && (
              <button className="button" type="button" onClick={nextStep}>
                Continue to {step === 0 ? "plans & logistics" : "recipients"} →
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
const profileLabels: Record<string, string> = {
  name: "Business name",
  location: "Service location",
  material: "Primary cabinet material",
  construction: "Construction type",
  price: "Price category",
  origin: "Manufacturing origin",
  lead: "Lead time (weeks; 0 if unknown)",
  min: "Minimum order (units; 0 if unknown)",
  max: "Maximum project size (units; 0 if unknown)",
  installation: "Installation capability",
  certification: "Certifications (only documented claims)",
  experience: "Commercial project experience",
};
function ProfileFields({ s }: { s?: Partial<Supplier> }) {
  return (
    <>
      <div className="form-grid">
        {Object.entries(profileLabels).map(([key, label]) => (
          <Field
            key={key}
            name={key}
            label={label}
            type={["lead", "min", "max"].includes(key) ? "number" : "text"}
            min={0}
            defaultValue={String(
              s?.[key as keyof Supplier] ??
                (["lead", "min", "max"].includes(key) ? 0 : ""),
            )}
          />
        ))}
      </div>
      <label className="field">
        Company capabilities and commercial experience
        <textarea
          name="description"
          defaultValue={s?.description}
          required
          minLength={20}
          maxLength={2000}
        />
      </label>
    </>
  );
}
export function SupplierApplication() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const { email, password, ...profile } = data;
    try {
      const d = await api("register", { email, password, profile });
      setMessage(d.message);
      setDone(true);
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="section narrow">
      <div className="eyebrow">BUILD YOUR COMMERCIAL PIPELINE</div>
      <h1>
        The next project starts
        <br />
        with being found.
      </h1>
      <p>
        Create a free supplier application. Describe your actual capabilities,
        then manage your profile and selected project requests in your
        workspace.
      </p>
      <Notice>
        Listings require manual approval. Approval permits publication; it is
        not independent certification. No subscriptions or lead charges are
        active.
      </Notice>
      {message && <Notice>{message}</Notice>}
      {done ? (
        <Link className="button" href="/admin">
          Sign in to your workspace →
        </Link>
      ) : (
        <form className="panel" onSubmit={submit}>
          <h2>Your supplier profile</h2>
          <ProfileFields />
          <h3>Private account details</h3>
          <div className="form-grid">
            <Field name="email" label="Account email" type="email" />
            <Field
              name="password"
              label="Password (at least 12 characters)"
              type="password"
            />
          </div>
          <p className="fine">
            Account email is private and never included in the public directory.
          </p>
          <button className="button" disabled={busy}>
            {busy ? "Saving…" : "Apply to join the marketplace ↗"}
          </button>
        </form>
      )}
      <p>
        Already registered? <Link href="/admin">Sign in →</Link>
      </p>
    </section>
  );
}
export function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("Requests");
  const load = () => api("dashboard").then(setData);
  useEffect(() => {
    load().catch(() => {});
  }, []);
  async function act(path: string, body: unknown) {
    setBusy(true);
    try {
      await api(path, body);
      await load();
      setMessage("Changes saved.");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await act("login", Object.fromEntries(new FormData(e.currentTarget)));
  }
  if (!data)
    return (
      <section className="section login">
        <div className="eyebrow">PRIVATE WORKSPACE</div>
        <h1>Welcome back.</h1>
        <p>Sign in to manage supplier profiles and project requests.</p>
        {message && <Notice>{message}</Notice>}
        <form className="panel" onSubmit={login}>
          <Field name="email" label="Email" />
          <Field name="password" label="Password" type="password" />
          <button className="button" disabled={busy}>
            {busy ? "Signing in…" : "Sign in →"}
          </button>
        </form>
        <p className="fine">
          Local administrator access is provided in LOCAL_ACCESS.md. New
          suppliers can <Link href="/supplier">create an account</Link>.
        </p>
      </section>
    );
  const admin = data.user.role === "admin";
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            {admin ? "MARKETPLACE ADMINISTRATION" : "SUPPLIER WORKSPACE"}
          </div>
          <h1>Your sourcing workspace.</h1>
        </div>
        <button
          onClick={async () => {
            await api("logout", {});
            setData(null);
            setMessage("Signed out.");
          }}
        >
          Sign out
        </button>
      </div>
      {message && <Notice>{message}</Notice>}
      <div className="stats">
        <div>
          <strong>{data.leads.length}</strong>
          <span>{admin ? "Local quote requests" : "Assigned requests"}</span>
        </div>
        <div>
          <strong>
            {
              data.suppliers.filter((s: Supplier) => s.status === "Pending")
                .length
            }
          </strong>
          <span>Profiles awaiting approval</span>
        </div>
        <div>
          <strong>
            {data.leads.filter((l: any) => l.status === "Awarded").length}
          </strong>
          <span>Admin-recorded awards</span>
        </div>
        <div>
          <strong>
            {
              data.leads
                .flatMap((l: any) => l.recipients)
                .filter((r: any) => r.status === "Quoted").length
            }
          </strong>
          <span>Supplier quote responses</span>
        </div>
      </div>
      <div className="tabs">
        {(admin
          ? ["Requests", "Suppliers", "Reports", "Assumptions"]
          : ["Requests", "My profile"]
        ).map((t) => (
          <button
            className={tab === t ? "active" : ""}
            key={t}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Requests" && (
        <>
          {!data.leads.length && (
            <div className="empty">
              No requests yet. Buyer submissions appear here after they are
              saved.
            </div>
          )}
          {data.leads.map((lead: any) => (
            <details className="panel" key={lead.id}>
              <summary>
                <b>
                  {lead.data.company} · {lead.data.units} units ·{" "}
                  {lead.data.city}, {lead.data.state}
                </b>
                <span>
                  {lead.status} · {new Date(lead.created).toLocaleDateString()}
                </span>
              </summary>
              <div className="form-grid">
                <div>
                  <h3>{lead.data.type}</h3>
                  <p>
                    {lead.data.name} · {lead.data.email}
                  </p>
                  <p>
                    {lead.data.kitchens} kitchens · {lead.data.bathrooms}{" "}
                    bathrooms
                  </p>
                  <p>Timeline: {lead.data.timeline}</p>
                  <p>Budget: {money(Number(lead.data.budget))}</p>
                  <p>Delivery: {lead.data.delivery}</p>
                  <p>Installation: {lead.data.installation}</p>
                </div>
                <div>
                  <h3>Specifications</h3>
                  <p className="prewrap">{lead.data.specifications}</p>
                  {lead.files.map((f: any) => (
                    <p key={f.id}>
                      <a href={"/api/file/" + f.id}>Download {f.name} ↓</a>
                    </p>
                  ))}
                </div>
              </div>
              <h4>Selected recipient response tracking</h4>
              {lead.recipients.map((r: any) => (
                <p key={r.supplier}>
                  {data.suppliers.find((s: Supplier) => s.id === r.supplier)
                    ?.name || r.supplier}{" "}
                  · <b>{r.status}</b>
                  {r.response && (
                    <span className="prewrap"> — {r.response}</span>
                  )}
                </p>
              ))}
              {admin ? (
                <label className="field">
                  Internal pipeline status
                  <select
                    value={lead.status}
                    disabled={busy}
                    onChange={(e) =>
                      act("lead", { id: lead.id, status: e.target.value })
                    }
                  >
                    {[
                      "New",
                      "Qualified",
                      "In progress",
                      "Awarded",
                      "Closed",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    act("respond", {
                      ...Object.fromEntries(new FormData(e.currentTarget)),
                      quote: lead.id,
                    });
                  }}
                >
                  <Field label="Response status" name="status">
                    <option>Reviewing</option>
                    <option>Quoted</option>
                    <option>Declined</option>
                  </Field>
                  <label className="field">
                    Response / scope and exclusions
                    <textarea required minLength={5} name="response" />
                  </label>
                  <button disabled={busy}>Save response</button>
                </form>
              )}
              <small>
                Request ID: {lead.id} · Saved locally; no email delivery.
              </small>
            </details>
          ))}
        </>
      )}
      {tab === "Suppliers" &&
        data.suppliers.map((s: Supplier) => (
          <div className="panel supplier-admin" key={s.id}>
            <div>
              <h3>{s.name}</h3>
              <small>
                {s.demo ? "Demonstration" : "Supplier / founder provided"} ·{" "}
                {s.status || "Approved"}
              </small>
              <p>{s.description}</p>
            </div>
            <label className="field">
              Listing status
              <select
                value={s.status || "Approved"}
                disabled={busy}
                onChange={(e) =>
                  act("supplier", {
                    id: s.id,
                    status: e.target.value,
                    featured: s.featured,
                  })
                }
              >
                {["Pending", "Approved", "Rejected"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={s.featured}
                disabled={busy}
                onChange={(e) =>
                  act("supplier", {
                    id: s.id,
                    status: s.status || "Approved",
                    featured: e.target.checked,
                  })
                }
              />{" "}
              Featured placement
            </label>
          </div>
        ))}
      {tab === "My profile" &&
        data.suppliers.map((s: Supplier) => (
          <form
            className="panel"
            key={s.id}
            onSubmit={(e) => {
              e.preventDefault();
              act("profile", Object.fromEntries(new FormData(e.currentTarget)));
            }}
          >
            <h2>Manage your profile</h2>
            <p>Edits return your profile to the approval queue.</p>
            <ProfileFields s={s} />
            <button className="button" disabled={busy}>
              Save profile for review
            </button>
          </form>
        ))}
      {tab === "Reports" && (
        <div className="panel">
          <h2>Observed local activity</h2>
          <p>
            These counts include testing and repeat visits. They are not unique
            visitors or verified revenue.
          </p>
          {data.events.map((e: any) => (
            <div className="budget-line" key={e.kind}>
              <span>{e.kind}</span>
              <b>{e.count}</b>
            </div>
          ))}
          <p>
            Request-to-recorded-award conversion:{" "}
            {data.leads.length
              ? (
                  (100 *
                    data.leads.filter((l: any) => l.status === "Awarded")
                      .length) /
                  data.leads.length
                ).toFixed(1)
              : "0"}
            %. Awards are manually recorded, not transaction-verified.
          </p>
        </div>
      )}
      {tab === "Assumptions" && (
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            act(
              "assumptions",
              Object.fromEntries(
                [...new FormData(e.currentTarget)].map(([k, v]) => [
                  k,
                  Number(v),
                ]),
              ),
            );
          }}
        >
          <h2>Estimator defaults</h2>
          <p>Illustrative starting assumptions, editable by every buyer.</p>
          <div className="form-grid">
            {Object.entries(data.assumptions).map(([k, v]) => (
              <Field
                key={k}
                name={k}
                label={k}
                type="number"
                min={k === "units" ? 1 : 0}
                defaultValue={Number(v)}
              />
            ))}
          </div>
          <button className="button" disabled={busy}>
            Save default assumptions
          </button>
        </form>
      )}
    </section>
  );
}
