"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Gift, CheckCircle } from "lucide-react"

interface NewsletterSignupProps {
  variant?: "homepage" | "sidebar" | "footer" | "popup"
  showIncentive?: boolean
}

export default function NewsletterSignup({ variant = "homepage", showIncentive = true }: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    setIsLoading(false)
    setEmail("")
  }

  if (isSubmitted) {
    return (
      <Card className="bg-gradient-to-r from-indigo-50 to-terracotta-50 border-indigo-200">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">Thank You!</h3>
          <p className="text-indigo-700">
            You've been subscribed to our newsletter. Check your email for a welcome message!
          </p>
        </CardContent>
      </Card>
    )
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "homepage":
        return "bg-gradient-to-r from-indigo-50 to-terracotta-50 border-indigo-200"
      case "sidebar":
        return "bg-white border-gray-200 shadow-sm"
      case "footer":
        return "bg-indigo-900 border-indigo-700 text-white"
      case "popup":
        return "bg-white border-gray-200 shadow-xl"
      default:
        return "bg-white border-gray-200"
    }
  }

  const getTextStyles = () => {
    return variant === "footer" ? "text-white" : "text-gray-900"
  }

  const getSubtextStyles = () => {
    return variant === "footer" ? "text-indigo-100" : "text-gray-600"
  }

  return (
    <Card className={getVariantStyles()}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${variant === "footer" ? "bg-indigo-800" : "bg-indigo-100"}`}>
            <Mail className={`h-5 w-5 ${variant === "footer" ? "text-indigo-200" : "text-indigo-600"}`} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${getTextStyles()}`}>
              {variant === "popup" ? "Before You Go!" : "Stay Updated"}
            </h3>
            <p className={`text-sm ${getSubtextStyles()}`}>Get the latest architectural insights</p>
          </div>
        </div>

        {showIncentive && (
          <div
            className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
              variant === "footer" ? "bg-indigo-800" : "bg-gradient-to-r from-terracotta-50 to-indigo-50"
            }`}
          >
            <Gift className={`h-4 w-4 ${variant === "footer" ? "text-terracotta-200" : "text-terracotta-600"}`} />
            <span className={`text-sm font-medium ${variant === "footer" ? "text-indigo-100" : "text-terracotta-700"}`}>
              Free Ghana Building Cost Calculator included!
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={
              variant === "footer" ? "bg-indigo-800 border-indigo-600 text-white placeholder:text-indigo-300" : ""
            }
          />
          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              variant === "footer"
                ? "bg-terracotta-600 hover:bg-terracotta-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {isLoading ? "Subscribing..." : "Subscribe Now"}
          </Button>
        </form>

        <p className={`text-xs mt-3 ${getSubtextStyles()}`}>
          No spam, unsubscribe at any time. We respect your privacy.
        </p>
      </CardContent>
    </Card>
  )
}
