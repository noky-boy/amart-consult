import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import Portfolio from "@/components/portfolio";
import type { Portfolio as PortfolioType } from "@/sanity/lib/types";

export const metadata: Metadata = {
  title: "Our Portfolio - Amart Consult",
  description:
    "Explore our diverse collection of architectural projects, from luxury residences to commercial complexes, each crafted with precision and innovation.",
};

// Fetch portfolio projects from Sanity
async function getPortfolioProjects(): Promise<PortfolioType[]> {
  try {
    const projects = await client.fetch(`
      *[_type == "portfolio"] | order(completionDate desc) {
        _id,
        title,
        category,
        location,
        completionDate,
        featured,
        slug,
        description,
        "services": services[]->title,
        "images": images[] {
          "url": asset->url,
          alt
        }
      }
    `);
    return projects;
  } catch (error) {
    console.error("Error fetching portfolio projects:", error);
    // Return empty array to use fallback data in Portfolio component
    return [];
  }
}

export default async function PortfolioPage() {
  const projects = await getPortfolioProjects();

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-gradient-to-b from-indigo-deep to-indigo-deep/90 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            Our Portfolio
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
            Discover our architectural excellence through a showcase of
            completed projects that demonstrate our commitment to innovative
            design and quality construction.
          </p>
        </div>
      </section>

      {/* Portfolio Component */}
      <Portfolio projects={projects} />
    </div>
  );
}
