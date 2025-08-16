import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, MessageCircle, TrendingUp } from "@/components/ui/icons"
import { SanityImage } from "@/components/sanity-image"
import { CustomPortableText } from "@/sanity/lib/portable-text"
import { getServiceBySlug, getAllSlugs } from "@/sanity/lib/api"
import { generateMetadata as generateSanityMetadata } from "@/lib/sanity-utils"

interface ServicePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug)

  if (!service) {
    return {
      title: "Service Not Found",
    }
  }

  return generateSanityMetadata(service, "services")
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs("service")
  return slugs.map((item: any) => ({
    slug: item.slug,
  }))
}

export default async function ServicePage({ params }: ServicePageProps) {
  const service = await getServiceBySlug(params.slug)

  if (!service) {
    notFound()
  }

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
            <Link href="/services" className="text-gray-600 hover:text-indigo-deep">
              Services
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-indigo-deep font-medium">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-terracotta-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/services" className="inline-flex items-center text-indigo-deep hover:text-terracotta mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Link>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-indigo-deep mb-6">{service.title}</h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">{service.description}</p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-terracotta hover:bg-terracotta-hover text-white px-8 py-3">
                <MessageCircle className="w-5 h-5 mr-2" />
                Get Free Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-indigo-deep text-indigo-deep hover:bg-indigo-deep hover:text-white px-8 py-3 bg-transparent"
              >
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Image */}
      {service.image && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SanityImage
                image={service.image}
                alt={service.title}
                width={1200}
                height={600}
                className="rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {service.features && service.features.length > 0 && (
        <section className="py-16 bg-sand-light/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-8 text-center">What's Included</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="w-6 h-6 text-terracotta mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      {service.process && service.process.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-12 text-center">Our Process</h2>

              <div className="grid md:grid-cols-2 gap-8">
                {service.process.map((step, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-terracotta text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>
                        <CardTitle className="text-xl text-indigo-deep">{step.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      {service.content && service.content.length > 0 && (
        <section className="py-16 bg-sand-light/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <CustomPortableText value={service.content} />
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-deep to-indigo-deep-hover text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Let's discuss your project requirements and create something amazing together.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-terracotta hover:bg-terracotta-hover text-white px-8 py-3">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Free Consultation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-indigo-deep px-8 py-3 bg-transparent"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              View Our Work
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
