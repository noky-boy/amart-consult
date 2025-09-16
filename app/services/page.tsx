import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  MessageCircle,
  Building2,
  Calculator,
  Users,
  MessageSquare,
  CheckCircle,
  Star,
} from "@/components/ui/icons";
import { SanityImage } from "@/components/sanity-image";
import { getServicesForListing } from "@/sanity/lib/api"; // Use optimized function
import WhatsAppFormTrigger from "@/components/whatsapp-form-trigger";

// Service configuration with CORRECT URLs matching your actual slugs
const serviceConfig = {
  "architectural-designs": {
    icon: Building2,
    color: "from-blue-500 to-indigo-600",
    href: "/services/architectural-designs",
  },
  "bill-of-quantities": {
    icon: Calculator,
    color: "from-emerald-500 to-teal-600",
    href: "/services/bill-of-quantities",
  },
  "construction-management": {
    icon: Users,
    color: "from-orange-500 to-red-600",
    href: "/services/construction-management",
  },
  "project-consultation": {
    icon: MessageSquare,
    color: "from-purple-500 to-pink-600",
    href: "/services/project-consultation",
  },
};

// Fallback mapping for unknown services
const defaultServiceConfig = {
  icon: Building2,
  color: "from-indigo-500 to-purple-600",
  href: "/services",
};

export const metadata: Metadata = {
  title: "Our Services - Amart Consult",
  description:
    "Comprehensive architectural and construction services in Ghana. From design to build, we transform your vision into enduring structures.",
};

export default async function ServicesPage() {
  const services = await getServicesForListing(); // Use optimized function

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-sand-light/30 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-indigo-deep">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-indigo-deep font-medium">Services</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-terracotta-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-indigo-deep/10 text-indigo-deep px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Professional Architectural Services
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
              Comprehensive{" "}
              <span className="text-indigo-deep">Design-to-Build</span>{" "}
              Solutions
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              From initial concept to final construction, we provide end-to-end
              architectural and construction services that transform your vision
              into enduring, beautiful structures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WhatsAppFormTrigger
                triggerText="Get Free Consultation"
                size="lg"
                className="bg-terracotta hover:bg-terracotta-hover text-white px-8 py-4 text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Get Free Consultation
              </WhatsAppFormTrigger>
              <Link href="/portfolio">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-indigo-deep text-indigo-deep hover:bg-indigo-deep hover:text-white px-8 py-4 text-lg bg-white"
                  suppressHydrationWarning
                >
                  View Our Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Our Core Services
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Each service is designed to deliver excellence, precision, and
              innovation tailored to your unique needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {services?.map((service) => {
              // Get the service slug from Sanity
              const serviceSlug = service.slug?.current;

              // Find matching configuration using the actual slug
              const config = serviceSlug
                ? serviceConfig[serviceSlug as keyof typeof serviceConfig] ||
                  defaultServiceConfig
                : defaultServiceConfig;

              const IconComponent = config.icon;
              const colorClass = config.color;
              const serviceHref = serviceSlug
                ? `/services/${serviceSlug}`
                : config.href;

              console.log(
                "Service:",
                service.title,
                "Slug:",
                serviceSlug,
                "Href:",
                serviceHref
              ); // Debug log

              return (
                <Card
                  key={service._id}
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 bg-white"
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                  />

                  <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    {service.image && (
                      <div className="md:w-1/3 relative overflow-hidden">
                        <SanityImage
                          image={service.image}
                          alt={service.title}
                          width={300}
                          height={250}
                          className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-t ${colorClass} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                        />
                      </div>
                    )}

                    {/* Content Section */}
                    <div className={service.image ? "md:w-2/3 p-8" : "p-8"}>
                      <CardHeader className="p-0 mb-6">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`p-3 rounded-2xl bg-gradient-to-br ${colorClass} shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110 flex-shrink-0`}
                          >
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-serif text-indigo-deep mb-3 group-hover:text-indigo-deep-hover transition-colors duration-300">
                              {service.title}
                            </CardTitle>
                            <CardDescription className="text-gray-600 leading-relaxed text-base">
                              {service.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-0 space-y-6">
                        {/* Features */}
                        {service.features && service.features.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-semibold text-indigo-deep flex items-center">
                              <CheckCircle className="w-5 h-5 mr-2 text-terracotta" />
                              Key Features:
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {service.features.map(
                                (feature: string, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center text-sm text-gray-700"
                                  >
                                    <div
                                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${colorClass} mr-3 flex-shrink-0`}
                                    />
                                    <span>{feature}</span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* CTA Button */}
                        <div className="pt-4">
                          <Link
                            href={serviceHref}
                            className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all bg-gradient-to-r ${colorClass} text-white hover:shadow-lg hover:scale-105 group/btn`}
                          >
                            Explore {service.title}
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-gradient-to-r from-sand-light to-terracotta-50 rounded-3xl p-8 md:p-12 mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-indigo-deep mb-4">
                Why Choose Amart Consult?
              </h3>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Our commitment to excellence and attention to detail sets us
                apart in the architectural industry.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white p-4 rounded-2xl shadow-lg mb-4 w-fit mx-auto">
                  <Star className="w-8 h-8 text-terracotta" />
                </div>
                <h4 className="text-xl font-serif font-bold text-indigo-deep mb-2">
                  8+ Years Experience
                </h4>
                <p className="text-gray-600">
                  Proven track record in delivering exceptional architectural
                  solutions across Ghana.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white p-4 rounded-2xl shadow-lg mb-4 w-fit mx-auto">
                  <CheckCircle className="w-8 h-8 text-terracotta" />
                </div>
                <h4 className="text-xl font-serif font-bold text-indigo-deep mb-2">
                  50+ Projects Completed
                </h4>
                <p className="text-gray-600">
                  From residential homes to commercial buildings, we've brought
                  countless visions to life.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white p-4 rounded-2xl shadow-lg mb-4 w-fit mx-auto">
                  <Users className="w-8 h-8 text-terracotta" />
                </div>
                <h4 className="text-xl font-serif font-bold text-indigo-deep mb-2">
                  98% Client Satisfaction
                </h4>
                <p className="text-gray-600">
                  Our clients consistently rate us highly for our
                  professionalism and quality delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-deep to-indigo-deep-hover text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-sand/90 mb-8 max-w-2xl mx-auto">
            Let's discuss how our comprehensive services can bring your
            architectural vision to life with precision and excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <WhatsAppFormTrigger
              triggerText="Get Free Consultation"
              size="lg"
              className="bg-terracotta hover:bg-terracotta-hover text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Get Free Consultation
            </WhatsAppFormTrigger>
            <Link href="/portfolio">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-indigo-deep px-8 py-4 text-lg font-semibold transition-all duration-300 bg-transparent"
                suppressHydrationWarning
              >
                View Our Work
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
