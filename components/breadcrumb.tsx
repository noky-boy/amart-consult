"use client"

import Link from "next/link"
import { ChevronRight, Home } from "@/components/ui/icons"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-gray-600">
      <Link
        href="/"
        className="flex items-center hover:text-indigo-deep transition-colors focus-visible:ring-enhanced rounded-md px-1 py-1"
        aria-label="Go to homepage"
      >
        <Home className="w-4 h-4" aria-hidden="true" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-indigo-deep transition-colors focus-visible:ring-enhanced rounded-md px-1 py-1"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className="text-indigo-deep font-medium"
              aria-current={index === items.length - 1 ? "page" : undefined}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
