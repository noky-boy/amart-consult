"use client"

import { useState, useEffect } from "react"
import { Instagram, ExternalLink, Heart, MessageCircle } from "@/components/ui/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface InstagramPost {
  id: string
  media_url: string
  media_type: string
  caption: string
  permalink: string
  timestamp: string
  like_count?: number
  comments_count?: number
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)

  // Mock Instagram posts data (in production, this would come from Instagram API)
  const mockPosts: InstagramPost[] = [
    {
      id: "1",
      media_url: "/placeholder.svg?height=300&width=300",
      media_type: "IMAGE",
      caption:
        "Stunning modern residential design in East Legon, Accra. Clean lines and contemporary aesthetics. #AmartConsult #ModernArchitecture #Ghana",
      permalink: "https://instagram.com/p/example1",
      timestamp: "2024-01-15T10:00:00Z",
      like_count: 245,
      comments_count: 12,
    },
    {
      id: "2",
      media_url: "/placeholder.svg?height=300&width=300",
      media_type: "IMAGE",
      caption:
        "Progress update on our commercial project in Kumasi. Foundation work completed! #Construction #Progress #AmartConsult",
      permalink: "https://instagram.com/p/example2",
      timestamp: "2024-01-12T14:30:00Z",
      like_count: 189,
      comments_count: 8,
    },
    {
      id: "3",
      media_url: "/placeholder.svg?height=300&width=300",
      media_type: "IMAGE",
      caption:
        "Interior design concept for luxury villa. Blending traditional Ghanaian elements with modern comfort. #InteriorDesign #Luxury",
      permalink: "https://instagram.com/p/example3",
      timestamp: "2024-01-10T09:15:00Z",
      like_count: 312,
      comments_count: 18,
    },
    {
      id: "4",
      media_url: "/placeholder.svg?height=300&width=300",
      media_type: "IMAGE",
      caption:
        "Detailed architectural drawings for upcoming residential project. Precision in every line. #Architecture #Design #Blueprints",
      permalink: "https://instagram.com/p/example4",
      timestamp: "2024-01-08T16:45:00Z",
      like_count: 156,
      comments_count: 6,
    },
    {
      id: "5",
      media_url: "/placeholder.svg?height=300&width=300",
      media_type: "IMAGE",
      caption:
        "3D visualization of proposed office complex in Tema. Bringing visions to life! #3DRendering #Visualization #AmartConsult",
      permalink: "https://instagram.com/p/example5",
      timestamp: "2024-01-05T11:20:00Z",
      like_count: 278,
      comments_count: 15,
    },
    {
      id: "6",
      media_url: "/placeholder.svg?height=300&width=300",
      media_type: "IMAGE",
      caption:
        "Our amazing construction team at work. Quality craftsmanship is our priority. #TeamWork #Construction #Quality",
      permalink: "https://instagram.com/p/example6",
      timestamp: "2024-01-03T13:00:00Z",
      like_count: 203,
      comments_count: 9,
    },
  ]

  useEffect(() => {
    // Simulate API call
    const fetchInstagramPosts = async () => {
      setLoading(true)
      // In production, this would be an actual Instagram API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setPosts(mockPosts)
      setLoading(false)
    }

    fetchInstagramPosts()
  }, [])

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const truncateCaption = (caption: string, maxLength = 100) => {
    if (caption.length <= maxLength) return caption
    return caption.substring(0, maxLength) + "..."
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-sand-beige/10 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-4">Follow Our Journey</h2>
            <p className="text-gray-600">See our latest projects and behind-the-scenes content</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-sand-beige/10 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-indigo-deep">Follow Our Journey</h2>
          </div>
          <p className="text-gray-600 mb-6">See our latest projects and behind-the-scenes content on Instagram</p>

          <Button
            onClick={() => window.open("https://instagram.com/amartconsult", "_blank")}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white"
          >
            <Instagram className="w-4 h-4 mr-2" />
            Follow @amartconsult
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              onClick={() => window.open(post.permalink, "_blank")}
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={post.media_url || "/placeholder.svg"}
                  alt="Instagram post"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center space-y-2">
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.like_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments_count}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 mx-auto" />
                  </div>
                </div>

                {/* Date badge */}
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {formatDate(post.timestamp)}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Caption preview for latest post */}
        {posts.length > 0 && (
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-indigo-deep/5 to-terracotta/5 border-indigo-deep/20">
            <CardHeader>
              <CardTitle className="text-lg text-indigo-deep flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-500" />
                Latest Post
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{truncateCaption(posts[0].caption, 200)}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>{posts[0].like_count} likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span>{posts[0].comments_count} comments</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(posts[0].permalink, "_blank")}
                  className="border-indigo-deep text-indigo-deep hover:bg-indigo-deep hover:text-white"
                >
                  View Post
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
