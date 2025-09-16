"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  aspectRatio?: "4:3" | "16:9" | "1:1" | "3:2";
  objectFit?: "cover" | "contain" | "fill";
  sizes?: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onClick?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = "",
  priority = false,
  aspectRatio = "4:3",
  objectFit = "cover",
  // In optimized-image.tsx, update the sizes prop default:
  sizes = "(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1440px) 100vw, 100vw",
  quality = 85,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onClick,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const getAspectRatioDimensions = () => {
    switch (aspectRatio) {
      case "4:3":
        return { width: width, height: Math.round(width * 0.75) };
      case "16:9":
        return { width: width, height: Math.round(width * 0.5625) };
      case "1:1":
        return { width: width, height: width };
      case "3:2":
        return { width: width, height: Math.round(width * 0.667) };
      default:
        return { width, height };
    }
  };

  const dimensions = getAspectRatioDimensions();

  const generateBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${dimensions.width}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" textAnchor="middle" dy=".3em" fill="#9ca3af" fontFamily="Arial, sans-serif" fontSize="14">Loading...</text>
      </svg>`
    ).toString("base64")}`;
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: aspectRatio }}
      onClick={onClick}
    >
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        placeholder={placeholder === "blur" ? "blur" : "empty"}
        blurDataURL={placeholder === "blur" ? generateBlurDataURL() : undefined}
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${
          objectFit === "cover"
            ? "object-cover"
            : objectFit === "contain"
            ? "object-contain"
            : "object-fill"
        }`}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        unoptimized={false}
      />

      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm text-center">
            <div className="mb-2">⚠️</div>
            <div>Image failed to load</div>
          </div>
        </div>
      )}
    </div>
  );
}
