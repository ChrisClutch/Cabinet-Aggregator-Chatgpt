import test from "node:test";
import assert from "node:assert/strict";
import { companies, projectCompanies } from "../lib/company-directory.ts";
test("residential sorting is alphabetical while commercial operator placement is explicit", () => {
  assert.equal(projectCompanies(companies, 1)[0].id, "bellmont");
  assert.equal(projectCompanies(companies, 100)[0].id, "clutch");
  assert.equal(projectCompanies(companies, 200).length, companies.length);
});
test("unknown capacity stays visible; documented project limits exclude oversized projects", () => {
  const fixture = [
    { ...companies[0], id: "known", maxProjectUnits: 40 },
    { ...companies[1], id: "unknown" },
  ];
  assert.deepEqual(
    projectCompanies(fixture, 48).map((c) => c.id),
    ["unknown"],
  );
  assert.equal(projectCompanies(fixture, 12).length, 2);
});
