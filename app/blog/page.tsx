"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Calendar, User, ArrowRight, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "5 Essential Considerations for Building in Ghana's Climate",
    excerpt:
      "Discover the key factors that make buildings resilient and comfortable in Ghana's tropical climate, from ventilation design to material selection.",
    content: "Building in Ghana's tropical climate requires careful consideration of environmental factors...",
    category: "Design Tips",
    author: "Kwame Asante",
    date: "2024-01-15",
    readTime: "8 min read",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    tags: ["Climate Design", "Tropical Architecture", "Ventilation"],
  },
  {
    id: 2,
    title: "Navigating Ghana's Building Permit Process: A Complete Guide",
    excerpt:
      "A comprehensive walkthrough of obtaining building permits in Ghana, including timelines, documentation, and common pitfalls to avoid.",
    content: "Understanding Ghana's building permit process is crucial for any construction project...",
    category: "Construction Guidance",
    author: "Ama Osei",
    date: "2024-01-10",
    readTime: "12 min read",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    tags: ["Permits", "Legal", "Construction Process"],
  },
  {
    id: 3,
    title: "Design-to-Build vs. Traditional Approach: Why It Matters",
    excerpt:
      "Explore the advantages of integrated design-build services and how they can save time, money, and ensure better project outcomes.",
    content: "The design-to-build approach represents a paradigm shift in construction...",
    category: "Industry Insights",
    author: "Kofi Mensah",
    date: "2024-01-05",
    readTime: "6 min read",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    tags: ["Design-Build", "Project Management", "Efficiency"],
  },
  {
    id: 4,
    title: "Sustainable Materials for West African Construction",
    excerpt:
      "Learn about eco-friendly building materials that perform well in West Africa's climate while supporting local economies.",
    content: "Sustainability in construction goes beyond environmental impact...",
    category: "Design Tips",
    author: "Akosua Darko",
    date: "2023-12-28",
    readTime: "10 min read",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    tags: ["Sustainability", "Local Materials", "Eco-Friendly"],
  },
  {
    id: 5,
    title: "Case Study: Modern Villa in East Legon",
    excerpt:
      "Take a detailed look at our award-winning residential project that seamlessly blends contemporary design with traditional Ghanaian elements.",
    content: "This stunning villa in East Legon represents the perfect marriage of modern luxury...",
    category: "Project Spotlights",
    author: "Kwame Asante",
    date: "2023-12-20",
    readTime: "15 min read",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    tags: ["Residential", "Modern Design", "Case Study"],
  },
  {
    id: 6,
    title: "Working with International Clients: Cultural Considerations",
    excerpt:
      "Best practices for architects working with diaspora clients and international investors in Ghana's growing construction market.",
    content: "Ghana's growing economy has attracted significant international investment...",
    category: "International Clients",
    author: "Ama Osei",
    date: "2023-12-15",
    readTime: "9 min read",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    tags: ["International", "Cultural Sensitivity", "Client Relations"],
  },
]

const categories = [
  "All",
  "Design Tips",
  "Construction Guidance",
  "Project Spotlights",
  "Industry Insights",
  "International Clients",
]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const featuredPosts = filteredPosts.filter((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-deep via-indigo-deep/95 to-indigo-deep/90 text-white py-16 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Architecture Insights</h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Expert perspectives on design, construction, and architectural innovation in Ghana and beyond
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Category Filters */}
              {showFilters && (
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-indigo-deep hover:bg-indigo-deep/90" : ""}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Featured Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPosts.map((post) => (
                    <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          width={600}
                          height={300}
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
              </div>
            )}

            {/* Regular Posts */}
            {regularPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Latest Articles</h2>
                <div className="space-y-6">
                  {regularPosts.map((post) => (
                    <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/3">
                          <div className="relative overflow-hidden rounded-l-lg h-48 sm:h-full">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              width={400}
                              height={200}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="bg-terracotta text-white px-3 py-1 rounded-full text-sm font-medium">
                                {post.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <CardContent className="sm:w-2/3 p-6">
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
                          <p className="text-gray-600 mb-4">{post.excerpt}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag) => (
                              <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <Link
                            href={`/blog/${post.id}`}
                            className="inline-flex items-center text-indigo-deep hover:text-terracotta font-medium transition-colors"
                          >
                            Read More
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Link>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("All")
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-8 space-y-8">
              {/* Newsletter Signup */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">Stay Updated</h3>
                  <p className="text-gray-600 mb-4">
                    Get the latest architectural insights and project updates delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <Input type="email" placeholder="Your email address" />
                    <Button className="w-full bg-indigo-deep hover:bg-indigo-deep/90">Subscribe</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Categories */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">Popular Categories</h3>
                  <div className="space-y-2">
                    {categories.slice(1).map((category) => {
                      const count = blogPosts.filter((post) => post.category === category).length
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className="flex justify-between items-center w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-gray-700">{category}</span>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{count}</span>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">Recent Posts</h3>
                  <div className="space-y-4">
                    {blogPosts.slice(0, 3).map((post) => (
                      <Link key={post.id} href={`/blog/${post.id}`} className="block group">
                        <div className="flex gap-3">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            width={80}
                            height={60}
                            className="w-20 h-15 object-cover rounded flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 group-hover:text-indigo-deep transition-colors line-clamp-2 text-sm">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">{new Date(post.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
