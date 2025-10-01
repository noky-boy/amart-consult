import Hero from "@/components/hero";
import PortalCTA from "@/components/portal-cta";
import CoreServicesShowcase from "@/components/core-services-showcase";
import Contact from "@/components/contact";
import { getHomepageData } from "@/sanity/lib/api";

export default async function HomePage() {
  const homepageData = await getHomepageData();

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Amart Consult",
    alternateName: "Amart Consult Ghana",
    url: "https://amart-consult.vercel.app",
    logo: "https://amart-consult.vercel.app/images/amart-logo.png",
    description:
      "Premier architectural design and construction management firm in Ghana. Specializing in end-to-end design-to-build services with over 8 years of experience and 50+ completed projects.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "GH",
      addressLocality: "Accra",
      addressRegion: "Greater Accra",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["en"],
    },
    areaServed: {
      "@type": "Country",
      name: "Ghana",
    },
    foundingDate: "2016",
    knowsAbout: [
      "Architectural Design",
      "Construction Management",
      "Bill of Quantities",
      "Project Consultation",
      "Design and Build Services",
      "Building Construction",
      "Structural Engineering",
    ],
    slogan: "Transform Your Vision Into Enduring Structures",
  };

  // Local Business Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Amart Consult",
    image: "https://amart-consult.vercel.app/images/amart-logo.png",
    "@id": "https://amart-consult.vercel.app",
    url: "https://amart-consult.vercel.app",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "GH",
      addressLocality: "Accra",
      addressRegion: "Greater Accra",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 5.6037,
      longitude: -0.187,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  };

  // Service Schema
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "Service",
        name: "Architectural Design",
        description:
          "Professional architectural design services for residential and commercial projects",
        provider: {
          "@type": "Organization",
          name: "Amart Consult",
        },
      },
      {
        "@type": "Service",
        name: "Construction Management",
        description:
          "Comprehensive construction management and project oversight",
        provider: {
          "@type": "Organization",
          name: "Amart Consult",
        },
      },
      {
        "@type": "Service",
        name: "Bill of Quantities",
        description:
          "Detailed cost estimation and bill of quantities preparation",
        provider: {
          "@type": "Organization",
          name: "Amart Consult",
        },
      },
      {
        "@type": "Service",
        name: "Project Consultation",
        description:
          "Expert consultation for construction and building projects",
        provider: {
          "@type": "Organization",
          name: "Amart Consult",
        },
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />

      <div className="min-h-screen bg-white">
        <Hero />
        <CoreServicesShowcase />
        <Contact />
        <PortalCTA />
      </div>
    </>
  );
}
