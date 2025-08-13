import Hero from "@/components/hero"
import Services from "@/components/services"
import Portfolio from "@/components/portfolio"
import BlogPreview from "@/components/blog-preview"
import PortalCTA from "@/components/portal-cta"
import Contact from "@/components/contact"
import NewsletterSignup from "@/components/newsletter-signup"
import ExitIntentPopup from "@/components/exit-intent-popup"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Services />
      <Portfolio />
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-terracotta-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup variant="homepage" showIncentive={true} />
        </div>
      </section>
      <BlogPreview />
      <PortalCTA />
      <Contact />
      <ExitIntentPopup />
    </div>
  )
}
