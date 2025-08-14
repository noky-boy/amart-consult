"use client"

import { Facebook, Twitter, Linkedin, Link, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface SocialShareProps {
  url: string
  title: string
  description?: string
  className?: string
}

export default function SocialShare({ url, title, description, className = "" }: SocialShareProps) {
  const shareUrl = encodeURIComponent(url)
  const shareTitle = encodeURIComponent(title)
  const shareDescription = encodeURIComponent(description || "")

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400")
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy link")
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600 mr-2">Share:</span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("facebook")}
        className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
      >
        <Facebook className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("twitter")}
        className="border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white"
      >
        <Twitter className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("linkedin")}
        className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
      >
        <Linkedin className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white bg-transparent"
      >
        <Link className="w-4 h-4" />
      </Button>

      {/* Native share button for mobile */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNativeShare}
        className="border-indigo-deep text-indigo-deep hover:bg-indigo-deep hover:text-white md:hidden bg-transparent"
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
