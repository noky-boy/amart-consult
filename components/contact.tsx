"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Upload,
  User,
  Building,
  Calendar,
  DollarSign,
} from "lucide-react"

interface ContactFormData {
  name: string
  email: string
  phone: string
  projectType: string
  location: string
  budgetRange: string
  serviceInterest: string[]
  message: string
  files: File[]
}

interface QuoteFormData {
  projectType: string
  location: string
  timeline: string
  serviceTier: string
  budgetRange: string
  requirements: string
  name: string
  email: string
  phone: string
  additionalDetails: string
  files: File[]
}

export default function Contact() {
  const [activeTab, setActiveTab] = useState<"contact" | "quote">("contact")
  const [quoteStep, setQuoteStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    location: "",
    budgetRange: "",
    serviceInterest: [],
    message: "",
    files: [],
  })

  const [quoteForm, setQuoteForm] = useState<QuoteFormData>({
    projectType: "",
    location: "",
    timeline: "",
    serviceTier: "",
    budgetRange: "",
    requirements: "",
    name: "",
    email: "",
    phone: "",
    additionalDetails: "",
    files: [],
  })

  const projectTypes = [
    "New Residential Construction",
    "Commercial Building",
    "Home Renovation",
    "Interior Design",
    "Landscape Architecture",
    "Other",
  ]

  const budgetRanges = [
    "Under GHS 50,000",
    "GHS 50,000 - 200,000",
    "GHS 200,000 - 500,000",
    "GHS 500,000+",
    "Prefer not to say",
  ]

  const timelines = [
    "ASAP (Within 1 month)",
    "1-3 months",
    "3-6 months",
    "6-12 months",
    "More than 1 year",
    "Just exploring options",
  ]

  const serviceTiers = [
    {
      id: "tier1",
      name: "Essential Package",
      description: "Basic architectural drawings and permits",
      price: "From GHS 15,000",
    },
    {
      id: "tier2",
      name: "Design & Visualization Package",
      description: "Complete design with 3D renderings",
      price: "From GHS 35,000",
      popular: true,
    },
    {
      id: "tier3",
      name: "Full-Service Package",
      description: "End-to-end project management",
      price: "From GHS 75,000",
    },
  ]

  const validateContactForm = () => {
    const newErrors: Record<string, string> = {}

    if (!contactForm.name.trim()) newErrors.name = "Name is required"
    if (!contactForm.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(contactForm.email)) newErrors.email = "Email is invalid"
    if (!contactForm.phone.trim()) newErrors.phone = "Phone is required"
    if (!contactForm.projectType) newErrors.projectType = "Project type is required"
    if (!contactForm.location.trim()) newErrors.location = "Location is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateQuoteStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!quoteForm.projectType) newErrors.projectType = "Project type is required"
        if (!quoteForm.location.trim()) newErrors.location = "Location is required"
        if (!quoteForm.timeline) newErrors.timeline = "Timeline is required"
        break
      case 2:
        if (!quoteForm.serviceTier) newErrors.serviceTier = "Service tier is required"
        break
      case 3:
        if (!quoteForm.budgetRange) newErrors.budgetRange = "Budget range is required"
        if (!quoteForm.requirements.trim()) newErrors.requirements = "Requirements are required"
        break
      case 4:
        if (!quoteForm.name.trim()) newErrors.name = "Name is required"
        if (!quoteForm.email.trim()) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(quoteForm.email)) newErrors.email = "Email is invalid"
        if (!quoteForm.phone.trim()) newErrors.phone = "Phone is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateContactForm()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateQuoteStep(5)) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleQuoteNext = () => {
    if (validateQuoteStep(quoteStep)) {
      setQuoteStep((prev) => Math.min(prev + 1, 5))
    }
  }

  const handleQuotePrev = () => {
    setQuoteStep((prev) => Math.max(prev - 1, 1))
  }

  const handleServiceInterestChange = (service: string) => {
    setContactForm((prev) => ({
      ...prev,
      serviceInterest: prev.serviceInterest.includes(service)
        ? prev.serviceInterest.filter((s) => s !== service)
        : [...prev.serviceInterest, service],
    }))
  }

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      "Hello Amart Consult! I'm interested in your architectural services and would like to discuss my project.",
    )
    window.open(`https://wa.me/233123456789?text=${message}`, "_blank")
  }

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 bg-gradient-to-br from-sand-beige/20 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-4">Thank You!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Your {activeTab === "contact" ? "message" : "quote request"} has been received. We'll get back to you
                within 24 hours.
              </p>
            </div>

            <Card className="p-6 bg-white border-l-4 border-l-terracotta">
              <h3 className="font-semibold text-indigo-deep mb-4">What happens next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-terracotta text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    1
                  </div>
                  <p className="text-gray-600">
                    We'll review your {activeTab === "contact" ? "inquiry" : "project details"} and prepare a response
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-terracotta text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    2
                  </div>
                  <p className="text-gray-600">Our team will contact you within 24 hours to discuss your project</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-terracotta text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    3
                  </div>
                  <p className="text-gray-600">We'll schedule a consultation to understand your vision better</p>
                </div>
              </div>
            </Card>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  setIsSubmitted(false)
                  setActiveTab("contact")
                  setQuoteStep(1)
                }}
                variant="outline"
                className="border-indigo-deep text-indigo-deep hover:bg-indigo-deep hover:text-white"
              >
                Submit Another Request
              </Button>
              <Button onClick={handleWhatsAppContact} className="bg-green-500 hover:bg-green-600 text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-sand-beige/20 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-indigo-deep mb-4">Let's Build Your Vision Together</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to start your architectural journey? Get in touch with us for a consultation or request a detailed
            quote for your project.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Call Us Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-sand/20 border border-sand/30 p-8 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-terracotta/10 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-terracotta/5 to-indigo-deep/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[200px]">
              <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-terracotta-warm rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-serif font-bold text-xl text-indigo-deep mb-3 text-center">Call Us</h3>
              <a
                href="tel:+233543543356"
                className="text-lg font-semibold text-terracotta hover:text-terracotta-warm transition-colors duration-200 block mb-2 text-center break-words"
              >
                +233 54 354 3356
              </a>
              <p className="text-sm text-gray-600 mb-4 text-center">Mon-Fri 8AM-6PM</p>
              <a
                href="https://linko.page/ry6zcs6o1qsu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm text-indigo-deep hover:text-terracotta transition-colors duration-300 font-medium"
              >
                <User className="h-4 w-4" />
                <span>Save Contact</span>
              </a>
              <div className="w-12 h-0.5 bg-gradient-to-r from-terracotta to-terracotta-warm mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Email Us Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-sand/20 border border-sand/30 p-8 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-terracotta/10 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-terracotta/5 to-indigo-deep/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[200px]">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-deep to-indigo-deep/80 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-serif font-bold text-xl text-indigo-deep mb-3 text-center">Email Us</h3>
              <a
                href="mailto:amartconsult1@gmail.com"
                className="text-lg font-semibold text-terracotta hover:text-terracotta-warm transition-colors duration-200 block mb-2 text-center break-all"
              >
                amartconsult1@gmail.com
              </a>
              <p className="text-sm text-gray-600 mb-4 text-center">We respond within 24hrs</p>
              <a
                href="https://linko.page/ry6zcs6o1qsu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm text-indigo-deep hover:text-terracotta transition-colors duration-300 font-medium"
              >
                <User className="h-4 w-4" />
                <span>Save Contact</span>
              </a>
              <div className="w-12 h-0.5 bg-gradient-to-r from-terracotta to-terracotta-warm mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Visit Us Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-sand/20 border border-sand/30 p-8 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-terracotta/10 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-terracotta/5 to-indigo-deep/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[200px]">
              <div className="w-16 h-16 bg-gradient-to-br from-terracotta-warm to-terracotta rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-serif font-bold text-xl text-indigo-deep mb-3 text-center">Visit Us</h3>
              <button
                onClick={() => window.open("https://maps.google.com/?q=Accra,Ghana", "_blank")}
                className="text-lg font-semibold text-terracotta hover:text-terracotta-warm transition-colors duration-200 block mb-2 cursor-pointer text-center"
              >
                Accra, Ghana
              </button>
              <p className="text-sm text-gray-600 mb-4 text-center">By appointment only</p>
              <div className="w-12 h-0.5 bg-gradient-to-r from-terracotta to-terracotta-warm mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>

        {/* Form Tabs */}
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setActiveTab("contact")}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === "contact"
                    ? "bg-indigo-deep text-white shadow-md"
                    : "text-indigo-deep hover:bg-indigo-deep/10"
                }`}
              >
                Quick Contact
              </button>
              <button
                onClick={() => setActiveTab("quote")}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === "quote"
                    ? "bg-indigo-deep text-white shadow-md"
                    : "text-indigo-deep hover:bg-indigo-deep/10"
                }`}
              >
                Request Quote
              </button>
            </div>
          </div>

          {/* Contact Form */}
          {activeTab === "contact" && (
            <Card className="p-8">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-serif text-indigo-deep">Get In Touch</CardTitle>
                <p className="text-gray-600">Tell us about your project and we'll get back to you within 24 hours</p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <Input
                        value={contactForm.name}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <Input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <Input
                        value={contactForm.phone}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="+233 123 456 789"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
                      <select
                        value={contactForm.projectType}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, projectType: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-deep ${
                          errors.projectType ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.projectType && <p className="text-red-500 text-sm mt-1">{errors.projectType}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location in Ghana *</label>
                      <Input
                        value={contactForm.location}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., Accra, Kumasi, Tamale"
                        className={errors.location ? "border-red-500" : ""}
                      />
                      {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                      <select
                        value={contactForm.budgetRange}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, budgetRange: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-deep"
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Interest</label>
                    <div className="flex flex-wrap gap-3">
                      {serviceTiers.map((tier) => (
                        <label key={tier.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={contactForm.serviceInterest.includes(tier.name)}
                            onChange={() => handleServiceInterestChange(tier.name)}
                            className="mr-2"
                          />
                          <span className="text-sm">{tier.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell us about your project, timeline, and any specific requirements..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files (Optional)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-deep transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Upload site photos or inspiration images</p>
                      <p className="text-xs text-gray-500 mt-1">Max 10MB per file. JPG, PNG, PDF accepted.</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-indigo-deep hover:bg-indigo-deep/90 text-white py-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      onClick={handleWhatsAppContact}
                      variant="outline"
                      className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white bg-transparent"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat on WhatsApp
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Quote Request Form */}
          {activeTab === "quote" && (
            <Card className="p-8">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-serif text-indigo-deep">Request a Quote</CardTitle>
                <p className="text-gray-600">Get a detailed quote tailored to your specific project needs</p>

                {/* Progress Indicator */}
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div key={step} className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            step <= quoteStep ? "bg-indigo-deep text-white" : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {step}
                        </div>
                        {step < 5 && (
                          <div className={`w-8 h-0.5 ${step < quoteStep ? "bg-indigo-deep" : "bg-gray-200"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleQuoteSubmit}>
                  {/* Step 1: Project Basics */}
                  {quoteStep === 1 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <Building className="w-12 h-12 text-indigo-deep mx-auto mb-2" />
                        <h3 className="text-xl font-semibold text-indigo-deep">Project Basics</h3>
                        <p className="text-gray-600">Tell us about your project fundamentals</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
                        <select
                          value={quoteForm.projectType}
                          onChange={(e) => setQuoteForm((prev) => ({ ...prev, projectType: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-deep ${
                            errors.projectType ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Select project type</option>
                          {projectTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        {errors.projectType && <p className="text-red-500 text-sm mt-1">{errors.projectType}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Location *</label>
                        <Input
                          value={quoteForm.location}
                          onChange={(e) => setQuoteForm((prev) => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g., East Legon, Accra"
                          className={errors.location ? "border-red-500" : ""}
                        />
                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Timeline *</label>
                        <select
                          value={quoteForm.timeline}
                          onChange={(e) => setQuoteForm((prev) => ({ ...prev, timeline: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-deep ${
                            errors.timeline ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Select timeline</option>
                          {timelines.map((timeline) => (
                            <option key={timeline} value={timeline}>
                              {timeline}
                            </option>
                          ))}
                        </select>
                        {errors.timeline && <p className="text-red-500 text-sm mt-1">{errors.timeline}</p>}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Service Tier Selection */}
                  {quoteStep === 2 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <DollarSign className="w-12 h-12 text-indigo-deep mx-auto mb-2" />
                        <h3 className="text-xl font-semibold text-indigo-deep">Choose Your Service Tier</h3>
                        <p className="text-gray-600">Select the service package that best fits your needs</p>
                      </div>

                      <div className="grid gap-4">
                        {serviceTiers.map((tier) => (
                          <div
                            key={tier.id}
                            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              quoteForm.serviceTier === tier.id
                                ? "border-indigo-deep bg-indigo-deep/5"
                                : "border-gray-200 hover:border-indigo-deep/50"
                            }`}
                            onClick={() => setQuoteForm((prev) => ({ ...prev, serviceTier: tier.id }))}
                          >
                            {tier.popular && (
                              <Badge className="absolute -top-2 left-4 bg-terracotta text-white">Most Popular</Badge>
                            )}
                            <div className="flex items-center">
                              <input
                                type="radio"
                                checked={quoteForm.serviceTier === tier.id}
                                onChange={() => setQuoteForm((prev) => ({ ...prev, serviceTier: tier.id }))}
                                className="mr-3"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-indigo-deep">{tier.name}</h4>
                                <p className="text-sm text-gray-600 mb-1">{tier.description}</p>
                                <p className="text-sm font-medium text-terracotta">{tier.price}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors.serviceTier && <p className="text-red-500 text-sm mt-1">{errors.serviceTier}</p>}
                    </div>
                  )}

                  {/* Step 3: Budget & Requirements */}
                  {quoteStep === 3 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <Calendar className="w-12 h-12 text-indigo-deep mx-auto mb-2" />
                        <h3 className="text-xl font-semibold text-indigo-deep">Budget & Requirements</h3>
                        <p className="text-gray-600">Help us understand your budget and specific needs</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
                        <select
                          value={quoteForm.budgetRange}
                          onChange={(e) => setQuoteForm((prev) => ({ ...prev, budgetRange: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-deep ${
                            errors.budgetRange ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Select budget range</option>
                          {budgetRanges.map((range) => (
                            <option key={range} value={range}>
                              {range}
                            </option>
                          ))}
                        </select>
                        {errors.budgetRange && <p className="text-red-500 text-sm mt-1">{errors.budgetRange}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Requirements *</label>
                        <Textarea
                          value={quoteForm.requirements}
                          onChange={(e) => setQuoteForm((prev) => ({ ...prev, requirements: e.target.value }))}
                          placeholder="Describe your project requirements, number of rooms, special features, style preferences, etc."
                          rows={5}
                          className={errors.requirements ? "border-red-500" : ""}
                        />
                        {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Contact Information */}
                  {quoteStep === 4 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <User className="w-12 h-12 text-indigo-deep mx-auto mb-2" />
                        <h3 className="text-xl font-semibold text-indigo-deep">Contact Information</h3>
                        <p className="text-gray-600">How can we reach you with your quote?</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                          <Input
                            value={quoteForm.name}
                            onChange={(e) => setQuoteForm((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Your full name"
                            className={errors.name ? "border-red-500" : ""}
                          />
                          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                          <Input
                            type="email"
                            value={quoteForm.email}
                            onChange={(e) => setQuoteForm((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="your.email@example.com"
                            className={errors.email ? "border-red-500" : ""}
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <Input
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="+233 123 456 789"
                          className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                  )}

                  {/* Step 5: Additional Details */}
                  {quoteStep === 5 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <Upload className="w-12 h-12 text-indigo-deep mx-auto mb-2" />
                        <h3 className="text-xl font-semibold text-indigo-deep">Additional Details</h3>
                        <p className="text-gray-600">
                          Any additional information or files to help us prepare your quote
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
                        <Textarea
                          value={quoteForm.additionalDetails}
                          onChange={(e) => setQuoteForm((prev) => ({ ...prev, additionalDetails: e.target.value }))}
                          placeholder="Any additional information, special requests, or questions..."
                          rows={4}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files (Optional)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-deep transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Upload site photos, floor plans, or inspiration images
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Max 10MB per file. JPG, PNG, PDF accepted.</p>
                        </div>
                      </div>

                      {/* Quote Summary */}
                      <Card className="bg-sand-beige/20 border-terracotta/20">
                        <CardHeader>
                          <CardTitle className="text-lg text-indigo-deep">Quote Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Project Type:</span>
                            <span className="font-medium">{quoteForm.projectType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Location:</span>
                            <span className="font-medium">{quoteForm.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Timeline:</span>
                            <span className="font-medium">{quoteForm.timeline}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Service Tier:</span>
                            <span className="font-medium">
                              {serviceTiers.find((t) => t.id === quoteForm.serviceTier)?.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Budget Range:</span>
                            <span className="font-medium">{quoteForm.budgetRange}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-8">
                    <Button
                      type="button"
                      onClick={handleQuotePrev}
                      disabled={quoteStep === 1}
                      variant="outline"
                      className="border-indigo-deep text-indigo-deep hover:bg-indigo-deep hover:text-white disabled:opacity-50 bg-transparent"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    {quoteStep < 5 ? (
                      <Button
                        type="button"
                        onClick={handleQuoteNext}
                        className="bg-indigo-deep hover:bg-indigo-deep/90 text-white"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-deep hover:bg-indigo-deep/90 text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Quote Request
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
