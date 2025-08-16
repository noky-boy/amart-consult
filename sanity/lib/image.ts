import imageUrlBuilder from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { client } from "./client"

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export function getImageDimensions(image: any) {
  if (!image?.asset?._ref) return { width: 0, height: 0 }

  const dimensions = image.asset._ref.split("-")[2]
  const [width, height] = dimensions.split("x").map(Number)

  return { width, height }
}
