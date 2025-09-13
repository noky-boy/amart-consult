"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Breadcrumb from "@/components/breadcrumb"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Download,
  ArrowRight,
} from "@/components/ui/icons"

interface ProjectData {
  id: number
  title: string
  category: string
  year: number
  location: string
  tier: number
  duration: string
  size: string
  client: string
  images: string[]
  heroImage: string
  description: string
  challenge: string
  solution: string
  features: string[]
  specifications: {
    [key: string]: string
  }
  testimonial: {
    name: string
    role: string
    company: string
    quote: string
    rating: number
    image: string
  }
  outcomes: {
    metric: string
    value: string
    description: string
  }[]
  relatedProjects: number[]
}

const projectsData: { [key: number]: ProjectData } = {
  1: {
    id: 1,
    title: "Modern Villa, East Legon",
    category: "Residential",
    year: 2024,
    location: "East Legon, Accra",
    tier: 3,
    duration: "18 months",
    size: "4,500 sq ft",
    client: "UK-based Ghanaian Executive",
    heroImage: "/placeholder.svg?height=600&width=1200",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "A contemporary luxury villa that seamlessly integrates with the natural slope of East Legon, featuring cutting-edge smart home technology and sustainable design elements.",
    challenge:
      "The primary challenge was designing a luxury residence on a steep slope while maintaining accessibility and maximizing views. The client required a modern aesthetic that would stand out in the prestigious East Legon neighborhood while incorporating smart home technology throughout.",
    solution:
      "We developed a multi-level design that follows the natural contours of the land, creating terraced outdoor spaces and maximizing natural light. The smart home integration was planned from the foundation up, with dedicated infrastructure for automation systems.",
    features: [
      "Smart Home Automation System",
      "Solar Panel Integration",
      "Infinity Pool with City Views",
      "Home Theater & Entertainment Room",
      "Wine Cellar & Tasting Room",
      "Executive Home Office",
      "Guest Quarters with Private Entrance",
      "3-Car Garage with EV Charging",
    ],
    specifications: {
      "Total Area": "4,500 sq ft",
      Bedrooms: "4 Master Suites",
      Bathrooms: "6 Full Bathrooms",
      Floors: "3 Levels",
      "Roof Material": "Clay Tiles with Solar Integration",
      Windows: "Triple-Glazed Energy Efficient",
      Flooring: "Italian Marble & Hardwood",
      HVAC: "Zoned Climate Control System",
    },
    testimonial: {
      name: "Kwame Asante",
      role: "CEO",
      company: "Asante Holdings Ltd",
      quote:
        "Amart Consult exceeded every expectation. They transformed our challenging slope into the most stunning home in East Legon. The smart home integration is flawless, and the attention to detail is remarkable.",
      rating: 5,
      image: "/placeholder.svg?height=80&width=80",
    },
    outcomes: [
      {
        metric: "Energy Efficiency",
        value: "40%",
        description: "Reduction in energy costs through solar integration",
      },
      {
        metric: "Property Value",
        value: "+65%",
        description: "Increase in property value post-completion",
      },
      {
        metric: "Client Satisfaction",
        value: "5/5",
        description: "Perfect rating from client feedback",
      },
    ],
    relatedProjects: [4, 5],
  },
  2: {
    id: 2,
    title: "Beachfront Renovation, Ada",
    category: "Renovations",
    year: 2023,
    location: "Ada Foah, Greater Accra",
    tier: 3,
    duration: "12 months",
    size: "3,200 sq ft",
    client: "Private Family",
    heroImage: "/placeholder.svg?height=600&width=1200",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Complete transformation of a 1960s colonial bungalow into a modern coastal retreat, preserving historical character while adding contemporary amenities and storm resistance.",
    challenge:
      "The existing structure had significant structural issues and was not equipped to handle coastal weather conditions. The challenge was to preserve the colonial charm while modernizing the infrastructure and making it hurricane-resistant.",
    solution:
      "We reinforced the existing foundation, upgraded all structural elements to meet modern coastal building codes, and carefully restored original architectural details while adding contemporary extensions that complement the original design.",
    features: [
      "Hurricane-Resistant Construction",
      "Restored Colonial Architecture",
      "Extended Ocean-View Deck",
      "Modern Coastal Kitchen",
      "Master Suite Addition",
      "Outdoor Entertainment Area",
      "Storm Shutters & Protection",
      "Sustainable Materials",
    ],
    specifications: {
      "Total Area": "3,200 sq ft",
      Bedrooms: "3 Bedrooms",
      Bathrooms: "3 Bathrooms",
      "Deck Area": "800 sq ft",
      Foundation: "Reinforced Concrete Piers",
      Roofing: "Impact-Resistant Metal",
      Windows: "Hurricane-Rated Impact Glass",
      Siding: "Fiber Cement Coastal Grade",
    },
    testimonial: {
      name: "Sarah Mensah",
      role: "Homeowner",
      company: "Private Client",
      quote:
        "They brought our family's beachfront dream to life while respecting the home's history. The renovation survived the last storm season perfectly, and we couldn't be happier with the results.",
      rating: 5,
      image: "/placeholder.svg?height=80&width=80",
    },
    outcomes: [
      {
        metric: "Storm Resistance",
        value: "Category 3",
        description: "Certified to withstand Category 3 hurricane winds",
      },
      {
        metric: "Space Increase",
        value: "+45%",
        description: "Additional living space through smart renovation",
      },
      {
        metric: "Heritage Preservation",
        value: "100%",
        description: "Original colonial features preserved and restored",
      },
    ],
    relatedProjects: [1, 3],
  },
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0)

  const projectId = Number.parseInt(params.id)
  const project = projectsData[projectId]

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-indigo-deep mb-4">Project Not Found</h1>
          <Link href="/portfolio">
            <Button>Back to Portfolio</Button>
          </Link>
        </div>
      </div>
    )
  }

  const allImages = [project.heroImage, ...project.images]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const openLightbox = (index: number) => {
    setLightboxImageIndex(index)
    setIsLightboxOpen(true)
  }

  const getTierBadgeColor = (tier: number) => {
    switch (tier) {
      case 3:
        return "bg-terracotta text-white"
      case 2:
        return "bg-indigo-deep text-white"
      default:
        return "bg-sand text-indigo-deep"
    }
  }

  const breadcrumbItems = [{ label: "Portfolio", href: "/portfolio" }, { label: project.title }]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-40" role="navigation" aria-label="Project navigation">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Breadcrumb items={breadcrumbItems} />
            <Link
              href="/portfolio"
              className="inline-flex items-center text-indigo-deep hover:text-terracotta transition-colors focus-visible:ring-enhanced rounded-md px-2 py-1"
            >
              <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
              Back to Portfolio
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden" aria-label="Project showcase">
        <div className="relative h-full">
          <Image
            src={allImages[currentImageIndex] || "/placeholder.svg"}
            alt={`${project.title} - Main project image showing architectural design`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all focus-visible:ring-enhanced"
            aria-label="View previous project image"
          >
            <ChevronLeft className="w-6 h-6 text-white" aria-hidden="true" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all focus-visible:ring-enhanced"
            aria-label="View next project image"
          >
            <ChevronRight className="w-6 h-6 text-white" aria-hidden="true" />
          </button>

          {/* Project Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Badge className={`${getTierBadgeColor(project.tier)} font-semibold`}>Tier {project.tier}</Badge>
                <Badge variant="outline" className="border-white text-white">
                  {project.category}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{project.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-lg">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" aria-hidden="true" />
                  <span className="sr-only">Location: </span>
                  {project.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" aria-hidden="true" />
                  <span className="sr-only">Year completed: </span>
                  {project.year}
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" aria-hidden="true" />
                  <span className="sr-only">Project duration: </span>
                  {project.duration}
                </div>
              </div>
            </div>
          </div>

          {/* Image Thumbnails */}
          <div className="absolute bottom-4 right-4 flex gap-2" role="tablist" aria-label="Project image navigation">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all focus-visible:ring-enhanced ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
                role="tab"
                aria-selected={index === currentImageIndex}
                aria-label={`View image ${index + 1} of ${allImages.length}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Project Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-2 space-y-12">
            {/* Project Overview */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-6">Project Overview</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{project.description}</p>
            </section>

            {/* Challenge & Solution */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-6">Challenge & Solution</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-red-600 mb-4">The Challenge</h3>
                    <p className="text-gray-700">{project.challenge}</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-green-600 mb-4">Our Solution</h3>
                    <p className="text-gray-700">{project.solution}</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Visual Gallery */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-6">Visual Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {allImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
                    onClick={() => openLightbox(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${project.title} - Image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Specifications */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-6">Technical Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(project.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-4 bg-sand/20 rounded-lg">
                    <span className="font-semibold text-indigo-deep">{key}:</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Features */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-6">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-center p-4 bg-white border border-sand rounded-lg">
                    <div className="w-2 h-2 bg-terracotta rounded-full mr-4" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          </article>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Project Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-indigo-deep mb-4">Project Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Client:</span>
                    <span className="font-semibold">{project.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-semibold">{project.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{project.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Tier:</span>
                    <Badge className={getTierBadgeColor(project.tier)}>Tier {project.tier}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Outcomes */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-indigo-deep mb-4">Project Outcomes</h3>
                <div className="space-y-4">
                  {project.outcomes.map((outcome, index) => (
                    <div key={index} className="text-center p-4 bg-sand/20 rounded-lg">
                      <div className="text-2xl font-bold text-terracotta mb-1">{outcome.value}</div>
                      <div className="font-semibold text-indigo-deep mb-1">{outcome.metric}</div>
                      <div className="text-sm text-gray-600">{outcome.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Client Testimonial */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="w-8 h-8 text-terracotta mr-3" />
                  <h3 className="text-xl font-semibold text-indigo-deep">Client Testimonial</h3>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(project.testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 italic mb-4">"{project.testimonial.quote}"</blockquote>
                <div className="flex items-center">
                  <Image
                    src={project.testimonial.image || "/placeholder.svg"}
                    alt={project.testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold text-indigo-deep">{project.testimonial.name}</div>
                    <div className="text-sm text-gray-600">
                      {project.testimonial.role}, {project.testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share & Download */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-indigo-deep mb-4">Share Project</h3>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Projects */}
        {project.relatedProjects.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-8 text-center">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.relatedProjects.map((relatedId) => {
                const relatedProject = projectsData[relatedId]
                if (!relatedProject) return null

                return (
                  <Link key={relatedId} href={`/portfolio/${relatedId}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedProject.heroImage || "/placeholder.svg"}
                          alt={relatedProject.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-indigo-deep mb-2">{relatedProject.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{relatedProject.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{relatedProject.category}</Badge>
                          <span className="text-sm text-gray-500">{relatedProject.year}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-indigo-deep to-terracotta text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">Ready to Start Your Project?</h2>
              <p className="text-lg mb-6 opacity-90">
                Let's discuss how we can bring your architectural vision to life with our expertise and innovative
                design solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-indigo-deep text-white hover:bg-indigo-deep-hover focus-visible:ring-enhanced"
                >
                  Get Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-indigo-deep bg-transparent focus-visible:ring-enhanced"
                >
                  View All Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-4xl max-h-full">
            <Image
              src={allImages[lightboxImageIndex] || "/placeholder.svg"}
              alt={`${project.title} - Image ${lightboxImageIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />

            {lightboxImageIndex > 0 && (
              <button
                onClick={() => setLightboxImageIndex((prev) => prev - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {lightboxImageIndex < allImages.length - 1 && (
              <button
                onClick={() => setLightboxImageIndex((prev) => prev + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {lightboxImageIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  )
}
