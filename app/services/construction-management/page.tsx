import Link from "next/link"
import { ArrowLeft, CheckCircle, Users, Clock, Shield, Settings } from "@/components/ui/icons"
import WhatsAppConsultationForm from "@/components/whatsapp-consultation-form"

export default function ConstructionManagementPage() {
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
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">Construction Management</h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Professional project management services that ensure your construction project is delivered on time,
                within budget, and to the highest quality standards.
              </p>
              <div className="flex flex-wrap gap-4">
                <WhatsAppConsultationForm
                  triggerText="Get Management Quote"
                  className="bg-terracotta hover:bg-terracotta/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                />
                <Link
                  href="/portal/login"
                  className="border border-gray-300 hover:border-terracotta text-gray-700 hover:text-terracotta px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Client Portal
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/resources/hero/luxury-pool-villa.jpg"
                alt="Construction Management"
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
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Our Management Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive construction management that covers every aspect of your project from planning to
              completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Project Planning",
                description: "Strategic planning and scheduling to ensure smooth project execution.",
                features: ["Timeline Development", "Resource Planning", "Risk Assessment", "Permit Coordination"],
              },
              {
                title: "Quality Control",
                description: "Rigorous quality assurance and inspection throughout the construction process.",
                features: ["Material Inspection", "Work Quality Checks", "Safety Compliance", "Progress Monitoring"],
              },
              {
                title: "Budget Management",
                description: "Cost control and financial oversight to keep your project within budget.",
                features: ["Cost Tracking", "Change Order Management", "Payment Scheduling", "Financial Reporting"],
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

      {/* Management Process */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Our Management Process</h2>
            <p className="text-lg text-gray-600">Systematic approach to successful project delivery</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Settings,
                title: "Pre-Construction",
                description: "Planning, permits, and contractor selection",
              },
              {
                icon: Users,
                title: "Team Coordination",
                description: "Managing all stakeholders and subcontractors",
              },
              {
                icon: Shield,
                title: "Quality Assurance",
                description: "Continuous monitoring and quality control",
              },
              {
                icon: Clock,
                title: "Project Delivery",
                description: "On-time completion and final handover",
              },
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="bg-terracotta text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <phase.icon className="h-8 w-8" />
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
            <div className="relative">
              <img
                src="/resources/hero/modern-residential-villa.jpg"
                alt="Management Benefits"
                className="rounded-2xl shadow-xl w-full h-80 object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold text-gray-900">Why Professional Management Matters</h2>
              {[
                {
                  title: "Time Efficiency",
                  description: "Professional coordination reduces project delays by up to 30%",
                },
                {
                  title: "Cost Control",
                  description: "Prevent budget overruns with systematic financial oversight",
                },
                {
                  title: "Quality Assurance",
                  description: "Consistent quality standards throughout the construction process",
                },
                {
                  title: "Stress Reduction",
                  description: "Let professionals handle the complexities while you focus on your vision",
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-terracotta py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Ready for Professional Project Management?</h2>
          <p className="text-xl text-terracotta-100 mb-8">
            Let our experienced team manage your construction project from start to finish.
          </p>
          <WhatsAppConsultationForm
            triggerText="Start Your Project"
            className="bg-white hover:bg-gray-50 text-terracotta px-8 py-3 rounded-lg font-semibold transition-colors"
          />
        </div>
      </section>
    </div>
  )
}
