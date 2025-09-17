import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomPortableText } from "@/sanity/lib/portable-text";
import { client } from "@/sanity/lib/client";
import { blogPostBySlugQuery } from "@/sanity/lib/queries";
import type { BlogPost } from "@/sanity/lib/types";

// Get blog post by slug
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return await client.fetch(blogPostBySlugQuery, { slug });
}

// Get related posts (same category or tags)
async function getRelatedPosts(currentPost: BlogPost): Promise<BlogPost[]> {
  const relatedQuery = `
    *[_type == "blogPost" && slug.current != $slug && (
      category == $category || 
      tags[] match $tags[]
    ) && publishedAt < now()] | order(publishedAt desc) [0...3] {
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
  `;

  return await client.fetch(relatedQuery, {
    slug: currentPost.slug.current,
    category: currentPost.category,
    tags: currentPost.tags || [],
  });
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params);

  // Fetch blog post data
  const post = use(getBlogPost(unwrappedParams.slug));

  if (!post) {
    notFound();
  }

  // Fetch related posts
  const relatedPosts = use(getRelatedPosts(post));

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post.title;

  // Calculate read time (rough estimate based on content)
  const calculateReadTime = (content: any[]) => {
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

  const readTime = calculateReadTime(post.content);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        {post.featuredImage?.url && (
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <span className="bg-terracotta text-white px-4 py-2 rounded-full text-sm font-medium">
                {post.category
                  ? post.category.charAt(0).toUpperCase() +
                    post.category.slice(1).replace("-", " ")
                  : "Article"}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center text-white/90 text-sm md:text-base">
              <User className="h-5 w-5 mr-2" />
              <span className="mr-6">
                {post.author?.name || "Amart Consult Team"}
              </span>
              <Calendar className="h-5 w-5 mr-2" />
              <span className="mr-6">
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
              <Clock className="h-5 w-5 mr-2" />
              <span>{readTime}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <article className="lg:w-2/3">
            {/* Back Button */}
            <Link
              href="/blog"
              className="inline-flex items-center text-indigo-deep hover:text-terracotta mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>

            {/* Article Content */}
            <div className="mb-8">
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                {post.excerpt}
              </p>
              <CustomPortableText value={post.content} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-200">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Social Actions */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <Heart className="h-5 w-5" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                  <span>Comments</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600 mr-2">Share:</span>
                <a
                  href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    shareUrl
                  )}&text=${encodeURIComponent(shareTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href={`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(
                    shareTitle
                  )}&body=${encodeURIComponent(shareUrl)}`}
                  className="p-2 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">
                Leave a Comment
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Your Name" />
                  <Input type="email" placeholder="Your Email" />
                </div>
                <Textarea placeholder="Your Comment" rows={4} />
                <Button className="bg-indigo-deep hover:bg-indigo-deep/90">
                  Post Comment
                </Button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-8">
              {/* Author Bio */}
              {post.author && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {post.author.image ? (
                        <Image
                          src={post.author.image}
                          alt={post.author.name}
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-indigo-deep rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {post.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      )}
                      <div>
                        <h3 className="font-serif font-bold text-gray-900">
                          {post.author.name}
                        </h3>
                        <p className="text-sm text-gray-600">Author</p>
                      </div>
                    </div>
                    {post.author.bio && (
                      <p className="text-gray-600 text-sm">{post.author.bio}</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">
                      Related Articles
                    </h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <Link
                          key={relatedPost._id}
                          href={`/blog/${relatedPost.slug.current}`}
                          className="block group"
                        >
                          <div className="flex gap-3">
                            {relatedPost.featuredImage?.url && (
                              <Image
                                src={relatedPost.featuredImage.url}
                                alt={
                                  relatedPost.featuredImage.alt ||
                                  relatedPost.title
                                }
                                width={80}
                                height={60}
                                className="w-20 h-15 object-cover rounded flex-shrink-0"
                              />
                            )}
                            <div>
                              <h4 className="font-medium text-gray-900 group-hover:text-indigo-deep transition-colors line-clamp-2 text-sm">
                                {relatedPost.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(
                                  relatedPost.publishedAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Newsletter Signup */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">
                    Stay Updated
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Get the latest architectural insights delivered to your
                    inbox.
                  </p>
                  <div className="space-y-3">
                    <Input type="email" placeholder="Your email address" />
                    <Button className="w-full bg-indigo-deep hover:bg-indigo-deep/90">
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
