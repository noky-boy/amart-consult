import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  Users,
  Clock,
  Award,
} from "@/components/ui/icons";
import WhatsAppConsultationForm from "@/components/whatsapp-consultation-form";
import WhatsAppFormTrigger from "@/components/whatsapp-form-trigger";

export default function ArchitecturalDesignsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">
                Architectural Designs
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your vision into stunning architectural masterpieces.
                Our comprehensive design services blend creativity with
                functionality to create spaces that inspire and endure.
              </p>
              <div className="flex flex-wrap gap-4">
                <WhatsAppFormTrigger
                  triggerText="Get Design Quote"
                  className="bg-terracotta hover:bg-terracotta/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                />
                <Link
                  href="/portfolio"
                  className="border border-gray-300 hover:border-terracotta text-gray-700 hover:text-terracotta px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  View Portfolio
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/resources/hero/Hero_image4.webp"
                alt="Architectural Design"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Our Design Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From concept to completion, we provide comprehensive architectural
              design solutions tailored to your unique needs and vision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Residential Design",
                description:
                  "Custom homes, renovations, and residential complexes designed for modern living.",
                features: [
                  "Floor Plans",
                  "3D Visualizations",
                  "Interior Layouts",
                  "Landscape Integration",
                ],
              },
              {
                title: "Commercial Design",
                description:
                  "Office buildings, retail spaces, and commercial complexes that drive business success.",
                features: [
                  "Space Planning",
                  "Brand Integration",
                  "Accessibility Compliance",
                  "Energy Efficiency",
                ],
              },
              {
                title: "Mixed-Use Development",
                description:
                  "Innovative designs that combine residential, commercial, and recreational spaces.",
                features: [
                  "Urban Planning",
                  "Community Spaces",
                  "Sustainable Design",
                  "Traffic Flow",
                ],
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-serif font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <CheckCircle className="h-4 w-4 text-terracotta mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Our Design Process
            </h2>
            <p className="text-lg text-gray-600">
              A systematic approach to bringing your vision to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Consultation",
                description:
                  "Understanding your vision, requirements, and budget",
              },
              {
                step: "02",
                title: "Concept Design",
                description:
                  "Initial sketches and design concepts for your review",
              },
              {
                step: "03",
                title: "Development",
                description:
                  "Detailed drawings, 3D models, and technical specifications",
              },
              {
                step: "04",
                title: "Finalization",
                description: "Final plans ready for construction and permits",
              },
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="bg-terracotta text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {phase.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {phase.title}
                </h3>
                <p className="text-gray-600 text-sm">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Users, number: "50+", label: "Projects Designed" },
              { icon: Clock, number: "8+", label: "Years Experience" },
              { icon: Award, number: "98%", label: "Client Satisfaction" },
            ].map((stat, index) => (
              <div key={index} className="space-y-4">
                <stat.icon className="h-12 w-12 text-terracotta mx-auto" />
                <div className="text-3xl font-bold text-gray-900">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-terracotta py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            Ready to Start Your Design Journey?
          </h2>
          <p className="text-xl text-terracotta-100 mb-8">
            Let's discuss your project and create something extraordinary
            together.
          </p>
          <WhatsAppConsultationForm
            triggerText="Start Your Project"
            className="bg-white hover:bg-gray-50 text-terracotta px-8 py-3 rounded-lg font-semibold transition-colors"
          />
        </div>
      </section>
    </div>
  );
}
