import Link from "next/link"
import { ArrowLeft, CheckCircle, MessageCircle, TrendingUp, Award } from "@/components/ui/icons"
import WhatsAppConsultationForm from "@/components/whatsapp-consultation-form"

export default function ProjectConsultationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-terracotta transition-colors">
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
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">Project Consultation</h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Expert guidance and strategic advice for your construction and architectural projects. Get professional
                insights that save time, money, and ensure project success.
              </p>
              <div className="flex flex-wrap gap-4">
                <WhatsAppConsultationForm
                  triggerText="Book Consultation"
                  className="bg-terracotta hover:bg-terracotta/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                />
                <Link
                  href="/about"
                  className="border border-gray-300 hover:border-terracotta text-gray-700 hover:text-terracotta px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Meet Our Team
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/resources/hero/Hero_image3.webp"
                alt="Project Consultation"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Types */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Consultation Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional advice and guidance across all aspects of construction and architectural projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Project Feasibility",
                description: "Assess project viability, budget requirements, and potential challenges.",
                features: ["Site Analysis", "Budget Assessment", "Timeline Planning", "Risk Evaluation"],
              },
              {
                title: "Design Review",
                description: "Expert review of architectural plans and design proposals.",
                features: ["Plan Analysis", "Code Compliance", "Design Optimization", "Cost Implications"],
              },
              {
                title: "Construction Guidance",
                description: "Ongoing support and advice throughout the construction process.",
                features: ["Progress Reviews", "Quality Checks", "Problem Solving", "Decision Support"],
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-serif font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
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

      {/* Consultation Process */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">How We Consult</h2>
            <p className="text-lg text-gray-600">Our structured approach to providing valuable insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Initial Discussion",
                description: "Understanding your project goals and challenges",
              },
              { step: "02", title: "Analysis", description: "Thorough review of plans, site, and requirements" },
              { step: "03", title: "Recommendations", description: "Detailed advice and strategic recommendations" },
              { step: "04", title: "Follow-up", description: "Ongoing support and guidance as needed" },
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="bg-terracotta text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {phase.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{phase.title}</h3>
                <p className="text-gray-600 text-sm">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold text-gray-900">Why Choose Our Consultation?</h2>
              {[
                {
                  title: "8+ Years Experience",
                  description: "Deep expertise in Ghana's construction and architectural landscape",
                },
                {
                  title: "Cost Savings",
                  description: "Avoid expensive mistakes with professional guidance upfront",
                },
                {
                  title: "Local Knowledge",
                  description: "Understanding of local regulations, materials, and best practices",
                },
                {
                  title: "Objective Advice",
                  description: "Unbiased recommendations focused on your project's success",
                },
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-terracotta text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <img
                src="/resources/hero/Hero_image5.webp"
                alt="Consultation Benefits"
                className="rounded-2xl shadow-xl w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: MessageCircle, number: "200+", label: "Consultations Provided" },
              { icon: TrendingUp, number: "25%", label: "Average Cost Savings" },
              { icon: Award, number: "100%", label: "Client Satisfaction" },
            ].map((stat, index) => (
              <div key={index} className="space-y-4">
                <stat.icon className="h-12 w-12 text-terracotta mx-auto" />
                <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-terracotta py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Need Expert Project Advice?</h2>
          <p className="text-xl text-terracotta-100 mb-8">
            Get professional consultation that can save you time, money, and ensure project success.
          </p>
          <WhatsAppConsultationForm
            triggerText="Book Free Consultation"
            className="bg-white hover:bg-gray-50 text-terracotta px-8 py-3 rounded-lg font-semibold transition-colors"
          />
        </div>
      </section>
    </div>
  )
}
