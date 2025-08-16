import { PortableText, type PortableTextComponents } from "@portabletext/react"
import { SanityImage } from "@/components/sanity-image"

// Custom components for rendering portable text
const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <div className="my-8">
        <SanityImage image={value} alt={value.alt || ""} width={800} height={600} className="rounded-lg shadow-lg" />
        {value.caption && <p className="text-center text-sm text-gray-600 mt-2">{value.caption}</p>}
      </div>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-serif font-bold text-indigo-deep mb-6">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-4 mt-8">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-serif font-bold text-indigo-deep mb-3 mt-6">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-semibold text-indigo-deep mb-2 mt-4">{children}</h4>,
    normal: ({ children }) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-terracotta pl-6 py-4 my-6 bg-sand-light/30 italic text-gray-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="ml-4">{children}</li>,
    number: ({ children }) => <li className="ml-4">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-indigo-deep">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value.href}
        className="text-terracotta hover:text-terracotta-hover underline transition-colors"
        target={value.blank ? "_blank" : undefined}
        rel={value.blank ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  },
}

interface CustomPortableTextProps {
  value: any[]
  className?: string
}

export function CustomPortableText({ value, className = "" }: CustomPortableTextProps) {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  )
}
