"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Download, Calculator, FileText, Users, Shield, Star } from "lucide-react"
import Image from "next/image"

export default function GhanaBuildingCalculatorPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-terracotta-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-indigo-900 mb-4">Thank You!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your Ghana Building Cost Calculator & Guide is being sent to your email right now.
            </p>

            <Card className="bg-white border-indigo-200 shadow-lg mb-8">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-indigo-900 mb-4">What's Next?</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <p className="text-gray-700">Check your email for the download link</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <p className="text-gray-700">You'll receive our welcome email series over the next 5 days</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <p className="text-gray-700">Get monthly insights on Ghana's construction industry</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                <a href="/">Return to Homepage</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-terracotta-600 text-terracotta-600 hover:bg-terracotta-50 bg-transparent"
              >
                <a href="/services">Explore Our Services</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-terracotta-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-terracotta-100 text-terracotta-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              FREE Download - Limited Time
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-6">
              Ghana Building Cost Calculator & Complete Guide
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get accurate construction cost estimates for your Ghana building project. Includes material costs, labor
              rates, and expert insights from Nathan Amarkwei's 10+ years of experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Form Section */}
            <Card className="bg-white border-indigo-200 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <Download className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-indigo-900">Get Your Free Calculator</h2>
                    <p className="text-gray-600">Instant download - No spam, ever</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-terracotta-600 hover:bg-terracotta-700 text-white text-lg font-semibold"
                  >
                    {isLoading ? "Sending..." : "Download Free Calculator"}
                  </Button>
                </form>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  By downloading, you agree to receive helpful construction tips via email. Unsubscribe anytime with one
                  click.
                </p>
              </CardContent>
            </Card>

            {/* Preview Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-indigo-100">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="Calculator Preview"
                  width={400}
                  height={300}
                  className="w-full rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">What's Included:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">Excel calculator with 50+ cost categories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">2024 Ghana material price database</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">Regional cost variations (Accra, Kumasi, Tamale)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">20-page construction guide PDF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-indigo-900 mb-12">
              Why 2,500+ Builders Trust Our Calculator
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="p-4 bg-indigo-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Calculator className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-indigo-900 mb-2">Accurate Estimates</h3>
                <p className="text-gray-600">Based on real Ghana market data and 10+ years of local experience</p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-terracotta-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-terracotta-600" />
                </div>
                <h3 className="text-xl font-semibold text-indigo-900 mb-2">Complete Guide</h3>
                <p className="text-gray-600">Step-by-step construction process with local regulations and permits</p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-indigo-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-indigo-900 mb-2">Expert Support</h3>
                <p className="text-gray-600">Access to our team for questions and project consultations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-indigo-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Shield className="h-6 w-6 text-indigo-600" />
              <span className="text-indigo-900 font-semibold">Trusted by Ghana's Top Builders</span>
            </div>
            <blockquote className="text-lg text-gray-700 italic mb-6">
              "This calculator saved me over GH₵50,000 on my last project. The accuracy is incredible, and Nathan's
              insights are invaluable for anyone building in Ghana."
            </blockquote>
            <cite className="text-indigo-900 font-semibold">- Kwame Asante, Property Developer, Accra</cite>
          </div>
        </div>
      </div>
    </div>
  )
}
