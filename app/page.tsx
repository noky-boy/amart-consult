import Hero from "@/components/hero";
// import Services from "@/components/services";
// import Portfolio from "@/components/portfolio";
// import BlogPreview from "@/components/blog-preview";
import PortalCTA from "@/components/portal-cta";
// import NewsletterSignup from "@/components/newsletter-signup";
// import ExitIntentPopup from "@/components/exit-intent-popup";
import CoreServicesShowcase from "@/components/core-services-showcase";
import Contact from "@/components/contact";
import { getHomepageData } from "@/sanity/lib/api";

export default async function HomePage() {
  const homepageData = await getHomepageData();

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <CoreServicesShowcase />
      {/* <Services packages={homepageData.popularPackages} />
      <Portfolio projects={homepageData.featuredPortfolio} />
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-terracotta-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup variant="homepage" showIncentive={true} />
        </div>
      </section>
      <BlogPreview posts={homepageData.featuredBlogPosts} /> */}
      <Contact />
      <PortalCTA />
    </div>
  );
}
