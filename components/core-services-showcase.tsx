"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  Calculator,
  Users,
  MessageSquare,
  ArrowRight,
} from "@/components/ui/icons";
import WhatsAppConsultationForm from "./whatsapp-consultation-form";
import { useState } from "react";

const coreServices = [
  {
    title: "Architectural Designs",
    description:
      "From concept to construction-ready plans, we create innovative designs that blend functionality with aesthetic appeal.",
    icon: Building2,
    href: "/services/architectural-designs",
    features: [
      "3D Visualizations",
      "Construction Drawings",
      "Interior Design",
      "Sustainable Solutions",
    ],
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Bill of Quantities",
    description:
      "Accurate cost estimation and material quantification to ensure your project stays within budget from start to finish.",
    icon: Calculator,
    href: "/services/bill-of-quantities",
    features: [
      "Cost Estimation",
      "Material Lists",
      "Budget Planning",
      "Value Engineering",
    ],
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Construction Management",
    description:
      "End-to-end project oversight ensuring quality, timeline adherence, and seamless coordination of all stakeholders.",
    icon: Users,
    href: "/services/construction-management",
    features: [
      "Project Oversight",
      "Quality Control",
      "Timeline Management",
      "Contractor Coordination",
    ],
    color: "from-orange-500 to-red-600",
  },
  {
    title: "Project Consultation",
    description:
      "Expert guidance and strategic advice to help you make informed decisions throughout your construction journey.",
    icon: MessageSquare,
    href: "/services/project-consultation",
    features: [
      "Expert Advice",
      "Feasibility Studies",
      "Risk Assessment",
      "Strategic Planning",
    ],
    color: "from-purple-500 to-pink-600",
  },
];

export default function CoreServicesShowcase() {
  const [isWhatsAppFormOpen, setIsWhatsAppFormOpen] = useState(false);

  return (
    <>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Our Core Services
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive architectural and construction services tailored to
              bring your vision to life with precision, quality, and innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {coreServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card
                  key={service.title}
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white"
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  <CardHeader className="text-center pb-4 relative z-10">
                    <div
                      className={`mx-auto mb-6 p-4 rounded-2xl w-fit bg-gradient-to-br ${service.color} shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-serif text-indigo-deep mb-3 group-hover:text-indigo-deep-hover transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 relative z-10">
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <div
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color} mr-3 flex-shrink-0`}
                          />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link href={service.href} className="block mt-6">
                      <Button
                        variant="outline"
                        className="w-full bg-indigo-deep text-white border-indigo-deep hover:bg-indigo-deep-hover hover:border-indigo-deep-hover group-hover:bg-indigo-deep-hover transition-all duration-300 flex items-center justify-center"
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Call-to-Action Section */}
          <div className="bg-gradient-to-r from-indigo-deep to-indigo-deep-hover rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-xl text-sand/90 mb-8 max-w-2xl mx-auto">
              Let's discuss how our comprehensive services can bring your
              architectural vision to life with precision and excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setIsWhatsAppFormOpen(true)}
                className="bg-indigo-900 hover:bg-indigo-800 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Get Free Consultation
              </Button>
              <Link href="/portfolio">
                <Button
                  size="lg"
                  className="bg-transparent border-2 border-indigo-900 text-indigo-900 hover:bg-indigo-900 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
                >
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp consultation form */}
      <WhatsAppConsultationForm
        isOpen={isWhatsAppFormOpen}
        onClose={() => setIsWhatsAppFormOpen(false)}
      />
    </>
  );
}
