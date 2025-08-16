"use client"

import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

interface SanityImageProps {
  image: SanityImageSource
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
}

export function SanityImage({
  image,
  alt,
  width = 800,
  height = 600,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: SanityImageProps) {
  if (!image) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-gray-400">No image</span>
      </div>
    )
  }

  const imageUrl = urlFor(image).width(width).height(height).url()

  return (
    <Image
      src={imageUrl || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  )
}
