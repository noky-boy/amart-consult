import { createClient } from "@sanity/client";

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error("❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
}
if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  throw new Error("❌ Missing NEXT_PUBLIC_SANITY_DATASET in .env.local");
}
if (!process.env.SANITY_API_TOKEN) {
  throw new Error("❌ Missing SANITY_API_TOKEN in .env.local");
}

export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-08-17", // today's date
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
