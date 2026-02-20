"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Breadcrumb from "@/components/breadcrumb";
import { PortableText } from "@portabletext/react";
import { buildImageUrl } from "@/sanity/lib/image";
import MediaSlideshow, {
  normaliseMedia,
  type MediaSlideItem,
} from "@/components/MediaSlideshow";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Download,
  ArrowRight,
  DollarSign,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  MessageCircle,
} from "@/components/ui/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectData {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  category: string;
  location?: string;
  projectStatus?: "ongoing" | "completed";
  completionDate?: string;
  client?: string;
  projectValue?: number;
  currency?: string;
  media?: any[];
  images?: any[];
  featured: boolean;
  services: Array<{ _id: string; title: string }>;
  content?: any;
  seo?: { metaTitle?: string; metaDescription?: string };
  _updatedAt?: string;
}

interface ProjectPageClientProps {
  project: ProjectData;
  relatedProjects: ProjectData[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "GHS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Get the cover thumbnail URL for a project — used for related project cards */
function getCoverUrl(project: ProjectData): string | undefined {
  if (project.media && project.media.length > 0) {
    const first = project.media[0];
    if (first._type === "imageItem") {
      return first.url ?? first.image?.asset?.url;
    }
    if (first._type === "videoItem") {
      return first.posterImage?.asset?.url;
    }
  }
  // Legacy images: GROQ may return { url } or { asset: { url } }
  const legacyFirst = project.images?.[0];
  return legacyFirst?.url ?? legacyFirst?.asset?.url;
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  items,
  initialIndex,
  projectTitle,
  onClose,
}: {
  items: MediaSlideItem[];
  initialIndex: number;
  projectTitle: string;
  onClose: () => void;
}) {
  const imageItems = items.filter((i) => i.type === "image");
  const [idx, setIdx] = useState(Math.min(initialIndex, imageItems.length - 1));
  const current = imageItems[idx];
  if (!current) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
          aria-label="Close lightbox"
        >
          <X className="w-8 h-8" />
        </button>

        {current.imageUrl && (
          <Image
            src={current.imageUrl}
            alt={current.alt ?? `${projectTitle} — image ${idx + 1}`}
            width={1200}
            height={800}
            className="max-w-full max-h-[80vh] object-contain mx-auto rounded"
          />
        )}

        {current.caption && (
          <p className="text-white/70 text-sm text-center mt-2 italic">
            {current.caption}
          </p>
        )}

        {idx > 0 && (
          <button
            onClick={() => setIdx((p) => p - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {idx < imageItems.length - 1 && (
          <button
            onClick={() => setIdx((p) => p + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs">
          {idx + 1} / {imageItems.length}
        </div>
      </div>
    </div>
  );
}

// ─── Gallery Grid ─────────────────────────────────────────────────────────────

function GalleryGrid({
  items,
  projectTitle,
  onOpenLightbox,
}: {
  items: MediaSlideItem[];
  projectTitle: string;
  onOpenLightbox: (imageIdx: number) => void;
}) {
  let imageCount = -1;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item, i) => {
        if (item.type === "image") {
          imageCount++;
          const capturedIdx = imageCount;

          return (
            <button
              key={i}
              onClick={() => onOpenLightbox(capturedIdx)}
              className="relative aspect-square group overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-deep"
              aria-label={`Enlarge image ${capturedIdx + 1}`}
            >
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.alt ?? `${projectTitle} — image ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
            </button>
          );
        }

        // Video item in gallery
        return (
          <div
            key={i}
            className="relative aspect-square overflow-hidden rounded-lg bg-gray-900 flex items-center justify-center"
          >
            {item.posterUrl && (
              <Image
                src={item.posterUrl}
                alt={item.videoTitle ?? "Video"}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover opacity-70"
              />
            )}
            <div className="relative z-10 bg-white/20 backdrop-blur-sm rounded-full p-4">
              <svg
                className="w-8 h-8 fill-white text-white"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            {item.caption && (
              <p className="absolute bottom-2 left-2 right-2 text-white text-xs text-center truncate bg-black/40 rounded px-1 py-0.5">
                {item.caption}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProjectPageClient({
  project,
  relatedProjects,
}: ProjectPageClientProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Normalise once — all downstream UI reads from this
  const allMedia = normaliseMedia(project.media, project.images);
  const imageItems = allMedia.filter((i) => i.type === "image");

  const projectUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://amart-consult.vercel.app"}/portfolio/${project.slug.current}`;

  const isOngoing = project.projectStatus === "ongoing";
  const completionLabel = isOngoing
    ? "Ongoing"
    : project.completionDate
      ? new Date(project.completionDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
      : "Completed";
  const completionYear = isOngoing
    ? "Ongoing"
    : project.completionDate
      ? String(new Date(project.completionDate).getFullYear())
      : String(new Date().getFullYear());

  // ── Share ────────────────────────────────────────────────────────────────
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      alert("Failed to copy link");
    }
  };

  const handleShare = (platform: string) => {
    const text = `Check out this project: ${project.title}`;
    const url = encodeURIComponent(projectUrl);
    const t = encodeURIComponent(text);
    const map: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${t}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${t}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email: `mailto:?subject=${encodeURIComponent(project.title)}&body=${t}%20${url}`,
    };
    if (map[platform])
      window.open(map[platform], "_blank", "noopener,noreferrer");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: `Check out this project: ${project.title}`,
          url: projectUrl,
        });
      } catch {}
    } else {
      setIsShareDialogOpen(true);
    }
  };

  // ── Downloads ────────────────────────────────────────────────────────────
  const handleDownloadAll = async () => {
    // DEBUG — open browser console to see the raw data shapes
    console.log("[ZIP DEBUG] project.media:", project.media);
    console.log("[ZIP DEBUG] project.images:", project.images);
    console.log("[ZIP DEBUG] allMedia (normalised):", allMedia);
    console.log("[ZIP DEBUG] imageItems:", imageItems);

    // Collect all valid image URLs from the normalised list
    const imageUrls = imageItems
      .map((i) => i.imageUrl)
      .filter((url): url is string => !!url);

    console.log("[ZIP DEBUG] imageUrls being sent:", imageUrls);

    if (imageUrls.length === 0) {
      alert(
        "No image URLs found. Check browser console (F12) for '[ZIP DEBUG]' logs and share them so we can fix the data shape.",
      );
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch("/api/download-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: imageUrls,
          projectSlug: project.slug.current,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error ?? "Server error");
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${project.slug.current}-images.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("ZIP download failed:", err);
      alert("Failed to download images. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownload = async () => {
    const firstImageUrl = imageItems[0]?.imageUrl;
    if (!firstImageUrl) {
      alert("No image available to download");
      return;
    }
    setIsDownloading(true);
    try {
      const response = await fetch("/api/download-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: firstImageUrl,
          filename: `${project.slug.current}-main-image.jpg`,
        }),
      });
      if (!response.ok) throw new Error("Server error");
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${project.slug.current}-main-image.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Image download failed:", err);
      alert("Failed to download image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // ── Misc ─────────────────────────────────────────────────────────────────
  const getTierBadge = (featured: boolean) =>
    featured ? (
      <Badge className="bg-terracotta text-white font-semibold">
        Featured Project
      </Badge>
    ) : (
      <Badge className="bg-indigo-deep text-white font-semibold">
        Portfolio Project
      </Badge>
    );

  const breadcrumbItems = [
    { label: "Portfolio", href: "/portfolio" },
    { label: project.title },
  ];

  const heroOverlay = (
    <div className="p-8 text-white">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {getTierBadge(project.featured)}
          <Badge variant="outline" className="border-white text-white">
            {project.category.charAt(0).toUpperCase() +
              project.category.slice(1)}
          </Badge>
          {isOngoing && (
            <Badge className="bg-emerald-500 text-white">🔄 Ongoing</Badge>
          )}
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
          {project.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-lg">
          {project.location && (
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" aria-hidden="true" />
              {project.location}
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" aria-hidden="true" />
            {completionYear}
          </div>
          {project.projectValue && project.currency && (
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" aria-hidden="true" />
              {formatCurrency(project.projectValue, project.currency)}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav
        className="bg-white border-b sticky top-0 z-40"
        role="navigation"
        aria-label="Project navigation"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Breadcrumb items={breadcrumbItems} />
          <Link
            href="/portfolio"
            className="inline-flex items-center text-indigo-deep hover:text-terracotta transition-colors rounded-md px-2 py-1"
          >
            <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
            Back to Portfolio
          </Link>
        </div>
      </nav>

      {/* Hero slideshow */}
      {allMedia.length > 0 && (
        <MediaSlideshow
          media={project.media}
          legacyImages={project.images}
          projectTitle={project.title}
          overlayContent={heroOverlay}
          onOpenLightbox={(idx) => {
            setLightboxImageIndex(idx);
            setIsLightboxOpen(true);
          }}
        />
      )}

      {/* Main content */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article */}
          <article className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-6">
                Project Overview
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {project.description}
              </p>
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
                        image: ({ value }) =>
                          value?.asset ? (
                            <div className="my-8">
                              <Image
                                src={buildImageUrl(value.asset, 800, 600)}
                                alt={value.alt || "Project image"}
                                width={800}
                                height={600}
                                className="rounded-lg w-full h-auto"
                              />
                              {value.caption && (
                                <p className="text-sm text-gray-600 mt-2 text-center italic">
                                  {value.caption}
                                </p>
                              )}
                            </div>
                          ) : null,
                      },
                    }}
                  />
                </div>
              )}
            </section>

            {/* Gallery */}
            {allMedia.length > 1 && (
              <section>
                <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-6">
                  Visual Gallery
                </h2>
                <GalleryGrid
                  items={allMedia}
                  projectTitle={project.title}
                  onOpenLightbox={(idx) => {
                    setLightboxImageIndex(idx);
                    setIsLightboxOpen(true);
                  }}
                />
              </section>
            )}

            {/* Services */}
            {project.services && project.services.length > 0 && (
              <section>
                <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-6">
                  Services Provided
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.services.map((service) => (
                    <div
                      key={service._id}
                      className="flex items-center p-4 bg-white border border-sand rounded-lg"
                    >
                      <div className="w-2 h-2 bg-terracotta rounded-full mr-4 shrink-0" />
                      <span className="text-gray-700">{service.title}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar */}
          <aside aria-label="Project metadata" className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-indigo-deep mb-4">
                  Project Details
                </h3>
                <dl className="space-y-4">
                  {project.client && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Client:</dt>
                      <dd className="font-semibold text-right">
                        {project.client}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Category:</dt>
                    <dd className="font-semibold">
                      {project.category.charAt(0).toUpperCase() +
                        project.category.slice(1)}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-600">
                      {isOngoing ? "Status:" : "Completed:"}
                    </dt>
                    <dd>
                      {isOngoing ? (
                        <Badge className="bg-emerald-500 text-white">
                          Ongoing
                        </Badge>
                      ) : (
                        <span className="font-semibold">{completionLabel}</span>
                      )}
                    </dd>
                  </div>
                  {project.projectValue && project.currency && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Project Value:</dt>
                      <dd className="font-semibold">
                        {formatCurrency(project.projectValue, project.currency)}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-600">Featured:</dt>
                    <dd>
                      {project.featured ? (
                        <Badge className="bg-terracotta text-white">
                          Featured
                        </Badge>
                      ) : (
                        <Badge className="bg-indigo-deep text-white">
                          Portfolio
                        </Badge>
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-indigo-deep mb-4">
                  Share Project
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent hover:bg-indigo-deep hover:text-white transition-colors"
                    onClick={handleNativeShare}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Project
                  </Button>

                  {imageItems.length > 0 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent hover:bg-terracotta hover:text-white transition-colors"
                        onClick={handleDownload}
                        disabled={isDownloading}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isDownloading ? "Downloading…" : "Download Main Image"}
                      </Button>

                      {imageItems.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent hover:bg-indigo-deep hover:text-white transition-colors"
                          onClick={handleDownloadAll}
                          disabled={isDownloading}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {isDownloading
                            ? "Preparing ZIP…"
                            : `Download All (${imageItems.length} images)`}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-8 text-center">
              Related Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedProjects.map((rel) => {
                const coverUrl = getCoverUrl(rel);
                return (
                  <Link key={rel._id} href={`/portfolio/${rel.slug.current}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                      {coverUrl && (
                        <div className="relative h-48 bg-gray-100">
                          <Image
                            src={coverUrl}
                            alt={rel.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-indigo-deep mb-2">
                          {rel.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {rel.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            {rel.category.charAt(0).toUpperCase() +
                              rel.category.slice(1)}
                          </Badge>
                          {rel.projectStatus === "ongoing" ? (
                            <Badge className="bg-emerald-500 text-white text-xs">
                              Ongoing
                            </Badge>
                          ) : rel.completionDate ? (
                            <span className="text-sm text-gray-500">
                              {new Date(rel.completionDate).getFullYear()}
                            </span>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* CTA */}
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
                  className="bg-white text-indigo-deep hover:bg-gray-100"
                >
                  Get Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                </Button>
                <Link href="/portfolio">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-indigo-deep bg-transparent"
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
      {isLightboxOpen && imageItems.length > 0 && (
        <Lightbox
          items={allMedia}
          initialIndex={lightboxImageIndex}
          projectTitle={project.title}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}

      {/* Share dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this project</DialogTitle>
            <DialogDescription>
              Share {project.title} with your network
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={projectUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50"
                aria-label="Project URL"
              />
              <Button
                size="sm"
                onClick={handleCopyLink}
                className="bg-indigo-deep hover:bg-indigo-deep/90 shrink-0"
              >
                {copySuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-1" /> Copied!
                  </>
                ) : (
                  "Copy"
                )}
              </Button>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Share on social media:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    key: "whatsapp",
                    icon: MessageCircle,
                    label: "WhatsApp",
                    cls: "hover:bg-green-50 hover:border-green-500 hover:text-green-600",
                  },
                  {
                    key: "facebook",
                    icon: Facebook,
                    label: "Facebook",
                    cls: "hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600",
                  },
                  {
                    key: "twitter",
                    icon: Twitter,
                    label: "Twitter",
                    cls: "hover:bg-sky-50 hover:border-sky-500 hover:text-sky-600",
                  },
                  {
                    key: "linkedin",
                    icon: Linkedin,
                    label: "LinkedIn",
                    cls: "hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700",
                  },
                ].map(({ key, icon: Icon, label, cls }) => (
                  <Button
                    key={key}
                    variant="outline"
                    onClick={() => handleShare(key)}
                    className={`justify-start ${cls}`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => handleShare("email")}
                  className="justify-start col-span-2 hover:bg-gray-50"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
