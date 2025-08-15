import { Card, CardContent } from "@/components/ui/card"
import { Building, Users, Award, CheckCircle } from "@/components/ui/icons"

export default function Statistics() {
  const stats = [
    {
      icon: Building,
      number: "50+",
      label: "Projects Completed",
      description: "From residential homes to commercial complexes",
    },
    {
      icon: Award,
      number: "8+",
      label: "Years Experience",
      description: "Delivering excellence in architectural design",
    },
    {
      icon: CheckCircle,
      number: "98%",
      label: "Client Satisfaction",
      description: "Trusted by clients across Ghana",
    },
    {
      icon: Users,
      number: "100+",
      label: "Happy Clients",
      description: "Building lasting relationships",
    },
  ]

  return (
    <section className="py-20 bg-sand/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-indigo-deep mb-4">Proven Track Record</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our commitment to excellence is reflected in our achievements and the trust our clients place in us.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-white h-full flex flex-col"
              >
                <CardContent className="p-8 flex flex-col items-center justify-center flex-grow">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta/10 rounded-full mb-6">
                    <IconComponent className="w-8 h-8 text-terracotta" />
                  </div>
                  <div className="text-4xl font-bold text-indigo-deep mb-2 text-center break-words">{stat.number}</div>
                  <div className="text-lg font-semibold text-gray-800 mb-2 text-center break-words">{stat.label}</div>
                  <div className="text-sm text-gray-600 text-center leading-relaxed">{stat.description}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
