import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Material } from "@/sanity/lib/types";

interface MaterialCardProps {
  material: Material;
}

const categoryColors: Record<string, string> = {
  structural: "from-blue-500 to-indigo-600",
  finishing: "from-emerald-500 to-teal-600",
  fixtures: "from-orange-500 to-red-600",
  roofing: "from-purple-500 to-pink-600",
  "electrical-plumbing": "from-amber-500 to-orange-600",
};

const categoryLabels: Record<string, string> = {
  structural: "Structural",
  finishing: "Finishing",
  fixtures: "Fixtures & Fittings",
  roofing: "Roofing",
  "electrical-plumbing": "Electrical & Plumbing",
};

export default function MaterialCard({ material }: MaterialCardProps) {
  const gradientColor =
    categoryColors[material.category] || "from-gray-500 to-gray-600";

  const formatPrice = () => {
    const { min, max, unit, currency, note } = material.priceRange;

    if (note) return note;

    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()} per ${unit}`;
    }

    if (min) {
      return `From ${currency} ${min.toLocaleString()} per ${unit}`;
    }

    return "Contact for pricing";
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        {material.image ? (
          <Image
            src={material.image}
            alt={material.imageAlt || material.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradientColor} flex items-center justify-center`}
          >
            <span className="text-white text-4xl font-bold opacity-50">
              {material.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        {/* Category Badge */}
        <div className="mb-2">
          <Badge
            className={`bg-gradient-to-r ${gradientColor} text-white border-0`}
          >
            {categoryLabels[material.category]}
          </Badge>
        </div>

        {/* Material Name */}
        <CardTitle className="text-xl font-serif text-indigo-deep">
          {material.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {material.description}
        </p>

        {/* Applications */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-indigo-deep mb-2">
            Typical Applications:
          </h4>
          <ul className="space-y-1">
            {material.applications.slice(0, 3).map((app, index) => (
              <li
                key={index}
                className="text-sm text-gray-600 flex items-start"
              >
                <span className="text-terracotta mr-2">•</span>
                <span>{app}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Range */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <p className="text-sm font-semibold text-indigo-deep mb-1">
            Price Range:
          </p>
          <p className="text-sm text-gray-700">{formatPrice()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
