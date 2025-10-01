"use client";

import { useState } from "react";
import MaterialCard from "./MaterialCard";
import { Button } from "@/components/ui/button";
import type { Material } from "@/sanity/lib/types";

interface MaterialsDatabaseProps {
  materials: Material[];
}

const categories = [
  { value: "all", label: "All Materials" },
  { value: "structural", label: "Structural" },
  { value: "finishing", label: "Finishing" },
  { value: "fixtures", label: "Fixtures & Fittings" },
  { value: "roofing", label: "Roofing" },
  { value: "electrical-plumbing", label: "Electrical & Plumbing" },
];

export default function MaterialsDatabase({
  materials,
}: MaterialsDatabaseProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredMaterials =
    selectedCategory === "all"
      ? materials
      : materials.filter((m) => m.category === selectedCategory);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-indigo-deep mb-4">
            Construction Materials Database
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive guide to common building materials used in Ghana, with
            typical applications and price ranges
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              variant={
                selectedCategory === category.value ? "default" : "outline"
              }
              className={
                selectedCategory === category.value
                  ? "bg-indigo-deep hover:bg-indigo-deep/90 text-white"
                  : "border-indigo-deep text-indigo-deep hover:bg-indigo-deep/10"
              }
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Materials Grid */}
        {filteredMaterials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMaterials.map((material) => (
              <MaterialCard key={material._id} material={material} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No materials found in this category. Check back soon!
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-sand/20 rounded-lg border border-sand">
          <p className="text-sm text-gray-600 text-center">
            <strong>Note:</strong> Prices shown are approximate ranges based on
            current market rates in Ghana and may vary by supplier, location,
            and quantity. For accurate pricing and availability, please contact
            our team for a detailed quote.
          </p>
        </div>
      </div>
    </section>
  );
}
