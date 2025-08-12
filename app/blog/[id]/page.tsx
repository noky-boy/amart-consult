"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, User, Clock, ArrowLeft, Facebook, Twitter, Linkedin, Mail, Heart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Extended blog data with full content
const blogPosts = [
  {
    id: 1,
    title: "5 Essential Considerations for Building in Ghana's Climate",
    excerpt:
      "Discover the key factors that make buildings resilient and comfortable in Ghana's tropical climate, from ventilation design to material selection.",
    content: `
      <p>Building in Ghana's tropical climate requires careful consideration of environmental factors that can significantly impact both the comfort and longevity of structures. With high humidity, intense rainfall, and year-round warm temperatures, architects and builders must adapt their approaches to create buildings that not only withstand these conditions but thrive in them.</p>

      <h2>1. Ventilation and Airflow Design</h2>
      <p>Proper ventilation is crucial in Ghana's humid climate. Cross-ventilation should be prioritized in every room, with strategically placed windows and openings that allow hot air to escape while drawing in cooler air. Consider incorporating:</p>
      <ul>
        <li>High ceilings to allow hot air to rise and escape</li>
        <li>Clerestory windows for stack ventilation</li>
        <li>Covered outdoor spaces that encourage airflow</li>
        <li>Orientation that takes advantage of prevailing winds</li>
      </ul>

      <h2>2. Material Selection for Humidity</h2>
      <p>Materials must be chosen for their ability to resist moisture, mold, and decay. Local materials often perform better as they've evolved to handle the climate:</p>
      <ul>
        <li>Use treated hardwoods or composite materials for structural elements</li>
        <li>Select paints and finishes with anti-fungal properties</li>
        <li>Consider locally-sourced clay bricks which naturally regulate humidity</li>
        <li>Avoid materials prone to rust or corrosion without proper treatment</li>
      </ul>

      <h2>3. Roofing for Heavy Rains</h2>
      <p>Ghana's rainy season brings intense downpours that can overwhelm inadequate roofing systems. Design considerations include:</p>
      <ul>
        <li>Steep roof pitches for rapid water runoff</li>
        <li>Oversized gutters and downspouts</li>
        <li>Quality waterproofing membranes</li>
        <li>Extended eaves to protect walls from driving rain</li>
      </ul>

      <h2>4. Energy-Efficient Cooling Solutions</h2>
      <p>Reducing reliance on air conditioning through passive design strategies can significantly lower energy costs:</p>
      <ul>
        <li>Light-colored roofing materials to reflect heat</li>
        <li>Insulation in roof spaces to reduce heat transfer</li>
        <li>Shading devices for windows and outdoor spaces</li>
        <li>Natural cooling through courtyards and water features</li>
      </ul>

      <h2>5. Pest Prevention in Construction</h2>
      <p>Termites and other pests are significant concerns in tropical climates. Prevention strategies include:</p>
      <ul>
        <li>Proper foundation design with termite barriers</li>
        <li>Regular inspection access points</li>
        <li>Avoiding wood-to-soil contact</li>
        <li>Using pest-resistant materials where possible</li>
      </ul>

      <p>By addressing these five key areas, builders in Ghana can create structures that are not only comfortable and durable but also energy-efficient and cost-effective to maintain. The key is understanding that working with the climate, rather than against it, leads to better outcomes for both occupants and the environment.</p>
    `,
    category: "Design Tips",
    author: "Kwame Asante",
    date: "2024-01-15",
    readTime: "8 min read",
    image: "/placeholder.svg?height=600&width=1200",
    featured: true,
    tags: ["Climate Design", "Tropical Architecture", "Ventilation"],
  },
  {
    id: 2,
    title: "Navigating Ghana's Building Permit Process: A Complete Guide",
    excerpt:
      "A comprehensive walkthrough of obtaining building permits in Ghana, including timelines, documentation, and common pitfalls to avoid.",
    content: `
      <p>Understanding Ghana's building permit process is crucial for any construction project, whether you're building a family home or a commercial complex. This comprehensive guide will walk you through every step, helping you avoid common delays and ensure your project starts on solid legal ground.</p>

      <h2>Required Documentation</h2>
      <p>Before beginning the permit application process, ensure you have all necessary documents:</p>
      <ul>
        <li><strong>Land Title Documents:</strong> Proof of ownership or lease agreement</li>
        <li><strong>Site Plan:</strong> Detailed survey showing property boundaries</li>
        <li><strong>Architectural Drawings:</strong> Floor plans, elevations, and sections</li>
        <li><strong>Structural Drawings:</strong> Foundation and structural details</li>
        <li><strong>Environmental Impact Assessment:</strong> Required for larger projects</li>
        <li><strong>Fire Safety Plan:</strong> Escape routes and safety measures</li>
      </ul>

      <h2>Timeline Expectations</h2>
      <p>The permit process typically follows this timeline:</p>
      <ul>
        <li><strong>Week 1-2:</strong> Document submission and initial review</li>
        <li><strong>Week 3-4:</strong> Technical review by various departments</li>
        <li><strong>Week 5-6:</strong> Site inspection and verification</li>
        <li><strong>Week 7-8:</strong> Final approval and permit issuance</li>
      </ul>
      <p>However, this can extend to 12-16 weeks if documents are incomplete or revisions are required.</p>

      <h2>Common Delays and How to Avoid Them</h2>
      <p>Most delays stem from preventable issues:</p>
      <ul>
        <li><strong>Incomplete Documentation:</strong> Double-check all requirements before submission</li>
        <li><strong>Non-Compliance with Setbacks:</strong> Ensure your design meets local zoning requirements</li>
        <li><strong>Missing Signatures:</strong> All drawings must be signed and stamped by licensed professionals</li>
        <li><strong>Utility Clearances:</strong> Obtain necessary approvals from water, electricity, and telecom providers</li>
      </ul>

      <h2>Working with Local Authorities</h2>
      <p>Building positive relationships with local authorities can significantly smooth the process:</p>
      <ul>
        <li>Schedule pre-submission meetings to discuss your project</li>
        <li>Be responsive to requests for additional information</li>
        <li>Maintain professional communication throughout</li>
        <li>Consider hiring a local consultant familiar with the process</li>
      </ul>

      <h2>Cost Breakdown</h2>
      <p>Permit costs vary by project size and location, but typically include:</p>
      <ul>
        <li><strong>Application Fee:</strong> GHS 200-500</li>
        <li><strong>Plan Examination Fee:</strong> 0.5-1% of construction cost</li>
        <li><strong>Permit Fee:</strong> 1-2% of construction cost</li>
        <li><strong>Inspection Fees:</strong> GHS 100-300 per inspection</li>
      </ul>

      <p>While the permit process may seem daunting, proper preparation and understanding of requirements can make it straightforward. Remember, obtaining proper permits protects your investment and ensures your building meets safety standards. When in doubt, consult with experienced local professionals who can guide you through the process efficiently.</p>
    `,
    category: "Construction Guidance",
    author: "Ama Osei",
    date: "2024-01-10",
    readTime: "12 min read",
    image: "/placeholder.svg?height=600&width=1200",
    featured: false,
    tags: ["Permits", "Legal", "Construction Process"],
  },
  {
    id: 3,
    title: "Design-to-Build vs. Traditional Approach: Why It Matters",
    excerpt:
      "Explore the advantages of integrated design-build services and how they can save time, money, and ensure better project outcomes.",
    content: `
      <p>The design-to-build approach represents a paradigm shift in construction project delivery, offering significant advantages over traditional design-bid-build methods. Understanding these differences can help you make informed decisions about your next construction project.</p>

      <h2>Communication Benefits</h2>
      <p>In traditional approaches, architects and contractors work separately, often leading to miscommunication and conflicting interpretations of plans. Design-build eliminates this by creating a single point of responsibility:</p>
      <ul>
        <li>Direct communication between design and construction teams</li>
        <li>Real-time problem-solving during the design phase</li>
        <li>Unified project vision from concept to completion</li>
        <li>Reduced potential for disputes and finger-pointing</li>
      </ul>

      <h2>Cost Control Advantages</h2>
      <p>Cost overruns are common in traditional projects due to design changes and unforeseen construction challenges. Design-build offers better cost control through:</p>
      <ul>
        <li><strong>Early Cost Input:</strong> Contractors provide pricing feedback during design</li>
        <li><strong>Value Engineering:</strong> Continuous optimization of design for cost efficiency</li>
        <li><strong>Reduced Change Orders:</strong> Fewer surprises during construction</li>
        <li><strong>Fixed-Price Contracts:</strong> Greater budget certainty from the start</li>
      </ul>

      <h2>Quality Assurance</h2>
      <p>Quality control is enhanced when design and construction teams work together:</p>
      <ul>
        <li>Constructability reviews during design prevent field problems</li>
        <li>Material selection considers both design intent and construction practicality</li>
        <li>Continuous quality monitoring throughout the process</li>
        <li>Single-source accountability for project quality</li>
      </ul>

      <h2>Timeline Efficiency</h2>
      <p>Design-build projects typically complete 23% faster than traditional projects:</p>
      <ul>
        <li><strong>Overlapping Phases:</strong> Construction can begin before design is 100% complete</li>
        <li><strong>Streamlined Decision Making:</strong> Fewer parties involved in approvals</li>
        <li><strong>Reduced Bidding Time:</strong> No separate contractor selection process</li>
        <li><strong>Fast-Track Scheduling:</strong> Parallel work streams where possible</li>
      </ul>

      <h2>Client Peace of Mind</h2>
      <p>Perhaps most importantly, design-build offers clients greater peace of mind:</p>
      <ul>
        <li>Single point of contact for all project issues</li>
        <li>Unified warranty covering both design and construction</li>
        <li>Reduced risk of disputes between design and construction teams</li>
        <li>Greater predictability in outcomes</li>
      </ul>

      <h2>When Design-Build Works Best</h2>
      <p>Design-build is particularly effective for:</p>
      <ul>
        <li>Projects with tight timelines</li>
        <li>Complex technical requirements</li>
        <li>Clients who prefer single-source responsibility</li>
        <li>Projects where cost certainty is crucial</li>
      </ul>

      <p>While design-build isn't suitable for every project, it offers compelling advantages for clients seeking efficiency, cost control, and quality outcomes. The key is choosing a design-build team with proven experience and a track record of successful project delivery.</p>
    `,
    category: "Industry Insights",
    author: "Kofi Mensah",
    date: "2024-01-05",
    readTime: "6 min read",
    image: "/placeholder.svg?height=600&width=1200",
    featured: true,
    tags: ["Design-Build", "Project Management", "Efficiency"],
  },
]

// Related posts function
const getRelatedPosts = (currentPost: any) => {
  return blogPosts
    .filter(
      (post) =>
        post.id !== currentPost.id &&
        (post.category === currentPost.category || post.tags.some((tag) => currentPost.tags.includes(tag))),
    )
    .slice(0, 3)
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10)
  const [showComments, setShowComments] = useState(false)

  const post = blogPosts.find((p) => p.id === Number.parseInt(params.id))

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(post)

  const handleLike = () => {
    setLiked(!liked)
    setLikes((prev) => (liked ? prev - 1 : prev + 1))
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareTitle = post.title

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <span className="bg-terracotta text-white px-4 py-2 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">{post.title}</h1>
            <div className="flex items-center text-white/90 text-sm md:text-base">
              <User className="h-5 w-5 mr-2" />
              <span className="mr-6">{post.author}</span>
              <Calendar className="h-5 w-5 mr-2" />
              <span className="mr-6">{new Date(post.date).toLocaleDateString()}</span>
              <Clock className="h-5 w-5 mr-2" />
              <span>{post.readTime}</span>
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
            <div className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="text-gray-700 leading-relaxed [&>h2]:text-2xl [&>h2]:font-serif [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-serif [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:mb-6 [&>ul]:mb-6 [&>ul]:pl-6 [&>li]:mb-2 [&>strong]:text-gray-900 [&>strong]:font-semibold"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-200">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Social Actions */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    liked ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                  <span>{likes}</span>
                </button>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Comments</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600 mr-2">Share:</span>
                <a
                  href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href={`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`}
                  className="p-2 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">Leave a Comment</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Your Name" />
                    <Input type="email" placeholder="Your Email" />
                  </div>
                  <Textarea placeholder="Your Comment" rows={4} />
                  <Button className="bg-indigo-deep hover:bg-indigo-deep/90">Post Comment</Button>
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-8">
              {/* Author Bio */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-indigo-deep rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-gray-900">{post.author}</h3>
                      <p className="text-sm text-gray-600">Senior Architect</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Experienced architect specializing in sustainable design and tropical climate construction.
                  </p>
                </CardContent>
              </Card>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`} className="block group">
                          <div className="flex gap-3">
                            <Image
                              src={relatedPost.image || "/placeholder.svg"}
                              alt={relatedPost.title}
                              width={80}
                              height={60}
                              className="w-20 h-15 object-cover rounded flex-shrink-0"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900 group-hover:text-indigo-deep transition-colors line-clamp-2 text-sm">
                                {relatedPost.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(relatedPost.date).toLocaleDateString()}
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
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">Stay Updated</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Get the latest architectural insights delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <Input type="email" placeholder="Your email address" />
                    <Button className="w-full bg-indigo-deep hover:bg-indigo-deep/90">Subscribe</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
