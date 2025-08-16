import { format, parseISO } from "date-fns"

// Date formatting utilities
export function formatDate(dateString: string, formatString = "MMMM d, yyyy"): string {
  return format(parseISO(dateString), formatString)
}

export function formatDateRelative(dateString: string): string {
  const date = parseISO(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "Today"
  if (diffInDays === 1) return "Yesterday"
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return `${Math.floor(diffInDays / 365)} years ago`
}

// Content utilities
export function getExcerpt(content: any[], maxLength = 160): string {
  if (!content || !Array.isArray(content)) return ""

  const textBlocks = content.filter((block) => block._type === "block")
  const text = textBlocks.map((block) => block.children?.map((child: any) => child.text).join("") || "").join(" ")

  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

// SEO utilities
export function generateMetadata(item: any, type: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amartconsult.com"

  return {
    title: item.seo?.metaTitle || item.title,
    description: item.seo?.metaDescription || item.description || item.excerpt,
    openGraph: {
      title: item.seo?.metaTitle || item.title,
      description: item.seo?.metaDescription || item.description || item.excerpt,
      url: `${baseUrl}/${type}/${item.slug.current}`,
      images: item.featuredImage?.url || item.images?.[0]?.url || item.image,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: item.seo?.metaTitle || item.title,
      description: item.seo?.metaDescription || item.description || item.excerpt,
      images: item.featuredImage?.url || item.images?.[0]?.url || item.image,
    },
  }
}

// Category utilities
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    residential: "bg-blue-100 text-blue-800",
    commercial: "bg-green-100 text-green-800",
    industrial: "bg-purple-100 text-purple-800",
    renovation: "bg-orange-100 text-orange-800",
    architecture: "bg-indigo-100 text-indigo-800",
    construction: "bg-yellow-100 text-yellow-800",
    design: "bg-pink-100 text-pink-800",
    tips: "bg-teal-100 text-teal-800",
    "industry-news": "bg-red-100 text-red-800",
  }

  return colors[category] || "bg-gray-100 text-gray-800"
}

// Price formatting utilities
export function formatPrice(price: number, currency = "GHS"): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Rating utilities
export function renderStars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating)
}

// Slug utilities
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}
