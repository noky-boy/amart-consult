import { Button } from "@/components/ui/button"
import { Shield, Users, BarChart3, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PortalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-deep via-indigo-deep/95 to-indigo-deep/90 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-terracotta rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sand rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Exclusive Client Portal</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Access your dedicated project dashboard with real-time updates, secure communication, and comprehensive
            project tracking designed exclusively for our Tier 3 clients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Features */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-terracotta/20 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-terracotta" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Secure Access</h3>
                <p className="text-white/80">Bank-level security with encrypted data and role-based access control.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-terracotta/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-terracotta" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Real-Time Tracking</h3>
                <p className="text-white/80">Monitor project progress, milestones, and timelines with live updates.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-terracotta/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-terracotta" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Direct Communication</h3>
                <p className="text-white/80">
                  Connect directly with your project team and access all project documents.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-terracotta/20 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-terracotta" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Tier 3 Exclusive</h3>
                <p className="text-white/80">Premium features available only to our comprehensive service clients.</p>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-center">
              <div className="w-20 h-20 bg-terracotta/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-terracotta" />
              </div>

              <h3 className="text-2xl font-serif font-bold text-white mb-4">Access Your Dashboard</h3>

              <p className="text-white/80 mb-8">
                Already a Tier 3 client? Sign in to your secure portal to track your project progress and communicate
                with your team.
              </p>

              <div className="space-y-4">
                <Link href="/portal/login" className="block">
                  <Button className="w-full bg-terracotta hover:bg-terracotta-warm text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    Sign In to Portal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <p className="text-sm text-white/60">
                  New client?
                  <Link
                    href="#contact"
                    className="text-terracotta hover:text-terracotta-warm font-medium ml-1 transition-colors duration-300"
                  >
                    Contact us to get started
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
