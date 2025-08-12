import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, ArrowDown } from "lucide-react"

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-indigo-deep via-indigo-deep/95 to-indigo-deep/90">
          <video
            className="w-full h-full object-cover opacity-15"
            autoPlay
            muted
            loop
            playsInline
            poster="/placeholder.svg?height=1080&width=1920"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-deep/70 via-indigo-deep/80 to-indigo-deep/90"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Trust Badge */}
        <div className="mb-8">
          <Badge variant="secondary" className="bg-sand/25 text-sand border-sand/40 px-6 py-3 text-sm font-medium">
            <Award className="w-4 h-4 mr-2" />
            Ghana Institution of Architects (GIA) Certified
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-6 leading-tight max-w-5xl mx-auto">
          Transform Your Vision Into{" "}
          <span className="text-terracotta bg-gradient-to-r from-terracotta to-terracotta-light bg-clip-text text-transparent">
            Enduring Structures
          </span>
        </h1>

        <p className="text-lg sm:text-xl lg:text-2xl text-sand/90 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
          End-to-end Design-to-Build architectural services in Ghana
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            size="lg"
            className="bg-terracotta hover:bg-terracotta-hover text-white px-10 py-4 text-lg font-semibold w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Get Free Consultation
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-sand text-sand hover:bg-sand hover:text-indigo-deep px-10 py-4 text-lg font-semibold w-full sm:w-auto bg-transparent backdrop-blur-sm transition-all duration-300"
          >
            View Our Portfolio
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { number: "50+", label: "Projects Completed" },
            { number: "8+", label: "Years Experience" },
            { number: "98%", label: "Client Satisfaction" },
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl lg:text-5xl font-bold text-terracotta mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-sand/80 text-sm lg:text-base font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sand/70 text-xs font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-sand/60 rounded-full flex justify-center">
            <ArrowDown className="w-3 h-3 text-sand/60 mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
