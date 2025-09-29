import type { PhaseTemplate } from "@/lib/supabase";

export const constructionPhaseTemplate: PhaseTemplate[] = [
  {
    phase_name: "DESIGN",
    description: "Design and planning phase",
    estimated_duration: "4-8 Weeks",
    phase_weight: 10,
    sub_tasks: [
      {
        phase_name: "SITE FEASIBILITY",
        phase_weight: 3.33,
      },
      {
        phase_name: "BUILDING DESIGN",
        phase_weight: 3.33,
      },
      {
        phase_name: "WORKING DRAWINGS",
        phase_weight: 3.34,
      },
    ],
  },
  {
    phase_name: "SITE SETUP",
    description: "Site preparation and setup",
    estimated_duration: "1-2 Weeks",
    phase_weight: 10,
    sub_tasks: [
      {
        phase_name: "SITE CLEARANCE",
        phase_weight: 2,
      },
      {
        phase_name: "FENCE WALL HOARDING AROUND THE SITE",
        phase_weight: 2,
      },
      {
        phase_name: "SITE OFFICE SETUP",
        phase_weight: 2,
      },
      {
        phase_name: "SETTING OUT",
        phase_weight: 4,
      },
    ],
  },
  {
    phase_name: "SUB-STRUCTURE",
    description: "Foundation and substructure works",
    estimated_duration: "3-5 Weeks",
    phase_weight: 10,
    sub_tasks: [
      {
        phase_name: "EXCAVATION",
        phase_weight: 0.59,
      },
      {
        phase_name: "CONCRETE BLINDING",
        phase_weight: 0.59,
      },
      {
        phase_name: "REINFORCEMENT IN BASES AND STARTER COLUMNS",
        phase_weight: 0.59,
      },
      {
        phase_name: "FORMWORK TO SIDES OF BASES",
        phase_weight: 0.59,
      },
      {
        phase_name: "FOUNDATION CONCRETE",
        phase_weight: 0.59,
      },
      {
        phase_name: "BLOCKWORK",
        phase_weight: 0.59,
      },
      {
        phase_name: "FORMWORK TO SIDES OF COLUMN",
        phase_weight: 0.59,
      },
      {
        phase_name: "CONCRETE IN COLUMNS",
        phase_weight: 0.59,
      },
      {
        phase_name: "FORMWORK FOR GROUND BEAMS",
        phase_weight: 0.59,
      },
      {
        phase_name: "REINFORCEMENT FOR GROUND BEAMS",
        phase_weight: 0.59,
      },
      {
        phase_name: "CONCRETE IN GROUND BEAMS",
        phase_weight: 0.59,
      },
      {
        phase_name: "DAMP PROOF PAINTING",
        phase_weight: 0.59,
      },
      {
        phase_name: "HARDCORE FILLING",
        phase_weight: 0.59,
      },
      {
        phase_name: "FORMWORK TO SIDES OF BED",
        phase_weight: 0.59,
      },
      {
        phase_name: "CONCRETE IN BED",
        phase_weight: 0.59,
      },
      {
        phase_name: "PLUMBING WORKS",
        phase_weight: 0.59,
      },
      {
        phase_name: "CONCRETE IN BED CURING",
        phase_weight: 0.56,
      },
    ],
  },
  {
    phase_name: "GROUND FLOOR PLAN",
    description: "Ground floor construction",
    estimated_duration: "4-6 Weeks",
    phase_weight: 10,
    sub_tasks: [
      {
        phase_name: "BLOCKWORK",
        phase_weight: 1,
      },
      {
        phase_name: "REINFORCEMENT IN COLUMNS",
        phase_weight: 1,
      },
      {
        phase_name: "FORMWORK TO SIDES OF COLUMN",
        phase_weight: 1,
      },
      {
        phase_name: "CONCRETE IN COLUMNS",
        phase_weight: 1,
      },
      {
        phase_name: "FORMWORK FOR BEAMS, SLAB, AND STAIRS",
        phase_weight: 1,
      },
      {
        phase_name: "REINFORCEMENTS IN BEAMS, SLAB, AND STAIRS",
        phase_weight: 1,
      },
      {
        phase_name: "ELECTRICAL WORKS",
        phase_weight: 1,
      },
      {
        phase_name: "PLUMBING WORKS",
        phase_weight: 1,
      },
      {
        phase_name: "CONCRETE IN BEAMS, SLAB, AND STAIRS",
        phase_weight: 1,
      },
      {
        phase_name: "CURING",
        phase_weight: 1,
      },
    ],
  },
  {
    phase_name: "ROOFING",
    description: "Roof structure and covering",
    estimated_duration: "2-4 Weeks",
    phase_weight: 10,
    sub_tasks: [
      {
        phase_name: "ROOF & CEILING FRAMING",
        phase_weight: 5,
      },
      {
        phase_name: "ROOF COVER",
        phase_weight: 5,
      },
    ],
  },
  {
    phase_name: "FINISHES",
    description: "Interior and exterior finishes",
    estimated_duration: "6-8 Weeks",
    phase_weight: 10,
    sub_tasks: [
      {
        phase_name: "MEP PIPE WORKS",
        phase_weight: 0.71,
      },
      {
        phase_name: "FIXING OF BURGLAR PROOFS",
        phase_weight: 0.71,
      },
      {
        phase_name: "FIXING OF DOOR FRAMES",
        phase_weight: 0.71,
      },
      {
        phase_name: "PLASTERING AND DRESSING WORKS",
        phase_weight: 0.71,
      },
      {
        phase_name: "SCREEDING WORKS",
        phase_weight: 0.71,
      },
      {
        phase_name: "ELECTRICAL WIRING WORKS",
        phase_weight: 0.71,
      },
      {
        phase_name: "SKIMMING WORKS",
        phase_weight: 0.71,
      },
      {
        phase_name: "TILING WORKS",
        phase_weight: 0.71,
      },
      {
        phase_name: "FIXING OF DOORS",
        phase_weight: 0.71,
      },
      {
        phase_name: "FIXING OF WINDOWS",
        phase_weight: 0.71,
      },
      {
        phase_name: "PAINTING WORKS",
        phase_weight: 0.71,
      },
      {
        phase_name: "MEP FIXTURES AND FITTINGS",
        phase_weight: 0.71,
      },
      {
        phase_name: "CLEANING",
        phase_weight: 0.72,
      },
    ],
  },
  {
    phase_name: "EXTERNAL WORKS",
    description: "Site external works and landscaping",
    estimated_duration: "2-3 Weeks",
    phase_weight: 10,
    sub_tasks: [
      {
        phase_name: "SOIL DRAINAGE",
        phase_weight: 1.43,
      },
      {
        phase_name: "ELECTRICAL WORKS",
        phase_weight: 1.43,
      },
      {
        phase_name: "ACCESS ROAD AND DRAINS",
        phase_weight: 1.43,
      },
      {
        phase_name: "COMPOUND FLOOR FINISH",
        phase_weight: 1.43,
      },
      {
        phase_name: "LANDSCAPING AND HORTICULTURAL WORKS",
        phase_weight: 1.43,
      },
      {
        phase_name: "FIXING OF GATE",
        phase_weight: 1.43,
      },
      {
        phase_name: "SIGNAGES AND ARTWORK",
        phase_weight: 1.42,
      },
    ],
  },
];
