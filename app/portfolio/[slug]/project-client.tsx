"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Breadcrumb from "@/components/breadcrumb";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Download,
  ArrowRight,
  DollarSign,
} from "@/components/ui/icons";

interface ProjectData {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  category: string;
  location?: string;
  completionDate?: string;
  client?: string;
  projectValue?: number;
  currency?: string;
  images: Array<{
    asset: { _ref: string };
    alt?: string;
    caption?: string;
  }>;
  featured: boolean;
  services: Array<{
    _id: string;
    title: string;
  }>;
  content?: any; // PortableText content
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

interface ProjectPageClientProps {
  project: ProjectData;
  relatedProjects: ProjectData[];
}

export default function ProjectPageClient({
  project,
  relatedProjects,
}: ProjectPageClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  const allImages = project.images || [];
  const completionYear = project.completionDate
    ? new Date(project.completionDate).getFullYear()
    : new Date().getFullYear();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  const openLightbox = (index: number) => {
    setLightboxImageIndex(index);
    setIsLightboxOpen(true);
  };

  const getTierBadge = (featured: boolean) => {
    return featured ? (
      <Badge className="bg-terracotta text-white font-semibold">
        Featured Project
      </Badge>
    ) : (
      <Badge className="bg-indigo-deep text-white font-semibold">
        Portfolio Project
      </Badge>
    );
  };

  const formatCurrency = (value: number, currency: string) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "GHS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const breadcrumbItems = [
    { label: "Portfolio", href: "/portfolio" },
    { label: project.title },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className="bg-white border-b sticky top-0 z-40"
        role="navigation"
        aria-label="Project navigation"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Breadcrumb items={breadcrumbItems} />
            <Link
              href="/portfolio"
              className="inline-flex items-center text-indigo-deep hover:text-terracotta transition-colors focus-visible:ring-enhanced rounded-md px-2 py-1"
            >
              <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
              Back to Portfolio
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {allImages.length > 0 && allImages[currentImageIndex]?.asset && (
        <section
          className="relative h-[70vh] overflow-hidden"
          aria-label="Project showcase"
        >
          <div className="relative h-full">
            <Image
              src={urlFor(allImages[currentImageIndex].asset)
                .width(1200)
                .height(800)
                .url()}
              alt={
                allImages[currentImageIndex]?.alt ||
                `${project.title} - Project image`
              }
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all focus-visible:ring-enhanced"
                  aria-label="View previous project image"
                >
                  <ChevronLeft
                    className="w-6 h-6 text-white"
                    aria-hidden="true"
                  />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all focus-visible:ring-enhanced"
                  aria-label="View next project image"
                >
                  <ChevronRight
                    className="w-6 h-6 text-white"
                    aria-hidden="true"
                  />
                </button>
              </>
            )}

            {/* Project Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="container mx-auto">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  {getTierBadge(project.featured)}
                  <Badge variant="outline" className="border-white text-white">
                    {project.category.charAt(0).toUpperCase() +
                      project.category.slice(1)}
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
                  {project.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-lg">
                  {project.location && (
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" aria-hidden="true" />
                      <span className="sr-only">Location: </span>
                      {project.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" aria-hidden="true" />
                    <span className="sr-only">Year completed: </span>
                    {completionYear}
                  </div>
                  {project.projectValue && project.currency && (
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" aria-hidden="true" />
                      <span className="sr-only">Project value: </span>
                      {formatCurrency(project.projectValue, project.currency)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image Thumbnails */}
            {allImages.length > 1 && (
              <div
                className="absolute bottom-4 right-4 flex gap-2"
                role="tablist"
                aria-label="Project image navigation"
              >
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all focus-visible:ring-enhanced ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                    role="tab"
                    aria-selected={index === currentImageIndex}
                    aria-label={`View image ${index + 1} of ${
                      allImages.length
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Project Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-2 space-y-12">
            {/* Project Overview */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-6">
                Project Overview
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Rich Content from Sanity */}
              {project.content && (
                <div className="prose prose-lg max-w-none">
                  <PortableText
                    value={project.content}
                    components={{
                      block: {
                        normal: ({ children }) => (
                          <p className="text-gray-700 leading-relaxed mb-4">
                            {children}
                          </p>
                        ),
                        h2: ({ children }) => (
                          <h3 className="text-2xl font-semibold text-indigo-deep mb-4 mt-8">
                            {children}
                          </h3>
                        ),
                        h3: ({ children }) => (
                          <h4 className="text-xl font-semibold text-indigo-deep mb-3 mt-6">
                            {children}
                          </h4>
                        ),
                      },
                      types: {
                        image: ({ value }) => (
                          <div className="my-8">
                            {value?.asset && (
                              <Image
                                src={urlFor(value.asset)
                                  .width(800)
                                  .height(600)
                                  .url()}
                                alt={value.alt || "Project image"}
                                width={800}
                                height={600}
                                className="rounded-lg w-full"
                              />
                            )}
                            {value?.caption && (
                              <p className="text-sm text-gray-600 mt-2 text-center italic">
                                {value.caption}
                              </p>
                            )}
                          </div>
                        ),
                      },
                    }}
                  />
                </div>
              )}
            </section>

            {/* Visual Gallery */}
            {allImages.length > 1 && (
              <section>
                <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-6">
                  Visual Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allImages.map((image, index) => {
                    if (!image?.asset) return null;
                    return (
                      <div
                        key={index}
                        className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
                        onClick={() => openLightbox(index)}
                      >
                        <Image
                          src={urlFor(image.asset).width(400).height(400).url()}
                          alt={
                            image.alt || `${project.title} - Image ${index + 1}`
                          }
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                              <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Services Provided */}
            {project.services && project.services.length > 0 && (
              <section>
                <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-6">
                  Services Provided
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.services.map((service, index) => (
                    <div
                      key={service._id}
                      className="flex items-center p-4 bg-white border border-sand rounded-lg"
                    >
                      <div className="w-2 h-2 bg-terracotta rounded-full mr-4" />
                      <span className="text-gray-700">{service.title}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Project Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-indigo-deep mb-4">
                  Project Details
                </h3>
                <div className="space-y-4">
                  {project.client && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client:</span>
                      <span className="font-semibold">{project.client}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold">
                      {project.category.charAt(0).toUpperCase() +
                        project.category.slice(1)}
                    </span>
                  </div>
                  {project.completionDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-semibold">
                        {new Date(project.completionDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                          }
                        )}
                      </span>
                    </div>
                  )}
                  {project.projectValue && project.currency && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Project Value:</span>
                      <span className="font-semibold">
                        {formatCurrency(project.projectValue, project.currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    {project.featured ? (
                      <Badge className="bg-terracotta text-white">
                        Featured
                      </Badge>
                    ) : (
                      <Badge className="bg-indigo-deep text-white">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share & Download */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-indigo-deep mb-4">
                  Share Project
                </h3>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-8 text-center">
              Related Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject._id}
                  href={`/portfolio/${relatedProject.slug.current}`}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    {relatedProject.images?.[0]?.asset && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={urlFor(relatedProject.images[0].asset)
                            .width(600)
                            .height(400)
                            .url()}
                          alt={
                            relatedProject.images[0].alt || relatedProject.title
                          }
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-indigo-deep mb-2">
                        {relatedProject.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {relatedProject.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {relatedProject.category.charAt(0).toUpperCase() +
                            relatedProject.category.slice(1)}
                        </Badge>
                        {relatedProject.completionDate && (
                          <span className="text-sm text-gray-500">
                            {new Date(
                              relatedProject.completionDate
                            ).getFullYear()}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-indigo-deep to-terracotta text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Let's discuss how we can bring your architectural vision to life
                with our expertise and innovative design solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-indigo-deep hover:bg-gray-100 focus-visible:ring-enhanced"
                >
                  Get Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                </Button>
                <Link href="/portfolio">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-indigo-deep bg-transparent focus-visible:ring-enhanced"
                  >
                    View All Projects
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Lightbox */}
      {isLightboxOpen && allImages.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-4xl max-h-full">
            {allImages[lightboxImageIndex]?.asset && (
              <Image
                src={urlFor(allImages[lightboxImageIndex].asset)
                  .width(1200)
                  .height(800)
                  .url()}
                alt={
                  allImages[lightboxImageIndex]?.alt ||
                  `${project.title} - Image ${lightboxImageIndex + 1}`
                }
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
            )}

            {lightboxImageIndex > 0 && (
              <button
                onClick={() => setLightboxImageIndex((prev) => prev - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {lightboxImageIndex < allImages.length - 1 && (
              <button
                onClick={() => setLightboxImageIndex((prev) => prev + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {lightboxImageIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
