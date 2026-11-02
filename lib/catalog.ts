export type Supplier = {
  id: string;
  name: string;
  location: string;
  material: string;
  construction: string;
  price: string;
  origin: string;
  lead: number;
  min: number;
  max: number;
  installation: string;
  certification: string;
  experience: string;
  description: string;
  demo: boolean;
  featured: boolean;
  image: string;
  status?: string;
  website?: string;
};
export const apartmentHero =
  "https://images.unsplash.com/photo-1758193431351-68538bf55ec3?auto=format&fit=crop&w=1800&q=85";
export const photos = [
  "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
];
export const seed: Supplier[] = [
  {
    id: "clutch",
    name: "Clutch Cabinets NW",
    location: "Oregon",
    material: "Not confirmed",
    construction: "Not confirmed",
    price: "Request quote",
    origin: "Not confirmed",
    lead: 0,
    min: 0,
    max: 0,
    installation: "Not confirmed",
    certification: "Not confirmed",
    experience: "Not confirmed",
    description:
      "Founding featured supplier. Wholesale cabinet business identified by the founder. Confirm project fit, service area and specifications directly.",
    demo: false,
    featured: true,
    image: photos[1],
    website: "https://clutchcabinetsnw.com",
  },
  {
    id: "demo-cascade",
    name: "Cascade Contract Cabinetry",
    location: "West",
    material: "Plywood",
    construction: "Frameless",
    price: "Mid-range",
    origin: "USA",
    lead: 8,
    min: 12,
    max: 500,
    installation: "Available",
    certification: "None claimed",
    experience: "Multifamily",
    description:
      "Demonstration profile for repeatable apartment kitchen and bath packages, coordinated building by building.",
    demo: true,
    featured: false,
    image: photos[2],
  },
  {
    id: "demo-atlas",
    name: "Atlas Volume Interiors",
    location: "National",
    material: "Particleboard",
    construction: "Framed",
    price: "Value",
    origin: "Imported",
    lead: 12,
    min: 48,
    max: 2000,
    installation: "Supply only",
    certification: "None claimed",
    experience: "Hospitality",
    description:
      "Demonstration profile for volume kitchenette programs and phased extended-stay property renovations.",
    demo: true,
    featured: false,
    image: photos[3],
  },
  {
    id: "demo-union",
    name: "Union Architectural Casework",
    location: "East",
    material: "Plywood",
    construction: "Frameless",
    price: "Premium",
    origin: "USA",
    lead: 16,
    min: 24,
    max: 800,
    installation: "Available",
    certification: "None claimed",
    experience: "Senior living",
    description:
      "Demonstration profile for project-specific casework, finish coordination and design-team submittals.",
    demo: true,
    featured: false,
    image: photos[0],
  },
];
export const sectors = [
  [
    "multifamily",
    "Multifamily apartments",
    "Repeat the plan. Refine the process.",
    "Build a consistent kitchen and bath package across your unit mix, with clear alternates and deliveries that follow the construction schedule.",
    "Unit-type cabinet schedules|Kitchen and vanity counts by plan|Building-by-building release dates",
    "Compare apartment cabinet packages",
    "Multifamily",
  ],
  [
    "garden-style",
    "Garden-style apartments",
    "One community. Many building releases.",
    "Coordinate cabinet procurement across walk-up buildings, limited staging areas and separate turnover dates.",
    "Building-level quantities|Truck access and unloading responsibility|Replacement stock by finish",
    "Source garden apartment cabinets",
    "Multifamily",
  ],
  [
    "affordable-housing",
    "Affordable housing & LIHTC",
    "Keep specifications and budgets aligned.",
    "Compare base specifications and documented alternates for affordable housing. Have the project team confirm every applicable funding and design requirement.",
    "Approved finish and material schedule|Substitution review process|Accessibility details from design documents",
    "Price your affordable housing package",
    "Multifamily",
  ],
  [
    "workforce-housing",
    "Workforce housing",
    "Durability that works every day.",
    "Balance repeatable cabinet packages with repairability and long-term replacement availability across attainable rental housing.",
    "Wear-resistant finish requirements|Standard hardware and replacement parts|Base scope versus lifecycle alternates",
    "Compare workforce housing options",
    "Multifamily",
  ],
  [
    "cluster-cottages",
    "Cluster cottage communities",
    "Small footprints. Thoughtful storage.",
    "Source efficient kitchens for compact homes while tracking layout variations and staggered community buildout.",
    "Compact kitchen elevations|Options by cottage plan|Lot-specific delivery labels",
    "Plan your cottage cabinet package",
    "Multifamily",
  ],
  [
    "build-to-rent",
    "Build-to-rent housing",
    "A consistent finish, street after street.",
    "Standardize cabinet selections across rental home plans and coordinate releases with neighborhood construction phases.",
    "Home-plan quantity matrix|Phase and lot delivery schedule|Spare fronts and hardware strategy",
    "Source your BTR community",
    "Multifamily",
  ],
  [
    "student-housing",
    "Student housing & dormitories",
    "Built around the academic calendar.",
    "Specify shared kitchens and dormitory casework with maintenance access and a practical replacement plan for short turnover windows.",
    "Shared versus in-unit kitchen scope|Summer installation windows|Replaceable doors and drawer fronts",
    "Scope your student housing cabinets",
    "Multifamily",
  ],
  [
    "senior-living",
    "Senior living & assisted living",
    "Designed around everyday independence.",
    "Coordinate residential cabinetry, common areas and design-team reach and clearance requirements in one procurement package.",
    "Kitchen and common-area schedules|Designer-specified clearances|Mock-up and finish review milestones",
    "Compare senior living cabinetry",
    "Senior living",
  ],
  [
    "independent-memory-care",
    "Independent living & memory care",
    "Different care settings. Distinct scopes.",
    "Separate independent living kitchens from supervised-use storage and memory care casework before asking suppliers to price the project.",
    "Scope separated by care setting|Design-team hardware requirements|Operational review and mock-ups",
    "Define your care-community scope",
    "Senior living",
  ],
  [
    "hospitality",
    "Extended-stay hotels & hospitality",
    "Every room, ready for the next guest.",
    "Coordinate repeatable kitchenettes with appliance cut sheets, room prototypes and occupied-property delivery constraints.",
    "Room-type kitchenette matrix|Appliance and FF&E coordination|Model-room approval and phasing",
    "Source hospitality cabinet packages",
    "Hospitality",
  ],
  [
    "modular-housing",
    "Modular & manufactured housing",
    "Fit the factory rhythm.",
    "Align cabinet dimensions, packaging and replenishment with module assembly and factory receiving windows.",
    "Module tolerances and fixing details|Assembly sequence and packaging|Factory delivery cadence",
    "Plan factory-ready cabinetry",
    "Multifamily",
  ],
  [
    "military-housing",
    "Military housing & barracks",
    "Make the contract scope explicit.",
    "Organize barracks casework and residential cabinets around contract-specific submittals, documentation and site access.",
    "Contract submittal register|Required origin documentation|Base access and delivery procedures",
    "Prepare your housing cabinet RFQ",
    "Multifamily",
  ],
].map(([slug, name, headline, description, checklist, cta, experience], i) => ({
  slug,
  name,
  headline,
  description,
  checklist: checklist.split("|"),
  cta,
  experience,
  image: i === 0 || i === 1 ? apartmentHero : photos[i % 4],
}));
export const defaults = {
  units: 48,
  cabinets: 14,
  cost: 180,
  baths: 2,
  vanity: 380,
  freight: 8,
  install: 950,
  contingency: 10,
};
export function estimate(v: typeof defaults) {
  const kitchen = v.cabinets * v.cost;
  const material = v.units * (kitchen + v.baths * v.vanity);
  const freight = (material * v.freight) / 100;
  const install = v.units * v.install;
  const subtotal = material + freight + install;
  return {
    kitchen,
    material,
    freight,
    install,
    contingency: (subtotal * v.contingency) / 100,
    total: subtotal * (1 + v.contingency / 100),
    perUnit: (subtotal * (1 + v.contingency / 100)) / v.units,
  };
}

/** Transparent planning examples; not market averages or supplier offers. */
export const priceExamples = [
  {id: 'compact', name: 'Compact apartment', description: 'A smaller kitchen + one vanity', inputs: {...defaults, cabinets: 10, baths: 1, install: 750}},
  {id: 'standard', name: 'Standard apartment', description: 'A full kitchen + two vanities', inputs: {...defaults}},
  {id: 'larger', name: 'Larger apartment', description: 'More kitchen storage + two vanities', inputs: {...defaults, cabinets: 18, install: 1150}},
];
