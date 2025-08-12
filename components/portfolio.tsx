"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Eye, ArrowRight } from "lucide-react"

type ProjectCategory = "All" | "Residential" | "Commercial" | "Renovations"

interface Project {
  id: number
  title: string
  category: Exclude<ProjectCategory, "All">
  year: number
  location: string
  tier: number
  image: string
  description: string
  features: string[]
  beforeImage?: string
}

const projects: Project[] = [
  {
    id: 1,
    title: "Modern Villa, East Legon",
    category: "Residential",
    year: 2024,
    location: "East Legon, Accra",
    tier: 3,
    image: "/placeholder.svg?height=400&width=600",
    description: "Contemporary luxury villa featuring sustainable design elements and smart home integration.",
    features: ["Smart Home System", "Solar Integration", "Infinity Pool", "Home Theater"],
  },
  {
    id: 2,
    title: "Beachfront Renovation, Ada",
    category: "Renovations",
    year: 2023,
    location: "Ada Foah, Greater Accra",
    tier: 3,
    image: "/placeholder.svg?height=400&width=600",
    beforeImage: "/placeholder.svg?height=400&width=600",
    description: "Complete transformation of a beachfront property into a modern coastal retreat.",
    features: ["Coastal Design", "Storm Resistance", "Ocean Views", "Outdoor Living"],
  },
  {
    id: 3,
    title: "Office Complex, Kumasi",
    category: "Commercial",
    year: 2024,
    location: "Kumasi, Ashanti Region",
    tier: 3,
    image: "/placeholder.svg?height=400&width=600",
    description: "Multi-story office complex designed for maximum efficiency and employee wellness.",
    features: ["LEED Certified", "Co-working Spaces", "Rooftop Garden", "EV Charging"],
  },
  {
    id: 4,
    title: "Luxury Apartment Interior",
    category: "Residential",
    year: 2023,
    location: "Airport Hills, Accra",
    tier: 2,
    image: "/placeholder.svg?height=400&width=600",
    description: "Sophisticated interior design for a high-end apartment with custom furnishings.",
    features: ["Custom Furniture", "Ambient Lighting", "Walk-in Closet", "Wine Cellar"],
  },
  {
    id: 5,
    title: "Executive Residence, Airport Hills",
    category: "Residential",
    year: 2024,
    location: "Airport Hills, Accra",
    tier: 3,
    image: "/placeholder.svg?height=400&width=600",
    description: "Grand executive residence combining classical elegance with modern amenities.",
    features: ["Grand Foyer", "Executive Office", "Guest Quarters", "Security System"],
  },
  {
    id: 6,
    title: "Retail Shop Design, Tema",
    category: "Commercial",
    year: 2023,
    location: "Tema, Greater Accra",
    tier: 2,
    image: "/placeholder.svg?height=400&width=600",
    description: "Contemporary retail space designed to enhance customer experience and product visibility.",
    features: ["Display Systems", "LED Lighting", "POS Integration", "Storage Solutions"],
  },
]

const categories: ProjectCategory[] = ["All", "Residential", "Commercial", "Renovations"]

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("All")
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const filteredProjects =
    activeCategory === "All" ? projects : projects.filter((project) => project.category === activeCategory)

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

  return (
    <section className="py-16 bg-gradient-to-b from-white to-sand/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-indigo-deep mb-4">Our Portfolio</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our diverse collection of architectural projects, from luxury residences to commercial complexes,
            each crafted with precision and innovation.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeCategory === category
                  ? "bg-indigo-deep text-white shadow-lg"
                  : "border-indigo-deep text-indigo-deep hover:bg-indigo-deep hover:text-white"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
                    hoveredProject === project.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="bg-white/20 text-white text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" className="bg-terracotta hover:bg-terracotta/90 text-white">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>

                {/* Tier Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className={`${getTierBadgeColor(project.tier)} font-semibold`}>Tier {project.tier}</Badge>
                </div>

                {/* Before/After Badge for Renovations */}
                {project.category === "Renovations" && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-600 text-white">Before/After</Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-serif font-bold text-indigo-deep group-hover:text-terracotta transition-colors">
                    {project.title}
                  </h3>
                  <Badge variant="outline" className="text-xs border-terracotta text-terracotta">
                    {project.category}
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {project.year}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {project.location}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-indigo-deep rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-serif font-bold mb-4">Ready to Start Your Project?</h3>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Let's discuss how we can bring your architectural vision to life with our expertise and innovative design
              solutions.
            </p>
            <Button size="lg" className="bg-terracotta hover:bg-terracotta/90 text-white px-8 py-3 rounded-full">
              Start Your Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
