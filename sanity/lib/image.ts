// sanity/lib/image.ts
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  if (!source) return "/placeholder.svg";

  // 🔥 FIX: If source already has a URL, return it directly
  if (typeof source === "object" && "url" in source && source.url) {
    return source.url as string;
  }

  try {
    return builder.image(source).url();
  } catch (error) {
    console.error("Error building image URL:", error);
    return "/placeholder.svg";
  }
}

export function getImageDimensions(image: any) {
  if (!image?.asset?._ref) return { width: 800, height: 600 };

  try {
    const dimensions = image.asset._ref.split("-")[2];
    const [width, height] = dimensions.split("x").map(Number);
    return { width: width > 0 ? width : 800, height: height || 600 };
  } catch (error) {
    console.error("Error parsing image dimensions:", error);
    return { width: 800, height: 600 };
  }
}

// 🔥 NEW: Add a helper for building images with transformations
export function buildImageUrl(
  source: SanityImageSource,
  width?: number,
  height?: number
) {
  if (!source) return "/placeholder.svg";

  // If source already has a URL, return it with optional query params
  if (typeof source === "object" && "url" in source && source.url) {
    const url = source.url as string;
    if (!width && !height) return url;

    // Add Sanity CDN transformation params
    const params = new URLSearchParams();
    if (width) params.append("w", width.toString());
    if (height) params.append("h", height.toString());
    params.append("fit", "max");
    return `${url}?${params.toString()}`;
  }

  try {
    let imageBuilder = builder.image(source);
    if (width) imageBuilder = imageBuilder.width(width);
    if (height) imageBuilder = imageBuilder.height(height);
    return imageBuilder.url();
  } catch (error) {
    console.error("Error building image URL:", error);
    return "/placeholder.svg";
  }
}
