import { Suspense } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  User,
  ArrowRight,
  Filter,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NewsletterSignup from "@/components/newsletter-signup";
import OptimizedImage from "@/components/optimized-image";
import { client } from "@/sanity/lib/client";
import { blogPostsQuery } from "@/sanity/lib/queries";
import type { BlogPost } from "@/sanity/lib/types";
import BlogClientComponent from "./blog-client";

// Server-side function to fetch blog posts
async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    return await client.fetch(blogPostsQuery);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

// Categories derived from your Sanity schema
const categories = [
  "All",
  "architecture",
  "construction",
  "design",
  "tips",
  "industry-news",
];

// Server component (no CSP issues)
export default async function BlogPage() {
  // Fetch blog posts on the server
  const blogPosts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-deep via-indigo-deep/95 to-indigo-deep/90 text-white py-16 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Architecture Insights
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Expert perspectives on design, construction, and architectural
              innovation in Ghana and beyond
            </p>
          </div>
        </div>
      </section>

      {/* Pass data to client component for interactivity */}
      <Suspense fallback={<BlogLoadingSkeleton />}>
        <BlogClientComponent blogPosts={blogPosts} categories={categories} />
      </Suspense>
    </div>
  );
}

// Loading skeleton component
function BlogLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded mb-8"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
