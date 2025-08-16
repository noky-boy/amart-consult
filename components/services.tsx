"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Clock, FileText, Users, Building2, Star } from "@/components/ui/icons"
import WhatsAppConsultationForm from "./whatsapp-consultation-form"
import type { ServicePackage } from "@/sanity/lib/types"
import { formatPrice } from "@/lib/sanity-utils"

interface ServicesProps {
  packages?: ServicePackage[]
}

export default function Services({ packages = [] }: ServicesProps) {
  const [selectedType, setSelectedType] = useState<"residential" | "commercial">("residential")
  const [isWhatsAppFormOpen, setIsWhatsAppFormOpen] = useState(false)

  const services =
    packages.length > 0
      ? packages.map((pkg, index) => ({
          id: pkg._id,
          title: pkg.name,
          subtitle: pkg.description.substring(0, 50) + "...",
          duration: "2-4 weeks", // This could be added to CMS schema
          priceResidential: pkg.price ? formatPrice(pkg.price, pkg.currency) : "Contact for quote",
          priceCommercial: pkg.price ? formatPrice(pkg.price * 2, pkg.currency) : "Contact for quote",
          icon: index === 0 ? FileText : index === 1 ? Building2 : Users,
          popular: pkg.popular,
          deliverables: pkg.features || [],
          bestFor: pkg.category || "General projects",
          description: pkg.description,
        }))
      : [
          // Fallback static data
          {
            id: 1,
            title: "Concept & Design Package",
            subtitle: "Initial Planning & Development",
            duration: "2-4 weeks",
            priceResidential: "From GHS 5,000",
            priceCommercial: "From GHS 10,000",
            icon: FileText,
            popular: false,
            deliverables: [
              "Site visit and analysis",
              "2D floor plans",
              "Building elevations",
              "Feasibility study",
              "Initial concept sketches",
            ],
            bestFor: "Initial planning and concept development",
            description:
              "Perfect for clients who want to explore design possibilities and understand project feasibility before committing to full development.",
          },
          {
            id: 2,
            title: "Design & Visualization Package",
            subtitle: "Complete Design Visualization",
            duration: "4-8 weeks",
            priceResidential: "From GHS 20,000",
            priceCommercial: "From GHS 40,000",
            icon: Building2,
            popular: true,
            deliverables: [
              "Construction-ready drawings",
              "Detailed 3D renderings",
              "Material specifications",
              "Interior design guidance",
              "Structural planning",
              "MEP coordination",
            ],
            bestFor: "Complete design visualization",
            description:
              "Our most comprehensive design package that provides everything needed to visualize and plan your project in detail.",
          },
          {
            id: 3,
            title: "Full Design-to-Build Package",
            subtitle: "Turnkey Project Management",
            duration: "6+ months",
            priceResidential: "10-15% of construction cost",
            priceCommercial: "10-15% of construction cost",
            icon: Users,
            popular: false,
            deliverables: [
              "Complete project management",
              "Design to construction handover",
              "Contractor coordination",
              "Quality control supervision",
              "Timeline management",
              "Budget oversight",
              "Final project handover",
            ],
            bestFor: "Turnkey project execution",
            description:
              "End-to-end project management from initial design through final construction handover, ensuring seamless execution.",
          },
        ]

  return (
    <section className="py-20 bg-gradient-to-b from-white via-sand-light/30 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-indigo-deep mb-6">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-10 leading-relaxed">
            Choose from our comprehensive service packages designed to meet your architectural needs, from initial
            concept development to complete project delivery.
          </p>

          <div className="inline-flex bg-sand-light rounded-xl p-1.5 mb-12 shadow-sm">
            <button
              onClick={() => setSelectedType("residential")}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedType === "residential"
                  ? "bg-white text-indigo-deep shadow-md transform scale-105"
                  : "text-gray-600 hover:text-indigo-deep"
              }`}
            >
              Residential
            </button>
            <button
              onClick={() => setSelectedType("commercial")}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedType === "commercial"
                  ? "bg-white text-indigo-deep shadow-md transform scale-105"
                  : "text-gray-600 hover:text-indigo-deep"
              }`}
            >
              Commercial
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service) => {
            const IconComponent = service.icon
            const price = selectedType === "residential" ? service.priceResidential : service.priceCommercial

            return (
              <Card
                key={service.id}
                className={`relative card-hover border-0 shadow-lg flex flex-col h-full ${
                  service.popular
                    ? "ring-2 ring-terracotta bg-gradient-to-b from-white to-terracotta-light/5"
                    : "bg-white"
                }`}
              >
                {service.popular && (
                  <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-terracotta text-white px-4 py-1.5 shadow-lg">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-6 pt-8">
                  <div
                    className={`mx-auto mb-6 p-4 rounded-2xl w-fit ${
                      service.popular ? "bg-terracotta/10" : "bg-indigo-deep/10"
                    }`}
                  >
                    <IconComponent
                      className={`h-10 w-10 ${service.popular ? "text-terracotta" : "text-indigo-deep"}`}
                    />
                  </div>
                  <CardTitle className="text-2xl font-serif text-indigo-deep mb-3 text-center">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-terracotta font-semibold text-lg text-center">
                    {service.subtitle}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 flex-grow">
                  <div
                    className={`text-center py-6 rounded-xl ${
                      service.popular ? "bg-terracotta/5" : "bg-sand-light/50"
                    }`}
                  >
                    <div className="text-3xl font-bold text-indigo-deep mb-2 text-center break-words">{price}</div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-center">{service.duration}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-center">{service.description}</p>

                  <div className="bg-sand-light/60 p-4 rounded-xl text-center">
                    <p className="font-semibold text-indigo-deep mb-2 text-center">Best for:</p>
                    <p className="text-gray-700 text-center">{service.bestFor}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-indigo-deep mb-3 text-center">What's included:</p>
                    <ul className="space-y-2">
                      {service.deliverables.slice(0, 4).map((item, index) => (
                        <li key={index} className="flex items-start text-gray-600">
                          <Check className="h-5 w-5 text-terracotta mr-3 mt-0.5 flex-shrink-0" />
                          <span className="break-words">{item}</span>
                        </li>
                      ))}
                      {service.deliverables.length > 4 && (
                        <li className="text-terracotta font-semibold text-center">
                          +{service.deliverables.length - 4} more features
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="pt-6">
                  <Button
                    className={`w-full py-3 font-semibold transition-all duration-300 ${
                      service.popular
                        ? "bg-terracotta hover:bg-terracotta-hover text-white shadow-lg hover:shadow-xl"
                        : "bg-indigo-deep hover:bg-indigo-deep-hover text-white"
                    }`}
                  >
                    Get Quote
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-sand/20">
          <div className="bg-gradient-to-r from-indigo-deep to-indigo-deep-hover text-white p-8">
            <h3 className="text-2xl font-serif font-bold text-center">Service Comparison</h3>
            <p className="text-center text-sand/90 mt-2">Compare what's included in each package</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sand-light/50">
                <tr>
                  <th className="text-left p-6 font-semibold text-indigo-deep">Features</th>
                  {services.map((service) => (
                    <th key={service.id} className="text-center p-6 font-semibold text-indigo-deep min-w-[200px]">
                      {service.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  "Site Analysis",
                  "2D Floor Plans",
                  "3D Renderings",
                  "Construction Drawings",
                  "Project Management",
                  "Quality Control",
                  "Final Handover",
                ].map((feature, index) => (
                  <tr key={feature} className={index % 2 === 0 ? "bg-sand-light/20" : "bg-white"}>
                    <td className="p-6 font-medium text-gray-700">{feature}</td>
                    <td className="text-center p-6">
                      {feature === "Site Analysis" || feature === "2D Floor Plans" ? (
                        <Check className="h-6 w-6 text-terracotta mx-auto" />
                      ) : (
                        <span className="text-gray-300 text-xl">—</span>
                      )}
                    </td>
                    <td className="text-center p-6">
                      {feature !== "Project Management" &&
                      feature !== "Quality Control" &&
                      feature !== "Final Handover" ? (
                        <Check className="h-6 w-6 text-terracotta mx-auto" />
                      ) : (
                        <span className="text-gray-300 text-xl">—</span>
                      )}
                    </td>
                    <td className="text-center p-6">
                      <Check className="h-6 w-6 text-terracotta mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Not sure which package is right for you? Let's discuss your project needs and find the perfect solution.
          </p>
          <Button
            onClick={() => setIsWhatsAppFormOpen(true)}
            size="lg"
            className="bg-terracotta hover:bg-terracotta-hover text-white px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Schedule Free Consultation
          </Button>
        </div>
      </div>

      <WhatsAppConsultationForm isOpen={isWhatsAppFormOpen} onClose={() => setIsWhatsAppFormOpen(false)} />
    </section>
  )
}
