import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Sample featured blog posts for homepage
const featuredPosts = [
  {
    id: 1,
    title: "5 Essential Considerations for Building in Ghana's Climate",
    excerpt: "Discover the key factors that make buildings resilient and comfortable in Ghana's tropical climate.",
    category: "Design Tips",
    author: "Kwame Asante",
    date: "2024-01-15",
    readTime: "8 min read",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    title: "Design-to-Build vs. Traditional Approach: Why It Matters",
    excerpt: "Explore the advantages of integrated design-build services and how they can save time and money.",
    category: "Industry Insights",
    author: "Kofi Mensah",
    date: "2024-01-05",
    readTime: "6 min read",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 5,
    title: "Case Study: Modern Villa in East Legon",
    excerpt:
      "Take a detailed look at our award-winning residential project that blends contemporary and traditional design.",
    category: "Project Spotlights",
    author: "Kwame Asante",
    date: "2023-12-20",
    readTime: "15 min read",
    image: "/placeholder.svg?height=300&width=400",
  },
]

export default function BlogPreview() {
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
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <span className="mr-4">{new Date(post.date).toLocaleDateString()}</span>
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-4">{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-indigo-deep transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.id}`}
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
