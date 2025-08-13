import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-terracotta-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-indigo-900 mb-4">Your Calculator is On Its Way!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Check your email for the Ghana Building Cost Calculator & Guide. It should arrive within the next few
            minutes.
          </p>

          <Card className="bg-white border-indigo-200 shadow-lg mb-8">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-indigo-900 mb-6">While You Wait, Explore These Resources:</h2>
              <div className="grid gap-4">
                <a
                  href="/blog"
                  className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <div className="text-left">
                    <h3 className="font-semibold text-indigo-900">Construction Blog</h3>
                    <p className="text-sm text-gray-600">Latest insights on Ghana building trends</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-indigo-600" />
                </a>
                <a
                  href="/portfolio"
                  className="flex items-center justify-between p-4 bg-terracotta-50 rounded-lg hover:bg-terracotta-100 transition-colors"
                >
                  <div className="text-left">
                    <h3 className="font-semibold text-indigo-900">Project Portfolio</h3>
                    <p className="text-sm text-gray-600">See our completed Ghana projects</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-terracotta-600" />
                </a>
                <a
                  href="/services"
                  className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <div className="text-left">
                    <h3 className="font-semibold text-indigo-900">Our Services</h3>
                    <p className="text-sm text-gray-600">Full architectural and construction services</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-indigo-600" />
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
              <a href="/">Return to Homepage</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-terracotta-600 text-terracotta-600 hover:bg-terracotta-50 bg-transparent"
            >
              <a href="/contact">Get Free Consultation</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
