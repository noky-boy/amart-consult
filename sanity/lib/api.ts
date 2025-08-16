import { client } from "./client"
import {
  servicesQuery,
  serviceBySlugQuery,
  packagesQuery,
  packagesByCategory,
  popularPackagesQuery,
  portfolioQuery,
  portfolioBySlugQuery,
  portfolioByCategoryQuery,
  featuredPortfolioQuery,
  blogPostsQuery,
  blogPostBySlugQuery,
  featuredBlogPostsQuery,
  blogPostsByCategoryQuery,
  testimonialsQuery,
  featuredTestimonialsQuery,
  faqsQuery,
  faqsByCategoryQuery,
  featuredFaqsQuery,
  homepageDataQuery,
  searchQuery,
  sitemapQuery,
} from "./queries"
import type { Service, ServicePackage, Portfolio, BlogPost, Testimonial, FAQ } from "./types"

// Cache configuration
const CACHE_TAGS = {
  services: "services",
  packages: "packages",
  portfolio: "portfolio",
  blog: "blog",
  testimonials: "testimonials",
  faqs: "faqs",
} as const

// Service API functions
export async function getServices(): Promise<Service[]> {
  return client.fetch(servicesQuery, {}, { next: { tags: [CACHE_TAGS.services] } })
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return client.fetch(serviceBySlugQuery, { slug }, { next: { tags: [CACHE_TAGS.services] } })
}

// Package API functions
export async function getPackages(): Promise<ServicePackage[]> {
  return client.fetch(packagesQuery, {}, { next: { tags: [CACHE_TAGS.packages] } })
}

export async function getPackagesByCategory(category: string): Promise<ServicePackage[]> {
  return client.fetch(packagesByCategory, { category }, { next: { tags: [CACHE_TAGS.packages] } })
}

export async function getPopularPackages(): Promise<ServicePackage[]> {
  return client.fetch(popularPackagesQuery, {}, { next: { tags: [CACHE_TAGS.packages] } })
}

// Portfolio API functions
export async function getPortfolio(): Promise<Portfolio[]> {
  return client.fetch(portfolioQuery, {}, { next: { tags: [CACHE_TAGS.portfolio] } })
}

export async function getPortfolioBySlug(slug: string): Promise<Portfolio | null> {
  return client.fetch(portfolioBySlugQuery, { slug }, { next: { tags: [CACHE_TAGS.portfolio] } })
}

export async function getPortfolioByCategory(category: string): Promise<Portfolio[]> {
  return client.fetch(portfolioByCategoryQuery, { category }, { next: { tags: [CACHE_TAGS.portfolio] } })
}

export async function getFeaturedPortfolio(): Promise<Portfolio[]> {
  return client.fetch(featuredPortfolioQuery, {}, { next: { tags: [CACHE_TAGS.portfolio] } })
}

// Blog API functions
export async function getBlogPosts(): Promise<BlogPost[]> {
  return client.fetch(blogPostsQuery, {}, { next: { tags: [CACHE_TAGS.blog] } })
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return client.fetch(blogPostBySlugQuery, { slug }, { next: { tags: [CACHE_TAGS.blog] } })
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  return client.fetch(featuredBlogPostsQuery, {}, { next: { tags: [CACHE_TAGS.blog] } })
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  return client.fetch(blogPostsByCategoryQuery, { category }, { next: { tags: [CACHE_TAGS.blog] } })
}

// Testimonial API functions
export async function getTestimonials(): Promise<Testimonial[]> {
  return client.fetch(testimonialsQuery, {}, { next: { tags: [CACHE_TAGS.testimonials] } })
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  return client.fetch(featuredTestimonialsQuery, {}, { next: { tags: [CACHE_TAGS.testimonials] } })
}

// FAQ API functions
export async function getFAQs(): Promise<FAQ[]> {
  return client.fetch(faqsQuery, {}, { next: { tags: [CACHE_TAGS.faqs] } })
}

export async function getFAQsByCategory(category: string): Promise<FAQ[]> {
  return client.fetch(faqsByCategoryQuery, { category }, { next: { tags: [CACHE_TAGS.faqs] } })
}

export async function getFeaturedFAQs(): Promise<FAQ[]> {
  return client.fetch(featuredFaqsQuery, {}, { next: { tags: [CACHE_TAGS.faqs] } })
}

// Combined API functions
export async function getHomepageData() {
  return client.fetch(
    homepageDataQuery,
    {},
    {
      next: {
        tags: [CACHE_TAGS.portfolio, CACHE_TAGS.blog, CACHE_TAGS.testimonials, CACHE_TAGS.packages],
      },
    },
  )
}

// Search API function
export async function searchContent(searchTerm: string) {
  return client.fetch(searchQuery, { searchTerm })
}

// Sitemap API function
export async function getSitemapData() {
  return client.fetch(sitemapQuery)
}

// Utility functions
export async function getAllSlugs(type: "service" | "portfolio" | "blogPost") {
  const query = `*[_type == "${type}"] { "slug": slug.current }`
  return client.fetch(query)
}

export async function getContentCount(type: string) {
  const query = `count(*[_type == "${type}"])`
  return client.fetch(query)
}

// Revalidation functions for ISR
export function revalidateContent(tags: string[]) {
  // This would be used with Next.js revalidateTag function
  // Implementation depends on your revalidation strategy
  return tags
}
