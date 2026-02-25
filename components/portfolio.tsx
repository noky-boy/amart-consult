"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowRight } from "@/components/ui/icons";
import WhatsAppConsultationForm from "./whatsapp-consultation-form";
import type { Portfolio as PortfolioType } from "@/sanity/lib/types";

type ProjectCategory = "All" | "Residential" | "Commercial" | "Renovations";

interface PortfolioProps {
  projects?: PortfolioType[];
}

/**
 * Get the cover image URL for a portfolio project.
 * Tries the new `media` array first (flat projected shape from GROQ),
 * then falls back to the legacy `images` array.
 */
function getCoverImage(project: any): string {
  // New media array — imageItem has `url`, videoItem has `posterUrl`
  if (project.media && project.media.length > 0) {
    for (const item of project.media) {
      if (item._type === "imageItem" && item.url) return item.url;
      if (item._type === "videoItem" && item.posterUrl) return item.posterUrl;
    }
  }
  // Legacy images array
  if (project.images && project.images.length > 0) {
    const first = project.images[0];
    if (first?.url) return first.url;
  }
  return "/placeholder.svg";
}

export default function Portfolio({ projects = [] }: PortfolioProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("All");
  const [isWhatsAppFormOpen, setIsWhatsAppFormOpen] = useState(false);

  const portfolioProjects =
    projects.length > 0
      ? projects.map((project: any) => ({
          id: project._id,
          title: project.title,
          category: (project.category.charAt(0).toUpperCase() +
            project.category.slice(1)) as Exclude<ProjectCategory, "All">,
          year:
            project.projectStatus === "ongoing"
              ? "Ongoing"
              : project.completionDate
                ? new Date(project.completionDate).getFullYear()
                : null,
          isOngoing: project.projectStatus === "ongoing",
          location: project.location || "Ghana",
          featured: project.featured,
          coverImage: getCoverImage(project),
          description: project.description,
          features: project.services || [
            "Modern Design",
            "Quality Construction",
          ],
          slug: project.slug.current,
        }))
      : [
          {
            id: "1",
            title: "Modern Villa, East Legon",
            category: "Residential" as const,
            year: 2024,
            isOngoing: false,
            location: "East Legon, Accra",
            featured: true,
            coverImage: "/placeholder.svg",
            description:
              "Contemporary luxury villa featuring sustainable design elements and smart home integration.",
            features: ["Smart Home System", "Solar Integration"],
            slug: "modern-villa-east-legon",
          },
        ];

  const categories: ProjectCategory[] = [
    "All",
    "Residential",
    "Commercial",
    "Renovations",
  ];

  const filteredProjects =
    activeCategory === "All"
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.category === activeCategory);

  return (
    <>
      <section className="py-16 bg-gradient-to-b from-white to-sand/20">
        <div className="container mx-auto px-4">
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-indigo-deep text-white shadow-lg"
                    : "border-indigo-deep text-indigo-deep hover:bg-indigo-deep hover:text-white"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className="group block"
              >
                <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
                  {/* ── Cover image ── */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={85}
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Gradient so badges are readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Top-right: Featured / Portfolio badge */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={
                          project.featured
                            ? "bg-terracotta text-white font-semibold"
                            : "bg-indigo-deep text-white font-semibold"
                        }
                      >
                        {project.featured ? "Featured" : "Portfolio"}
                      </Badge>
                    </div>

                    {/* Top-left: Ongoing badge */}
                    {project.isOngoing && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-emerald-500 text-white font-semibold">
                          🔄 Ongoing
                        </Badge>
                      </div>
                    )}

                    {/* Bottom-left: Category */}
                    <div className="absolute bottom-3 left-3">
                      <Badge
                        variant="outline"
                        className="border-white/70 text-white bg-black/20 backdrop-blur-sm text-xs"
                      >
                        {project.category}
                      </Badge>
                    </div>
                  </div>

                  {/* ── Card body ── */}
                  <div className="p-5">
                    <h3 className="text-lg font-serif font-bold text-indigo-deep group-hover:text-terracotta transition-colors mb-2 line-clamp-1">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{project.year ?? "—"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        <span className="truncate max-w-[120px]">
                          {project.location}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center text-terracotta text-sm font-medium">
                      View Project
                      <ArrowRight
                        className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              No projects found in this category yet.
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-16">
            <div className="bg-indigo-deep rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-serif font-bold mb-4">
                Ready to Start Your Project?
              </h3>
              <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                Let's discuss how we can bring your architectural vision to life
                with our expertise and innovative design solutions.
              </p>
              <Button
                size="lg"
                onClick={() => setIsWhatsAppFormOpen(true)}
                className="bg-terracotta hover:bg-terracotta/90 text-white px-8 py-3 rounded-full"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppConsultationForm
        isOpen={isWhatsAppFormOpen}
        onClose={() => setIsWhatsAppFormOpen(false)}
      />
    </>
  );
}
