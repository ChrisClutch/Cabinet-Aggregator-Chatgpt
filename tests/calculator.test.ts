import test from "node:test";
import assert from "node:assert/strict";
import { estimate, defaults, sectors } from "../lib/catalog.ts";
test("48-unit budget applies freight to materials and contingency to subtotal", () => {
  const r = estimate(defaults);
  assert.equal(r.kitchen, 2520);
  assert.equal(r.material, 157440);
  assert.equal(r.freight, 12595.2);
  assert.equal(r.install, 45600);
  assert.ok(Math.abs(r.total - 237198.72) < 0.001);
  assert.ok(Math.abs(r.perUnit - 4941.64) < 0.001);
});
test("zero allowances and single unit do not double count materials", () => {
  const r = estimate({
    units: 1,
    cabinets: 10,
    cost: 100,
    baths: 1,
    vanity: 200,
    freight: 0,
    install: 0,
    contingency: 0,
  });
  assert.equal(r.total, 1200);
  assert.equal(r.perUnit, 1200);
});
test("all twelve sectors have distinct slugs, descriptions and checklists", () => {
  assert.equal(sectors.length, 12);
  assert.equal(new Set(sectors.map((s) => s.slug)).size, 12);
  assert.equal(new Set(sectors.map((s) => s.description)).size, 12);
  assert.equal(new Set(sectors.map((s) => s.checklist.join("|"))).size, 12);
});
