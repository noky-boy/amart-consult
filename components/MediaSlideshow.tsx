"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { buildImageUrl } from "@/sanity/lib/image";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NormalisedMediaItem {
  type: "image" | "video";
  // image
  imageUrl?: string;
  alt?: string;
  caption?: string;
  assetRef?: string;
  // video
  videoUrl?: string;
  posterUrl?: string;
  videoTitle?: string;
}

// Re-export alias used in project-client
export type MediaSlideItem = NormalisedMediaItem;

interface MediaSlideshowProps {
  media?: any[];
  legacyImages?: any[];
  projectTitle: string;
  /** Content rendered over the current slide (title, badges, etc.) */
  overlayContent?: React.ReactNode;
  /** Called when user clicks on an image slide to open the lightbox */
  onOpenLightbox?: (index: number) => void;
}

// ─── normaliseMedia ───────────────────────────────────────────────────────────
//
// GROQ projections return a FLAT shape — not the raw Sanity schema shape.
//
// imageItem from query:  { _type: "imageItem", url: "https://cdn...", alt, caption }
// videoItem from query:  { _type: "videoItem", videoUrl: "https://...", posterImage: { asset: { url } } }
//
// Legacy images from query: { url: "https://cdn...", alt, caption }
//
// This function handles both the flat projected shape and the raw nested shape
// as a fallback, so it never breaks regardless of which query produced the data.

export function normaliseMedia(
  media: any[] | undefined,
  legacyImages: any[] | undefined,
): NormalisedMediaItem[] {
  if (media && media.length > 0) {
    return media
      .map((item: any): NormalisedMediaItem | null => {
        if (item._type === "imageItem") {
          // Flat projected field first, then nested schema field
          const imageUrl =
            item.url ??
            item.image?.asset?.url ??
            (item.image?.asset
              ? buildImageUrl(item.image.asset, 1920, 1080)
              : undefined);

          if (!imageUrl) return null;

          return {
            type: "image",
            imageUrl,
            alt: item.alt,
            caption: item.caption,
            assetRef: item.assetRef ?? item.image?.asset?._ref,
          };
        }

        if (item._type === "videoItem") {
          // videoUrl is already the resolved CDN/file URL from GROQ select()
          const videoUrl: string | undefined = item.videoUrl || undefined;
          const posterUrl: string | undefined =
            item.posterUrl ?? item.posterImage?.asset?.url;

          if (!videoUrl) return null;

          return {
            type: "video",
            videoUrl,
            posterUrl,
            videoTitle: item.title ?? item.videoTitle,
            caption: item.caption,
          };
        }

        return null;
      })
      .filter((x): x is NormalisedMediaItem => x !== null);
  }

  // Fallback: legacy images
  // Projected shape: { url, alt, caption }  OR raw: { asset: { url, _ref }, alt, caption }
  if (legacyImages && legacyImages.length > 0) {
    return legacyImages
      .map((img: any): NormalisedMediaItem | null => {
        const imageUrl =
          img.url ??
          img.asset?.url ??
          (img.asset ? buildImageUrl(img.asset, 1920, 1080) : undefined);

        if (!imageUrl) return null;

        return {
          type: "image",
          imageUrl,
          alt: img.alt,
          caption: img.caption,
          assetRef: img.asset?._ref,
        };
      })
      .filter((x): x is NormalisedMediaItem => x !== null);
  }

  return [];
}

// ─── MediaSlideshow ───────────────────────────────────────────────────────────

export default function MediaSlideshow({
  media,
  legacyImages,
  projectTitle,
  overlayContent,
  onOpenLightbox,
}: MediaSlideshowProps) {
  const items = normaliseMedia(media, legacyImages);
  const [current, setCurrent] = useState(0);

  // Auto-advance every 6.5 s — same interval as the hero
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % items.length),
      6500,
    );
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <section
      className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-screen overflow-hidden"
      aria-label={`${projectTitle} media showcase`}
    >
      {/* ── Slides — stacked absolute divs, opacity-fade between them ── */}
      <div className="absolute inset-0 z-0">
        {items.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            {item.type === "image" && item.imageUrl ? (
              <>
                {/* Exact same approach as the hero — fill + object-cover object-center */}
                <div className="relative w-full h-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.alt ?? `${projectTitle} — image ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1440px) 1440px, 1920px"
                    quality={85}
                    className="object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
              </>
            ) : item.type === "video" && item.videoUrl ? (
              /* Video plays exactly like an image — no controls, no UI chrome,
                 just fills the slide and plays. Same dimensions as the image slot. */
              <video
                src={item.videoUrl}
                poster={item.posterUrl}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover object-center"
                aria-label={
                  item.videoTitle ?? `${projectTitle} — video ${index + 1}`
                }
              />
            ) : null}
          </div>
        ))}
      </div>

      {/* ── Overlay content (title, badges) ── */}
      {overlayContent && (
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <div className="pointer-events-auto">{overlayContent}</div>
        </div>
      )}

      {/* ── Dot indicators — same style as the hero ── */}
      {items.length > 1 && (
        <div
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3"
          role="tablist"
          aria-label="Media navigation"
        >
          {items.map((item, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={index === current}
              aria-label={`${item.type === "video" ? "Video" : "Image"} ${index + 1} of ${items.length}`}
              suppressHydrationWarning
              onClick={() => setCurrent(index)}
              className={`rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                // Video dots are slightly wider pills to distinguish them
                item.type === "video"
                  ? "h-3 w-6"
                  : "w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4"
              } ${
                index === current
                  ? "bg-terracotta scale-110 shadow-lg ring-1 sm:ring-2 ring-white/50"
                  : "bg-white/60 hover:bg-white/80 backdrop-blur-sm"
              }`}
            />
          ))}
        </div>
      )}

      {/* ── Expand button (images only) ── */}
      {onOpenLightbox && items[current]?.type === "image" && (
        <button
          onClick={() => onOpenLightbox(current)}
          className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="View image fullscreen"
        >
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
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
            />
          </svg>
        </button>
      )}

      {/* ── Screen-reader live region ── */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {items[current]?.type === "video"
          ? `Video ${current + 1} of ${items.length}${items[current].videoTitle ? `: ${items[current].videoTitle}` : ""}`
          : `Image ${current + 1} of ${items.length}${items[current]?.alt ? `: ${items[current].alt}` : ""}`}
      </div>
    </section>
  );
}
