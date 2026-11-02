import assert from "node:assert/strict";
import { sectors } from "../lib/catalog.ts";
import { readFileSync, writeFileSync } from "node:fs";
const base = process.env.BASE_URL || "http://127.0.0.1:8787";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))
  throw Error("Tests restricted to localhost");
const password = readFileSync(".dev.vars", "utf8").match(
  /ADMIN_PASSWORD="([^"]+)"/,
)[1];
const passed = [];
function check(name, fn) {
  fn();
  passed.push(name);
  console.log("PASS", name);
}
async function req(path, data, cookie = "", origin = base) {
  const r = await fetch(base + "/api/" + path, {
    method: data === undefined ? "GET" : "POST",
    headers: {
      ...(data !== undefined
        ? { "Content-Type": "application/json", Origin: origin }
        : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(data === undefined ? {} : { body: JSON.stringify(data) }),
  });
  let body;
  try {
    body = await r.json();
  } catch {}
  return { r, body };
}
const a = await req("dashboard");
check("Anonymous dashboard denied", () => assert.equal(a.r.status, 401));
const bad = await req(
  "login",
  { email: "admin@local", password },
  "",
  "https://example.com",
);
check("Cross-origin write denied", () => assert.equal(bad.r.status, 403));
const login = await req("login", { email: "admin@local", password });
check("Admin can sign in", () => assert.equal(login.r.status, 200));
const admin = login.r.headers.get("set-cookie").split(";")[0];
check("Session cookie is HttpOnly and SameSite Strict", () =>
  assert.match(login.r.headers.get("set-cookie"), /HttpOnly; SameSite=Strict/),
);
const stamp = Date.now();
const profile = {
  name: "QA Supplier " + stamp,
  location: "Oregon",
  material: "Plywood",
  construction: "Frameless",
  price: "Mid-range",
  origin: "USA",
  lead: 8,
  min: 12,
  max: 200,
  installation: "Supply only",
  certification: "None claimed",
  experience: "Multifamily",
  description:
    "Local QA demonstration account for permission tests; not a real supplier.",
};
const email = "qa" + stamp + "@example.test",
  pw = "Local-test-account-" + stamp;
const reg = await req("register", { email, password: pw, profile });
check("Supplier registration persists", () => assert.equal(reg.r.status, 201));
const slogin = await req("login", { email, password: pw });
const supplier = slogin.r.headers.get("set-cookie").split(";")[0];
const sid = slogin.body.user;
let catalog = await req("catalog");
check("Pending supplier absent from public directory", () =>
  assert.ok(!catalog.body.suppliers.some((s) => s.id === sid)),
);
await req("supplier", { id: sid, status: "Approved", featured: false }, admin);
catalog = await req("catalog");
check("Approved supplier becomes discoverable", () =>
  assert.ok(catalog.body.suppliers.some((s) => s.id === sid)),
);
check("Public catalog does not expose account email", () =>
  assert.ok(!JSON.stringify(catalog.body).includes(email)),
);
const elevation = await req(
  "supplier",
  { id: sid, status: "Approved", featured: true },
  supplier,
);
check("Supplier cannot administer listings", () =>
  assert.equal(elevation.r.status, 403),
);
const q = {
  name: "QA Buyer",
  email: "buyer@example.test",
  company: "QA Only — Local Test",
  type: "Multifamily apartments",
  city: "Salem",
  state: "OR",
  units: 48,
  kitchens: 48,
  bathrooms: 96,
  timeline: "Test delivery phase",
  budget: 240000,
  specifications:
    "Test plywood cabinet schedule with framed doors and matching vanity fronts.",
  delivery: "Phased by building",
  installation: "Supply only",
  recipients: [sid],
  consent: true,
};
async function quote(data, file) {
  const form = new FormData();
  form.set("data", JSON.stringify(data));
  if (file) form.set("file", file);
  const r = await fetch(base + "/api/quote", {
    method: "POST",
    headers: { Origin: base },
    body: form,
  });
  return { r, body: await r.json() };
}
const invalid = await quote({ ...q, units: 1 });
check("Under-12-unit inquiry rejected server-side", () =>
  assert.equal(invalid.r.status, 400),
);
const invalidFile = await quote(
  q,
  new File(["not a PDF"], "fake.pdf", { type: "application/pdf" }),
);
check("Spoofed PDF rejected", () => assert.equal(invalidFile.r.status, 400));
const noConsent = await quote({ ...q, consent: false });
check("Consent required server-side", () =>
  assert.equal(noConsent.r.status, 400),
);
const saved = await quote(
  q,
  new File(
    ["%PDF-1.4\n% Local permission test document\n%%EOF"],
    "qa-plans.pdf",
    { type: "application/pdf" },
  ),
);
check("Quote and private PDF saved", () => assert.equal(saved.r.status, 201));
const id = saved.body.id;
const ad = await req("dashboard", undefined, admin);
const lead = ad.body.leads.find((l) => l.id === id);
check("Request appears in admin dashboard", () => assert.ok(lead));
check("Only chosen supplier receives request; Clutch excluded", () =>
  assert.deepEqual(
    lead.recipients.map((r) => r.supplier),
    [sid],
  ),
);
const sd = await req("dashboard", undefined, supplier);
check("Selected supplier sees assigned request", () =>
  assert.ok(sd.body.leads.some((l) => l.id === id)),
);
const fid = lead.files[0].id;
const anonFile = await fetch(base + "/api/file/" + fid);
check("Anonymous file access denied", () => assert.equal(anonFile.status, 401));
const allowedFile = await fetch(base + "/api/file/" + fid, {
  headers: { Cookie: supplier },
});
check("Selected supplier may download attached PDF", () =>
  assert.equal(allowedFile.status, 200),
);
const otherEmail = "other" + stamp + "@example.test";
await req("register", {
  email: otherEmail,
  password: pw,
  profile: { ...profile, name: "QA Unselected " + stamp },
});
const otherLogin = await req("login", { email: otherEmail, password: pw });
const other = otherLogin.r.headers.get("set-cookie").split(";")[0];
const od = await req("dashboard", undefined, other);
check("Unselected supplier cannot see request", () =>
  assert.ok(!od.body.leads.some((l) => l.id === id)),
);
const denied = await fetch(base + "/api/file/" + fid, {
  headers: { Cookie: other },
});
check("Unselected supplier denied private file", () =>
  assert.equal(denied.status, 403),
);
const resp = await req(
  "respond",
  {
    quote: id,
    status: "Quoted",
    response: "QA quotation response with scope exclusions recorded.",
  },
  supplier,
);
check("Selected supplier response saved", () =>
  assert.equal(resp.r.status, 200),
);
const deniedResponse = await req(
  "respond",
  { quote: id, status: "Quoted", response: "Unauthorized reply attempt" },
  other,
);
check("Unselected supplier cannot respond", () =>
  assert.equal(deniedResponse.r.status, 403),
);
await req("lead", { id, status: "Awarded" }, admin);
const awarded = await req("dashboard", undefined, admin);
check("Admin pipeline and response tracking persist", () => {
  const l = awarded.body.leads.find((l) => l.id === id);
  assert.equal(l.status, "Awarded");
  assert.equal(l.recipients[0].status, "Quoted");
});
const before = (await req("catalog")).body.assumptions;
await req("assumptions", { ...before, cost: 181 }, admin);
check("Admin estimator defaults persist", () => {});
assert.equal((await req("catalog")).body.assumptions.cost, 181);
await req("assumptions", before, admin);
await req(
  "profile",
  { ...profile, description: profile.description + " Updated." },
  supplier,
);
check("Supplier profile editing returns listing to approval queue", () => {});
assert.ok(!(await req("catalog")).body.suppliers.some((s) => s.id === sid));
await req("logout", {}, supplier);
check("Logout invalidates server session", () => {});
assert.equal((await req("dashboard", undefined, supplier)).r.status, 401);
for (const route of [
  "/",
  "/suppliers",
  "/compare",
  "/quote",
  "/estimator",
  "/supplier",
  "/admin",
  "/industries",
  ...sectors.map((s) => "/industries/" + s.slug),
  "/how-it-works",
  "/privacy",
  "/robots.txt",
  "/sitemap.xml",
]) {
  const r = await fetch(base + route);
  check("Route " + route, () => assert.equal(r.status, 200));
}
writeFileSync(
  "work/integration-results.json",
  JSON.stringify(
    { passed, timestamp: new Date().toISOString(), quoteId: id },
    null,
    2,
  ),
);
console.log(passed.length + " checks passed");
