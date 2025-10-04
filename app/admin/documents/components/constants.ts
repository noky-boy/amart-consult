export const DOCUMENT_CATEGORIES = [
  {
    value: "architectural-plans",
    label: "Architectural Plans",
    group: "Architecture",
  },
  { value: "floor-plans", label: "Floor Plans", group: "Architecture" },
  {
    value: "elevations",
    label: "Elevations & Sections",
    group: "Architecture",
  },
  { value: "3d-renderings", label: "3D Renderings", group: "Architecture" },
  {
    value: "structural-drawings",
    label: "Structural Drawings",
    group: "Engineering",
  },
  { value: "mep-drawings", label: "MEP Drawings", group: "Engineering" },
  {
    value: "construction-drawings",
    label: "Construction Drawings",
    group: "Construction",
  },
  {
    value: "specifications",
    label: "Technical Specifications",
    group: "Construction",
  },
  {
    value: "bill-of-quantities",
    label: "Bill of Quantities (BOQ)",
    group: "Construction",
  },
  {
    value: "progress-photos",
    label: "Progress Photos",
    group: "Site Documentation",
  },
  {
    value: "site-inspection",
    label: "Site Inspection Reports",
    group: "Site Documentation",
  },
  {
    value: "as-built-drawings",
    label: "As-Built Drawings",
    group: "Site Documentation",
  },
  { value: "permits", label: "Permits & Approvals", group: "Legal & Admin" },
  {
    value: "contracts",
    label: "Contracts & Agreements",
    group: "Legal & Admin",
  },
  // NEW: Project Timeline category
  {
    value: "project-timeline",
    label: "Project Timeline",
    group: "Project Management",
  },
  { value: "other", label: "Other Documents", group: "Other" },
];

export const groupedCategories = DOCUMENT_CATEGORIES.reduce((acc, cat) => {
  if (!acc[cat.group]) acc[cat.group] = [];
  acc[cat.group].push(cat);
  return acc;
}, {} as Record<string, typeof DOCUMENT_CATEGORIES>);
