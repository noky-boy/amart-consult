import { Button } from "@/components/ui/button"
import { BookOpen, ArrowRight } from "@/components/ui/icons"
import Link from "next/link"

export default function BlogCTA() {
  return (
    <section className="py-16 bg-gradient-to-br from-indigo-deep via-indigo-deep/95 to-indigo-deep/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta rounded-full mb-6">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Stay Informed with Our Latest Insights
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Discover expert perspectives on architecture, construction, and design trends in Ghana and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog">
              <Button size="lg" className="bg-terracotta hover:bg-terracotta/90 text-white">
                Read Our Blog
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-indigo-deep bg-transparent"
            >
              Subscribe to Newsletter
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
