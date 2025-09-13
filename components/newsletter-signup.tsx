"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Download, Award, CheckCircle } from "@/components/ui/icons"

interface NewsletterSignupProps {
  variant?: "homepage" | "sidebar" | "footer" | "popup"
  showIncentive?: boolean
}

export default function NewsletterSignup({ variant = "homepage", showIncentive = true }: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: name || undefined,
          source: variant,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe")
      }

      setIsSubmitted(true)
      setEmail("")
      setName("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="bg-gradient-to-r from-indigo-50 to-terracotta-50 border-indigo-200">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">Thank You!</h3>
          <p className="text-indigo-700 mb-4">
            You've been subscribed to our newsletter. Check your email for a welcome message and your free building
            guide!
          </p>
          <Button
            onClick={() => window.open("/lead-magnet/ghana-building-calculator", "_blank")}
            variant="outline"
            className="border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Free Guide
          </Button>
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
            <Award className={`h-4 w-4 ${variant === "footer" ? "text-terracotta-200" : "text-terracotta-600"}`} />
            <span className={`text-sm font-medium ${variant === "footer" ? "text-indigo-100" : "text-terracotta-700"}`}>
              Free Ghana Building Cost Calculator included!
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {variant === "homepage" || variant === "popup" ? (
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={
                variant === "footer" ? "bg-indigo-800 border-indigo-600 text-white placeholder:text-indigo-300" : ""
              }
            />
          ) : null}

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

          {error && <p className="text-red-500 text-sm">{error}</p>}

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
