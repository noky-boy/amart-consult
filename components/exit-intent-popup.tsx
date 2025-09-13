"use client"

import { useState, useEffect } from "react"
import { X } from "@/components/ui/icons"
import NewsletterSignup from "./newsletter-signup"

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown && window.innerWidth >= 768) {
        setIsVisible(true)
        setHasShown(true)
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [hasShown])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 z-10"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
        <NewsletterSignup variant="popup" showIncentive={true} />
      </div>
    </div>
  )
}
