// scripts/seed-about-content.ts
// Run with: npx ts-node --esm scripts/seed-about-content.ts
// OR: npx tsx scripts/seed-about-content.ts

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});
// ... rest of the script stays the same

// ─── Credentials ─────────────────────────────────────────────────────────────
const credentials = [
  {
    _type: "credential",
    title: "Comprehensive Services",
    subtitle:
      "Architectural Design | Bill of Quantities | Construction Management",
    order: 1,
    active: true,
    // image will need to be uploaded separately — see note below
  },
  {
    _type: "credential",
    title: "GIA Certified",
    subtitle: "Ghana Institution of Architects Registered Professional",
    order: 2,
    active: true,
  },
  {
    _type: "credential",
    title: "Diaspora Specialist",
    subtitle:
      "Serving Ghanaian communities worldwide with remote project management",
    order: 3,
    active: true,
  },
];

// ─── Process Steps ────────────────────────────────────────────────────────────
const processSteps = [
  {
    _type: "processStep",
    stepNumber: 1,
    title: "Initial Consultation & Site Visit",
    description:
      "We begin with a comprehensive consultation to understand your vision, requirements, and budget. Our team conducts a thorough site analysis to inform the design process.",
    active: true,
  },
  {
    _type: "processStep",
    stepNumber: 2,
    title: "Design Development & Client Feedback",
    description:
      "Our architects create initial design concepts and work closely with you through iterative feedback sessions to refine the design to perfection.",
    active: true,
  },
  {
    _type: "processStep",
    stepNumber: 3,
    title: "Final Plans & 3D Visualization",
    description:
      "We deliver detailed architectural plans, technical drawings, and photorealistic 3D visualizations so you can see your project before construction begins.",
    active: true,
  },
  {
    _type: "processStep",
    stepNumber: 4,
    title: "Construction Management",
    description:
      "For Tier 3 clients, we provide comprehensive construction management, overseeing every aspect of the build process to ensure quality and timeline adherence.",
    active: true,
  },
  {
    _type: "processStep",
    stepNumber: 5,
    title: "Project Handover & Warranty",
    description:
      "Upon completion, we conduct a thorough walkthrough and provide comprehensive documentation along with our project warranty for your peace of mind.",
    active: true,
  },
];

async function seed() {
  console.log("🌱 Seeding credentials...");
  for (const doc of credentials) {
    const created = await client.create(doc);
    console.log(`  ✅ Created credential: ${doc.title} (${created._id})`);
  }

  console.log("🌱 Seeding process steps...");
  for (const doc of processSteps) {
    const created = await client.create(doc);
    console.log(
      `  ✅ Created process step ${doc.stepNumber}: ${doc.title} (${created._id})`,
    );
  }

  console.log("✅ Done! Open Sanity Studio → About Page to see your content.");
  console.log(
    "⚠️  Remember to upload images for each credential in the Studio.",
  );
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
