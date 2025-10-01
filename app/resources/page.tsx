import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MaterialsDatabase from "@/components/resources/MaterialsDatabase";
import CompanyOrganogram from "@/components/resources/CompanyOrganogram";
import { getMaterials } from "@/sanity/lib/api";

export const metadata: Metadata = {
  title: "Resources - Amart Consult | Construction Materials & Company Info",
  description:
    "Explore our comprehensive database of construction materials used in Ghana, complete with applications and price ranges. Learn about our team structure and expertise.",
};

export default async function ResourcesPage() {
  const materials = await getMaterials();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-indigo-deep to-indigo-deep/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
              Construction Resources Hub
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              Your comprehensive guide to building materials and our expert team
              structure
            </p>
          </div>
        </div>
      </section>

      {/* Materials Database Section */}
      <MaterialsDatabase materials={materials} />

      {/* Company Organogram Section */}
      <CompanyOrganogram />

      {/* CTA Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-4">
            Need Expert Guidance?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our team is ready to help you select the right materials and plan
            your construction project
          </p>
          <Link href="/#contact">
            <Button
              size="lg"
              className="bg-terracotta hover:bg-terracotta/90 text-white px-8 py-3"
            >
              Get a Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
