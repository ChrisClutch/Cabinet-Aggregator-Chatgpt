// Public research listings are deliberately separate from RFQ recipients.
// Being listed does not establish an account, relationship, or delivery territory.
export type Company = {
  id: string;
  name: string;
  city: string;
  state: string;
  region: string;
  lat: number | null;
  lon: number | null;
  description: string;
  source: string;
  capabilities?: string;
  operator?: boolean;
  unitsPerMonth?: number;
  automatedProduction?: boolean;
  maxProjectUnits?: number;
  leadWeeks?: number;
  commercialEvidence?: string;
};
export const companies: Company[] = [
  {
    id: "clutch",
    name: "Clutch Cabinets NW",
    city: "Location to confirm",
    state: "Oregon",
    region: "West",
    lat: null,
    lon: null,
    operator: true,
    description:
      "Directory operator and founding featured cabinet supplier. Discuss commercial and volume projects directly; production capacity and project limits are not yet documented.",
    source: "https://clutchcabinetsnw.com",
  },
  {
    id: "bellmont",
    name: "Bellmont Cabinet Co.",
    city: "Sumner",
    state: "Washington",
    region: "West",
    lat: 47.203,
    lon: -122.24,
    description:
      "Cabinet company with an independent dealer network and an inquiry route for architects, contractors and designers.",
    source: "https://www.bellmontcabinets.com/company/contact-us",
  },
  {
    id: "cosmo",
    commercialEvidence:
      "Multifamily, senior living and student housing described on company website",
    name: "Cosmo Cabinets",
    city: "Eatonton",
    state: "Georgia",
    region: "South",
    lat: 33.326,
    lon: -83.389,
    description:
      "Kitchen and bath cabinetry. Its website describes multifamily, senior living, student housing and affordable housing work.",
    source: "https://www.cosmocabinets.com/contact",
    capabilities: "https://www.cosmocabinets.com/",
  },
  {
    id: "legacy",
    name: "Legacy Cabinets",
    city: "Eastaboga",
    state: "Alabama",
    region: "South",
    lat: 33.605,
    lon: -86.021,
    description:
      "Cabinet company offering Advantage, Debut and Capstone collections. Confirm commercial project requirements directly.",
    source: "https://legacycabinets.com/contact/",
  },
  {
    id: "wellborn",
    name: "Wellborn Cabinet",
    city: "Ashland",
    state: "Alabama",
    region: "South",
    lat: 33.273,
    lon: -85.837,
    description:
      "Kitchen and bath cabinetry manufacturer. Confirm project volume, available specifications and purchasing route directly.",
    source: "https://wellborn.com/about/our-company/",
  },
];

// Unknown values remain unknown, rather than becoming zero or an invented score.
export function projectCompanies(list: Company[], units: number) {
  return [...list]
    .filter(
      (c) => c.maxProjectUnits === undefined || c.maxProjectUnits >= units,
    )
    .sort((a, b) =>
      units >= 12 && a.operator !== b.operator
        ? a.operator
          ? -1
          : 1
        : a.name.localeCompare(b.name),
    );
}
