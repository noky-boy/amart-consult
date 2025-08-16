import { groq } from "next-sanity"

// Service Queries
export const servicesQuery = groq`
  *[_type == "service"] | order(_createdAt asc) {
    _id,
    title,
    slug,
    description,
    icon,
    features,
    process,
    "image": image.asset->url,
    content,
    seo
  }
`

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    icon,
    features,
    process,
    "image": image.asset->url,
    content,
    seo
  }
`

// Package Queries
export const packagesQuery = groq`
  *[_type == "package"] | order(popular desc, price asc) {
    _id,
    name,
    slug,
    description,
    price,
    currency,
    features,
    popular,
    category
  }
`

export const packagesByCategory = groq`
  *[_type == "package" && category == $category] | order(popular desc, price asc) {
    _id,
    name,
    slug,
    description,
    price,
    currency,
    features,
    popular,
    category
  }
`

export const popularPackagesQuery = groq`
  *[_type == "package" && popular == true] | order(price asc) {
    _id,
    name,
    slug,
    description,
    price,
    currency,
    features,
    popular,
    category
  }
`

// Portfolio Queries
export const portfolioQuery = groq`
  *[_type == "portfolio"] | order(featured desc, completionDate desc) {
    _id,
    title,
    slug,
    description,
    category,
    location,
    completionDate,
    client,
    projectValue,
    currency,
    "images": images[]{
      "url": asset->url,
      "alt": alt,
      "caption": caption
    },
    featured,
    "services": services[]->title
  }
`

export const portfolioBySlugQuery = groq`
  *[_type == "portfolio" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    category,
    location,
    completionDate,
    client,
    projectValue,
    currency,
    "images": images[]{
      "url": asset->url,
      "alt": alt,
      "caption": caption
    },
    featured,
    "services": services[]->{
      _id,
      title,
      slug
    },
    content,
    seo
  }
`

export const portfolioByCategoryQuery = groq`
  *[_type == "portfolio" && category == $category] | order(featured desc, completionDate desc) {
    _id,
    title,
    slug,
    description,
    category,
    location,
    completionDate,
    client,
    projectValue,
    currency,
    "images": images[]{
      "url": asset->url,
      "alt": alt,
      "caption": caption
    },
    featured,
    "services": services[]->title
  }
`

export const featuredPortfolioQuery = groq`
  *[_type == "portfolio" && featured == true] | order(completionDate desc) [0...6] {
    _id,
    title,
    slug,
    description,
    category,
    location,
    completionDate,
    "images": images[0]{
      "url": asset->url,
      "alt": alt,
      "caption": caption
    },
    featured
  }
`

// Blog Queries
export const blogPostsQuery = groq`
  *[_type == "blogPost" && publishedAt < now()] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "author": author{
      name,
      "image": image.asset->url,
      bio
    },
    publishedAt,
    "featuredImage": {
      "url": featuredImage.asset->url,
      "alt": featuredImage.alt
    },
    category,
    tags,
    featured
  }
`

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    "author": author{
      name,
      "image": image.asset->url,
      bio
    },
    publishedAt,
    "featuredImage": {
      "url": featuredImage.asset->url,
      "alt": featuredImage.alt
    },
    category,
    tags,
    content,
    featured,
    seo
  }
`

export const featuredBlogPostsQuery = groq`
  *[_type == "blogPost" && featured == true && publishedAt < now()] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    "author": author{
      name,
      "image": image.asset->url,
      bio
    },
    publishedAt,
    "featuredImage": {
      "url": featuredImage.asset->url,
      "alt": featuredImage.alt
    },
    category,
    tags
  }
`

export const blogPostsByCategoryQuery = groq`
  *[_type == "blogPost" && category == $category && publishedAt < now()] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "author": author{
      name,
      "image": image.asset->url,
      bio
    },
    publishedAt,
    "featuredImage": {
      "url": featuredImage.asset->url,
      "alt": featuredImage.alt
    },
    category,
    tags,
    featured
  }
`

// Testimonial Queries
export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(featured desc, date desc) {
    _id,
    name,
    company,
    position,
    content,
    rating,
    "image": image.asset->url,
    "project": project->{
      _id,
      title,
      slug
    },
    featured,
    date
  }
`

export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && featured == true] | order(date desc) [0...6] {
    _id,
    name,
    company,
    position,
    content,
    rating,
    "image": image.asset->url,
    "project": project->{
      _id,
      title,
      slug
    },
    date
  }
`

// FAQ Queries
export const faqsQuery = groq`
  *[_type == "faq"] | order(order asc, _createdAt asc) {
    _id,
    question,
    answer,
    category,
    order,
    featured
  }
`

export const faqsByCategoryQuery = groq`
  *[_type == "faq" && category == $category] | order(order asc, _createdAt asc) {
    _id,
    question,
    answer,
    category,
    order,
    featured
  }
`

export const featuredFaqsQuery = groq`
  *[_type == "faq" && featured == true] | order(order asc, _createdAt asc) [0...8] {
    _id,
    question,
    answer,
    category,
    order
  }
`

// Combined Queries for Homepage
export const homepageDataQuery = groq`
{
  "featuredPortfolio": *[_type == "portfolio" && featured == true] | order(completionDate desc) [0...6] {
    _id,
    title,
    slug,
    description,
    category,
    location,
    "images": images[0]{
      "url": asset->url,
      "alt": alt,
      "caption": caption
    }
  },
  "featuredBlogPosts": *[_type == "blogPost" && featured == true && publishedAt < now()] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    "author": author{
      name,
      "image": image.asset->url
    },
    publishedAt,
    "featuredImage": {
      "url": featuredImage.asset->url,
      "alt": featuredImage.alt
    },
    category
  },
  "featuredTestimonials": *[_type == "testimonial" && featured == true] | order(date desc) [0...3] {
    _id,
    name,
    company,
    position,
    content,
    rating,
    "image": image.asset->url
  },
  "popularPackages": *[_type == "package" && popular == true] | order(price asc) [0...3] {
    _id,
    name,
    slug,
    description,
    price,
    currency,
    features,
    category
  }
}
`

// Search Queries
export const searchQuery = groq`
  *[_type in ["portfolio", "blogPost", "service"] && (
    title match $searchTerm + "*" ||
    description match $searchTerm + "*" ||
    content[].children[].text match $searchTerm + "*"
  )] | order(_score desc) [0...20] {
    _type,
    _id,
    title,
    slug,
    description,
    "image": select(
      _type == "portfolio" => images[0].asset->url,
      _type == "blogPost" => featuredImage.asset->url,
      _type == "service" => image.asset->url
    )
  }
`

// Sitemap Queries
export const sitemapQuery = groq`
{
  "services": *[_type == "service"] {
    "slug": slug.current,
    "_updatedAt": _updatedAt
  },
  "portfolio": *[_type == "portfolio"] {
    "slug": slug.current,
    "_updatedAt": _updatedAt
  },
  "blogPosts": *[_type == "blogPost" && publishedAt < now()] {
    "slug": slug.current,
    "_updatedAt": _updatedAt,
    "publishedAt": publishedAt
  }
}
`
