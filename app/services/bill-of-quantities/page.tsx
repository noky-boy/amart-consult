import Link from "next/link"
import { ArrowLeft, CheckCircle, Calculator, FileText, TrendingUp } from "@/components/ui/icons"
import WhatsAppConsultationForm from "@/components/whatsapp-consultation-form"

export default function BillOfQuantitiesPage() {
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
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">Bill of Quantities</h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Accurate cost estimation and material quantification for your construction projects. Our detailed BOQ
                services ensure budget control and project transparency from start to finish.
              </p>
              <div className="flex flex-wrap gap-4">
                <WhatsAppConsultationForm
                  triggerText="Get BOQ Quote"
                  className="bg-terracotta hover:bg-terracotta/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                />
                <Link
                  href="/lead-magnet/ghana-building-calculator"
                  className="border border-gray-300 hover:border-terracotta text-gray-700 hover:text-terracotta px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Free Calculator
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/resources/hero/Hero_image7.webp"
                alt="Bill of Quantities"
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
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Our BOQ Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive quantity surveying services that provide accurate cost control and material planning for
              your construction projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Detailed Measurements",
                description: "Precise measurement and quantification of all construction materials and labor.",
                features: ["Material Takeoffs", "Labor Calculations", "Equipment Requirements", "Waste Allowances"],
              },
              {
                title: "Cost Estimation",
                description: "Accurate pricing based on current market rates and local supplier networks.",
                features: ["Market Rate Analysis", "Supplier Quotations", "Price Variations", "Cost Optimization"],
              },
              {
                title: "Project Budgeting",
                description: "Comprehensive budget planning with contingencies and cash flow projections.",
                features: ["Budget Breakdown", "Payment Schedules", "Risk Assessment", "Value Engineering"],
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

      {/* Benefits Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Why Choose Our BOQ Services?</h2>
            <p className="text-lg text-gray-600">Professional quantity surveying that saves time and money</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                {
                  title: "Accurate Budgeting",
                  description: "Prevent cost overruns with precise material and labor calculations",
                },
                {
                  title: "Transparent Pricing",
                  description: "Detailed breakdown of all costs for complete project transparency",
                },
                {
                  title: "Local Expertise",
                  description: "Deep knowledge of Ghana's construction market and material costs",
                },
                {
                  title: "Time Savings",
                  description: "Professional BOQ preparation saves weeks of planning time",
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
                src="/resources/hero/Hero_image2.webp"
                alt="BOQ Benefits"
                className="rounded-2xl shadow-xl w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Calculator, number: "100+", label: "BOQs Prepared" },
              { icon: FileText, number: "95%", label: "Accuracy Rate" },
              { icon: TrendingUp, number: "20%", label: "Average Cost Savings" },
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
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Need Accurate Cost Estimation?</h2>
          <p className="text-xl text-terracotta-100 mb-8">
            Get a detailed Bill of Quantities for your project and take control of your construction budget.
          </p>
          <WhatsAppConsultationForm
            triggerText="Request BOQ Quote"
            className="bg-white hover:bg-gray-50 text-terracotta px-8 py-3 rounded-lg font-semibold transition-colors"
          />
        </div>
      </section>
    </div>
  )
}
