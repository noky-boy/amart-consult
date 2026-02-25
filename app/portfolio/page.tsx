import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import Portfolio from "@/components/portfolio";
import type { Portfolio as PortfolioType } from "@/sanity/lib/types";

export const metadata: Metadata = {
  title: "Our Portfolio - Amart Consult",
  description:
    "Explore our diverse collection of architectural projects, from luxury residences to commercial complexes, each crafted with precision and innovation.",
};

async function getPortfolioProjects(): Promise<PortfolioType[]> {
  try {
    return await client.fetch(`
      *[_type == "portfolio"] | order(completionDate desc) {
        _id,
        title,
        category,
        location,
        completionDate,
        projectStatus,
        featured,
        slug,
        description,
        "services": services[]->title,
        // New media array — flat projected shape
        "media": media[]{
          _type,
          _type == "imageItem" => {
            "url": image.asset->url,
            "alt": alt
          },
          _type == "videoItem" => {
            "posterUrl": posterImage.asset->url,
            "videoUrl": select(
              videoType == "file" => videoFile.asset->url,
              videoType == "url"  => videoUrl
            )
          }
        },
        // Legacy fallback
        "images": images[]{
          "url": asset->url,
          alt
        }
      }
    `);
  } catch (error) {
    console.error("Error fetching portfolio projects:", error);
    return [];
  }
}

export default async function PortfolioPage() {
  const projects = await getPortfolioProjects();

  return (
    <div className="min-h-screen bg-white">
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

      <Portfolio projects={projects} />
    </div>
  );
}
