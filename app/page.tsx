import Hero from "@/components/hero"
import Statistics from "@/components/statistics"
import Services from "@/components/services"
import Portfolio from "@/components/portfolio"
import BlogPreview from "@/components/blog-preview"
import PortalCTA from "@/components/portal-cta"
import Contact from "@/components/contact"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Statistics />
      <Services />
      <Portfolio />
      <BlogPreview />
      <PortalCTA />
      <Contact />
    </div>
  )
}
