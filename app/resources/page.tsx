import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, Calculator, Building2, Users, ArrowRight } from "@/components/ui/icons"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Resources - Amart Consult | Architectural Guides & Tools",
  description:
    "Access our comprehensive collection of architectural resources, guides, calculators, and tools to help with your construction project planning.",
}

export default function ResourcesPage() {
  const resources = [
    {
      title: "Ghana Building Cost Calculator",
      description: "Estimate construction costs for your project with our comprehensive calculator tool.",
      icon: Calculator,
      type: "Tool",
      link: "/lead-magnet/ghana-building-calculator",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Architectural Design Guide",
      description: "Complete guide to architectural design principles and best practices in Ghana.",
      icon: Building2,
      type: "Guide",
      link: "/resources/design-guide.pdf",
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Construction Planning Checklist",
      description: "Essential checklist for planning your construction project from start to finish.",
      icon: FileText,
      type: "Checklist",
      link: "/resources/construction-checklist.pdf",
      color: "from-orange-500 to-red-600",
    },
    {
      title: "Project Management Templates",
      description: "Professional templates for managing your construction project timeline and budget.",
      icon: Users,
      type: "Templates",
      link: "/resources/project-templates.zip",
      color: "from-purple-500 to-pink-600",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-indigo-deep to-indigo-deep/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">Resources & Tools</h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              Access our comprehensive collection of architectural guides, calculators, and planning tools
            </p>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((resource, index) => {
              const IconComponent = resource.icon
              return (
                <Card
                  key={resource.title}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`mx-auto mb-4 p-4 rounded-2xl w-fit bg-gradient-to-br ${resource.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="mb-2">
                      <span
                        className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${resource.color} text-white font-medium`}
                      >
                        {resource.type}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-serif text-indigo-deep mb-3">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-6 leading-relaxed">{resource.description}</p>
                    <Link href={resource.link}>
                      <Button className="w-full bg-indigo-deep hover:bg-indigo-deep/90 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Access Resource
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-sand/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-4">Stay Updated</h2>
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to our newsletter for the latest resources, guides, and architectural insights.
          </p>
          <Link href="/#newsletter">
            <Button size="lg" className="bg-terracotta hover:bg-terracotta/90 text-white px-8 py-3">
              Subscribe to Newsletter
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
