import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { client } from "@/sanity/lib/client";
import {
  featuredTestimonialsQuery,
  processStepsQuery,
  credentialsQuery,
} from "@/sanity/lib/queries";
import type { Testimonial, ProcessStep, Credential } from "@/sanity/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Us - Amart Consult | Architectural Excellence in Ghana",
  description:
    "Learn about Amart Consult's story, our design-to-build process, and why we're Ghana's trusted architectural partner for local and diaspora clients.",
};

// ─── Fallback data (shown while Sanity has no content yet) ───────────────────

const FALLBACK_TESTIMONIALS: Partial<Testimonial>[] = [
  {
    _id: "1",
    name: "Kwame A.",
    company: "London, UK → Accra Project",
    content:
      "Amart Consult transformed our vision into reality. Their attention to detail and understanding of our needs as diaspora clients was exceptional.",
    rating: 5,
  },
  {
    _id: "2",
    name: "Ama S.",
    company: "Toronto, Canada → Kumasi Project",
    content:
      "The design-to-build service was seamless. We could monitor our project progress from Canada while they handled everything professionally.",
    rating: 5,
  },
  {
    _id: "3",
    name: "Joseph M.",
    company: "Tema, Ghana",
    content:
      "Outstanding architectural design and project management. Our commercial building was completed on time and within budget.",
    rating: 5,
  },
];

const FALLBACK_PROCESS: ProcessStep[] = [
  {
    _id: "1",
    stepNumber: 1,
    title: "Initial Consultation & Site Visit",
    description:
      "We begin with a comprehensive consultation to understand your vision, requirements, and budget. Our team conducts a thorough site analysis to inform the design process.",
  },
  {
    _id: "2",
    stepNumber: 2,
    title: "Design Development & Client Feedback",
    description:
      "Our architects create initial design concepts and work closely with you through iterative feedback sessions to refine the design to perfection.",
  },
  {
    _id: "3",
    stepNumber: 3,
    title: "Final Plans & 3D Visualization",
    description:
      "We deliver detailed architectural plans, technical drawings, and photorealistic 3D visualizations so you can see your project before construction begins.",
  },
  {
    _id: "4",
    stepNumber: 4,
    title: "Construction Management",
    description:
      "For Tier 3 clients, we provide comprehensive construction management, overseeing every aspect of the build process to ensure quality and timeline adherence.",
  },
  {
    _id: "5",
    stepNumber: 5,
    title: "Project Handover & Warranty",
    description:
      "Upon completion, we conduct a thorough walkthrough and provide comprehensive documentation along with our project warranty for your peace of mind.",
  },
];

const FALLBACK_CREDENTIALS: Credential[] = [
  {
    _id: "1",
    title: "Comprehensive Services",
    subtitle:
      "Architectural Design | Bill of Quantities | Construction Management",
    image: "/resources/marketing/amc-services-flier.jpg",
    order: 1,
  },
  {
    _id: "2",
    title: "GIA Certified",
    subtitle: "Ghana Institution of Architects Registered Professional",
    image: "/resources/marketing/amc-certification-flier.jpg",
    order: 2,
  },
  {
    _id: "3",
    title: "Diaspora Specialist",
    subtitle:
      "Serving Ghanaian communities worldwide with remote project management",
    image: "/resources/marketing/amc-diaspora-flier.jpg",
    order: 3,
  },
];

// ─── Step icons — mapped by stepNumber so they survive CMS reordering ────────
const STEP_ICONS: Record<number, React.ReactNode> = {
  1: <Users className="h-6 w-6" />,
  2: <CheckCircle className="h-6 w-6" />,
  3: <Award className="h-6 w-6" />,
  4: <MapPin className="h-6 w-6" />,
  5: <Clock className="h-6 w-6" />,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutPage() {
  // Fetch all three in parallel — if any fail, fall back gracefully
  const [testimonials, processSteps, credentials] = await Promise.all([
    client.fetch<Testimonial[]>(featuredTestimonialsQuery).catch(() => []),
    client.fetch<ProcessStep[]>(processStepsQuery).catch(() => []),
    client.fetch<Credential[]>(credentialsQuery).catch(() => []),
  ]);

  const displayTestimonials =
    testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;
  const displayProcess =
    processSteps.length > 0 ? processSteps : FALLBACK_PROCESS;
  const displayCredentials =
    credentials.length > 0 ? credentials : FALLBACK_CREDENTIALS;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-indigo-deep to-indigo-deep/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
              About Amart Consult
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              Bridging architectural excellence with Ghanaian heritage, serving
              clients locally and across the diaspora
            </p>
          </div>
        </div>
      </section>

      {/* ── Our Story ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Founded by Nathan Amarteifio, Amart Consult bridges the gap
                  between architectural design and construction in Ghana. We
                  understand the unique challenges of building in West Africa
                  and specialize in serving both local clients and the Ghanaian
                  diaspora worldwide.
                </p>
                <p>
                  Our journey began with a simple vision: to make quality
                  architectural services accessible to everyone, whether you're
                  building your dream home in Accra or planning a project from
                  abroad. We've grown into Ghana's trusted partner for
                  comprehensive design-to-build solutions.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Amart Consult team at work"
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-terracotta text-white p-6 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">8+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Professional Credentials — FROM SANITY ────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-sand-beige/20 to-sand-beige/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
              Our Professional Credentials
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Certified excellence and proven expertise in architectural design
              and construction management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            {displayCredentials.map((cred) => (
              <div
                key={cred._id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={cred.image || "/placeholder.svg"}
                  alt={cred.imageAlt ?? cred.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {cred.title}
                </h3>
                <p className="text-gray-600 text-sm">{cred.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us — stays hardcoded ──────────────────────────────── */}
      <section className="py-20 bg-sand-beige/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Why Choose Amart Consult
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine local expertise with international standards to deliver
              exceptional results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle className="h-8 w-8 text-terracotta" />,
                title: "End-to-End Services",
                description:
                  "Complete Design-to-Build services under one roof, from initial concept to final handover",
              },
              {
                icon: <MapPin className="h-8 w-8 text-terracotta" />,
                title: "Local Expertise",
                description:
                  "Deep understanding of Ghana's climate, building practices, and regulatory requirements",
              },
              {
                icon: <Users className="h-8 w-8 text-terracotta" />,
                title: "Diaspora Specialists",
                description:
                  "Specialized experience serving international clients and the Ghanaian diaspora worldwide",
              },
              {
                icon: <Award className="h-8 w-8 text-terracotta" />,
                title: "GIA Certified",
                description:
                  "Ghana Institution of Architects certified professionals ensuring quality and compliance",
              },
              {
                icon: <Clock className="h-8 w-8 text-terracotta" />,
                title: "Proven Track Record",
                description:
                  "8+ years of successful project delivery across residential and commercial sectors",
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-terracotta" />,
                title: "Quality Assurance",
                description:
                  "Rigorous quality control processes and comprehensive project warranties",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Process — FROM SANITY ──────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A proven methodology that ensures your project success from
              concept to completion
            </p>
          </div>

          <div className="relative">
            {/* Vertical timeline line — desktop only */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-indigo-deep to-terracotta" />

            <div className="space-y-12">
              {displayProcess.map((process, index) => (
                <div
                  key={process._id}
                  className={`flex items-center ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } flex-col lg:gap-12 gap-6`}
                >
                  {/* Text card */}
                  <div className="lg:w-1/2 w-full">
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="bg-indigo-deep text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                            {String(process.stepNumber).padStart(2, "0")}
                          </div>
                          <div className="bg-terracotta/10 text-terracotta rounded-full p-2">
                            {STEP_ICONS[process.stepNumber] ?? (
                              <CheckCircle className="h-6 w-6" />
                            )}
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {process.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {process.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Image — from Sanity if provided, else placeholder */}
                  <div className="lg:w-1/2 w-full">
                    <img
                      src={
                        process.image || `/placeholder.svg?height=300&width=500`
                      }
                      alt={process.imageAlt ?? process.title}
                      className="rounded-lg shadow-lg w-full h-64 object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Meet the Team — stays hardcoded (single founder) ─────────────── */}
      <section className="py-20 bg-sand-beige/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Led by experienced professionals committed to architectural
              excellence
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative">
                    <img
                      src="/placeholder.svg?height=400&width=400"
                      alt="Nathan Amarteifio, Principal Architect"
                      className="w-full h-96 md:h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="h-4 w-4 text-terracotta" />
                        <span>GIA Certified</span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                      <img
                        src="/resources/marketing/amc-founder-credential.jpg"
                        alt="Nathan Amarteifio Credentials"
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2">
                      Nathan Amarteifio
                    </h3>
                    <p className="text-lg text-terracotta font-medium mb-6">
                      Principal Architect & Founder
                    </p>
                    <div className="prose text-gray-600 mb-8">
                      <p>
                        With over 8 years of experience in architectural design
                        and construction management, Nathan leads Amart Consult
                        with a vision to transform Ghana's built environment
                        while serving the global Ghanaian community.
                      </p>
                      <p>
                        A registered member of the Ghana Institution of
                        Architects, Nathan specializes in sustainable design
                        practices and innovative solutions for West African
                        climates.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Phone className="h-4 w-4 text-terracotta" />
                        <span>+233 54 354 3356</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Mail className="h-4 w-4 text-terracotta" />
                        <span>amartconsult1@gmail.com</span>
                      </div>
                      <div className="pt-4">
                        <a
                          href="https://linko.page/ry6zcs6o1qsu"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 bg-terracotta hover:bg-terracotta-warm text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium"
                        >
                          <User className="h-4 w-4" />
                          <span>Save Contact Card</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Marketing materials grid */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-8">
              Our Marketing & Promotional Materials
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                {
                  src: "/resources/marketing/amc-social-1.jpg",
                  alt: "AMC Social Media Design 1",
                },
                {
                  src: "/resources/marketing/amc-social-2.jpg",
                  alt: "AMC Social Media Design 2",
                },
                {
                  src: "/resources/marketing/amc-social-3.jpg",
                  alt: "AMC Social Media Design 3",
                },
                {
                  src: "/resources/marketing/amc-social-4.jpg",
                  alt: "AMC Social Media Design 4",
                },
              ].map((flier, index) => (
                <div key={index} className="group cursor-pointer">
                  <img
                    src={flier.src || "/placeholder.svg"}
                    alt={flier.alt}
                    className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300 group-hover:scale-105 transform transition-transform"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Professional marketing materials showcasing our brand identity and
              services
            </p>
          </div>
        </div>
      </section>

      {/* ── Testimonials — FROM SANITY ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by clients across Ghana and the diaspora
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial, index) => (
              <Card
                key={testimonial._id ?? index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  {/* Stars */}
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating ?? 5)].map((_, i) => (
                      <div key={i} className="text-yellow-400 text-lg">
                        ★
                      </div>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-600 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author row — image + name + company */}
                  <div className="border-t pt-4 flex items-center gap-3">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image as string}
                        alt={testimonial.name}
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      // Fallback avatar circle with initial
                      <div className="w-11 h-11 rounded-full bg-indigo-deep flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {testimonial.name?.charAt(0) ?? "?"}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-indigo-deep to-indigo-deep/90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Let's discuss your architectural needs and create something
            extraordinary together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-terracotta hover:bg-terracotta/90 text-white px-8 py-3 text-lg"
            >
              Schedule Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-indigo-deep px-8 py-3 text-lg bg-transparent"
            >
              View Portfolio
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
