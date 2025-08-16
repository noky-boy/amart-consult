import Link from "next/link"
import { Calendar, User, ArrowRight } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import OptimizedImage from "./optimized-image"
import type { BlogPost } from "@/sanity/lib/types"
import { formatDate } from "@/lib/sanity-utils"

interface BlogPreviewProps {
  posts?: BlogPost[]
}

export default function BlogPreview({ posts = [] }: BlogPreviewProps) {
  const featuredPosts =
    posts.length > 0
      ? posts.map((post) => ({
          id: post._id,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category || "Insights",
          author: post.author?.name || "Amart Consult Team",
          date: post.publishedAt,
          readTime: "5 min read", // Could be calculated from content
          image: post.featuredImage?.url || "/placeholder.svg?height=300&width=400",
          slug: post.slug.current,
        }))
      : [
          // Fallback static data
          {
            id: "1",
            title: "5 Essential Considerations for Building in Ghana's Climate",
            excerpt:
              "Discover the key factors that make buildings resilient and comfortable in Ghana's tropical climate.",
            category: "Design Tips",
            author: "Kwame Asante",
            date: "2024-01-15T00:00:00Z",
            readTime: "8 min read",
            image: "/placeholder.svg?height=300&width=400",
            slug: "building-ghana-climate",
          },
          {
            id: "2",
            title: "Design-to-Build vs. Traditional Approach: Why It Matters",
            excerpt: "Explore the advantages of integrated design-build services and how they can save time and money.",
            category: "Industry Insights",
            author: "Kofi Mensah",
            date: "2024-01-05T00:00:00Z",
            readTime: "6 min read",
            image: "/placeholder.svg?height=300&width=400",
            slug: "design-to-build-approach",
          },
          {
            id: "3",
            title: "Case Study: Modern Villa in East Legon",
            excerpt:
              "Take a detailed look at our award-winning residential project that blends contemporary and traditional design.",
            category: "Project Spotlights",
            author: "Kwame Asante",
            date: "2023-12-20T00:00:00Z",
            readTime: "15 min read",
            image: "/placeholder.svg?height=300&width=400",
            slug: "modern-villa-east-legon-case-study",
          },
        ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Latest Insights & Expertise</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with our latest thoughts on architecture, construction best practices, and industry trends.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300">
              <div className="relative overflow-hidden rounded-t-lg">
                <OptimizedImage
                  src={post.image}
                  alt={post.title}
                  aspectRatio="4:3"
                  objectFit="cover"
                  className="w-full group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={80}
                  placeholder="blur"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-terracotta text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-4">{formatDate(post.date)}</span>
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-4">{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-indigo-deep transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-indigo-deep hover:text-terracotta font-medium transition-colors"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/blog">
            <Button size="lg" className="bg-indigo-deep hover:bg-indigo-deep/90">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
