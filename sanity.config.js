import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/lib/structure";

const config = defineConfig({
  name: "amart-consult",
  title: "Amart Consult CMS",

  // projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  projectId: "9mnu7l2c",
  // dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  dataset: "production",

  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  basePath: "/studio",

  studio: {
    components: {
      logo: () => ({
        type: "div",
        props: {
          style: { padding: "0.5rem", fontWeight: "bold", color: "#2563eb" },
          children: "Amart Consult",
        },
      }),
    },
  },

  document: {
    actions: (prev, context) => {
      return prev;
    },
  },
});

export default config;
