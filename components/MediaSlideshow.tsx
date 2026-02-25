"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { buildImageUrl } from "@/sanity/lib/image";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NormalisedMediaItem {
  type: "image" | "video";
  imageUrl?: string;
  alt?: string;
  caption?: string;
  assetRef?: string;
  videoUrl?: string;
  posterUrl?: string;
  videoTitle?: string;
}

export type MediaSlideItem = NormalisedMediaItem;

interface MediaSlideshowProps {
  media?: any[];
  legacyImages?: any[];
  projectTitle: string;
  overlayContent?: React.ReactNode;
  onOpenLightbox?: (index: number) => void;
}

// ─── normaliseMedia ───────────────────────────────────────────────────────────

export function normaliseMedia(
  media: any[] | undefined,
  legacyImages: any[] | undefined,
): NormalisedMediaItem[] {
  if (media && media.length > 0) {
    return media
      .map((item: any): NormalisedMediaItem | null => {
        if (item._type === "imageItem") {
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
          // Try every possible field name — the query now returns both
          // videoFileUrl (Sanity-hosted file) and videoUrl (external link).
          // We pick whichever one is actually populated.
          const videoUrl: string | undefined =
            item.videoFileUrl || // Sanity file upload → asset->url
            item.videoUrl || // external URL field
            item.url || // catch-all
            undefined;

          const posterUrl: string | undefined =
            item.posterUrl || item.posterImage?.asset?.url || undefined;

          // Log so you can see exactly what came back from Sanity
          if (process.env.NODE_ENV === "development") {
            console.log("[MediaSlideshow] videoItem raw:", item);
            console.log("[MediaSlideshow] resolved videoUrl:", videoUrl);
          }

          // Keep the item even if videoUrl is undefined — it will render
          // the poster image as a still frame instead of crashing
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
      // ↓ Reduced height — fits in viewport without needing to scroll
      className="relative h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh] overflow-hidden"
      aria-label={`${projectTitle} media showcase`}
    >
      {/* Stacked slides — opacity fade between them, same as the hero */}
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
                <div className="relative w-full h-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.alt ?? `${projectTitle} — image ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1920px"
                    quality={85}
                    className="object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
              </>
            ) : item.type === "video" ? (
              item.videoUrl ? (
                // Video plays silently like a background image
                <video
                  src={item.videoUrl}
                  poster={item.posterUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  aria-label={item.videoTitle ?? `${projectTitle} — video`}
                />
              ) : item.posterUrl ? (
                // No URL yet — show poster as a still image fallback
                // (also renders while the video is loading)
                <div className="relative w-full h-full">
                  <Image
                    src={item.posterUrl}
                    alt={item.videoTitle ?? `${projectTitle} — video poster`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1920px"
                    quality={85}
                    className="object-cover object-center opacity-80"
                  />
                  {/* Play icon overlay so user knows it's a video */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/40 rounded-full p-5">
                      <svg
                        className="w-10 h-10 fill-white"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : null
            ) : null}
          </div>
        ))}
      </div>

      {/* Overlay content (title, badges) */}
      {overlayContent && (
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <div className="pointer-events-auto">{overlayContent}</div>
        </div>
      )}

      {/* Dot indicators */}
      {items.length > 1 && (
        <div
          className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex space-x-2"
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
                item.type === "video"
                  ? "h-2.5 w-5"
                  : "w-2.5 h-2.5 sm:w-3 sm:h-3"
              } ${
                index === current
                  ? "bg-terracotta scale-110 shadow-lg"
                  : "bg-white/60 hover:bg-white/80 backdrop-blur-sm"
              }`}
            />
          ))}
        </div>
      )}

      {/* Expand button for images */}
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

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {items[current]?.type === "video"
          ? `Video ${current + 1} of ${items.length}`
          : `Image ${current + 1} of ${items.length}`}
      </div>
    </section>
  );
}
