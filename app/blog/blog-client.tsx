"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  User,
  ArrowRight,
  Filter,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import NewsletterSignup from "@/components/newsletter-signup";
import OptimizedImage from "@/components/optimized-image";
import type { BlogPost } from "@/sanity/lib/types";

interface BlogClientComponentProps {
  blogPosts: BlogPost[];
  categories: string[];
}

export default function BlogClientComponent({
  blogPosts,
  categories,
}: BlogClientComponentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags &&
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ));
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogPosts, searchTerm, selectedCategory]);

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  // Calculate read time helper function
  const calculateReadTime = (content: any[]) => {
    if (!content) return "5 min read";
    const wordsPerMinute = 200;
    const textContent =
      content
        ?.map((block) =>
          block._type === "block"
            ? block.children?.map((child: any) => child.text).join(" ")
            : ""
        )
        .join(" ") || "";

    const wordCount = textContent.split(" ").length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  if (blogPosts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Blog Posts Available
          </h2>
          <p className="text-gray-600">
            We're working on adding some great content. Please check back later!
          </p>
        </div>
      </div>
    );
  }

  return (
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
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:w-auto"
              >
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
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-indigo-deep hover:bg-indigo-deep/90"
                        : ""
                    }
                  >
                    {category === "All"
                      ? "All"
                      : category.charAt(0).toUpperCase() +
                        category.slice(1).replace("-", " ")}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                Featured Articles
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <Card
                    key={post._id}
                    className="group hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative overflow-hidden rounded-t-lg">
                      <OptimizedImage
                        src={post.featuredImage?.url || "/placeholder.svg"}
                        alt={post.featuredImage?.alt || post.title}
                        aspectRatio="4:3"
                        objectFit="cover"
                        className="w-full group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={85}
                        placeholder="blur"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-terracotta text-white px-3 py-1 rounded-full text-sm font-medium">
                          {post.category
                            ? post.category.charAt(0).toUpperCase() +
                              post.category.slice(1).replace("-", " ")
                            : "Article"}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="mr-4">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                        <User className="h-4 w-4 mr-1" />
                        <span className="mr-4">
                          {post.author?.name || "Amart Team"}
                        </span>
                        <span>{calculateReadTime(post.content)}</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-indigo-deep transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <Link
                        href={`/blog/${post.slug.current}`}
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
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                Latest Articles
              </h2>
              <div className="space-y-6">
                {regularPosts.map((post) => (
                  <Card
                    key={post._id}
                    className="group hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/3">
                        <div className="relative overflow-hidden rounded-l-lg">
                          <OptimizedImage
                            src={post.featuredImage?.url || "/placeholder.svg"}
                            alt={post.featuredImage?.alt || post.title}
                            aspectRatio="4:3"
                            objectFit="cover"
                            className="w-full group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, 33vw"
                            quality={80}
                            placeholder="blur"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-terracotta text-white px-3 py-1 rounded-full text-sm font-medium">
                              {post.category
                                ? post.category.charAt(0).toUpperCase() +
                                  post.category.slice(1).replace("-", " ")
                                : "Article"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="sm:w-2/3 p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-4">
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                          <User className="h-4 w-4 mr-1" />
                          <span className="mr-4">
                            {post.author?.name || "Amart Team"}
                          </span>
                          <span>{calculateReadTime(post.content)}</span>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-indigo-deep transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <Link
                          href={`/blog/${post.slug.current}`}
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
              <p className="text-gray-500 text-lg">
                No articles found matching your criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
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
            <NewsletterSignup variant="sidebar" showIncentive={true} />

            {/* Popular Categories */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">
                  Popular Categories
                </h3>
                <div className="space-y-2">
                  {categories.slice(1).map((category) => {
                    const count = blogPosts.filter(
                      (post) => post.category === category
                    ).length;
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="flex justify-between items-center w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-700">
                          {category.charAt(0).toUpperCase() +
                            category.slice(1).replace("-", " ")}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">
                  Recent Posts
                </h3>
                <div className="space-y-4">
                  {blogPosts.slice(0, 3).map((post) => (
                    <Link
                      key={post._id}
                      href={`/blog/${post.slug.current}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <OptimizedImage
                          src={post.featuredImage?.url || "/placeholder.svg"}
                          alt={post.featuredImage?.alt || post.title}
                          width={80}
                          height={60}
                          aspectRatio="4:3"
                          objectFit="cover"
                          className="w-20 flex-shrink-0 rounded"
                          sizes="80px"
                          quality={75}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900 group-hover:text-indigo-deep transition-colors line-clamp-2 text-sm">
                            {post.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </p>
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
  );
}
