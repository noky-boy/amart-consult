"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
} from "@/components/ui/icons";
import NewsletterSignup from "@/components/newsletter-signup";

export default function Footer() {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <footer className="bg-slate-900 text-white">
      {/* <div className="border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <NewsletterSignup variant="footer" showIncentive={true} />
        </div>
      </div> */}

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="/images/amart-logo.png"
                alt="Amart Consult"
                className="h-8 w-auto"
              />
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Transform Your Vision Into Enduring Structures. End-to-end
              Design-to-Build architectural services in Ghana.
            </p>
            <div className="flex items-center space-x-2 text-sm text-slate-300">
              <Clock className="h-4 w-4 text-terracotta" />
              <span>8+ Years Experience</span>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-white">
              Our Services
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services/architectural-designs"
                  className={`transition-colors ${
                    isActiveLink("/services/architectural-designs")
                      ? "text-terracotta font-medium"
                      : "text-slate-300 hover:text-terracotta"
                  }`}
                >
                  Architectural Designs
                </Link>
              </li>
              <li>
                <Link
                  href="/services/bill-of-quantities"
                  className={`transition-colors ${
                    isActiveLink("/services/bill-of-quantities")
                      ? "text-terracotta font-medium"
                      : "text-slate-300 hover:text-terracotta"
                  }`}
                >
                  Bill of Quantities
                </Link>
              </li>
              <li>
                <Link
                  href="/services/construction-management"
                  className={`transition-colors ${
                    isActiveLink("/services/construction-management")
                      ? "text-terracotta font-medium"
                      : "text-slate-300 hover:text-terracotta"
                  }`}
                >
                  Construction Management
                </Link>
              </li>
              <li>
                <Link
                  href="/services/project-consultation"
                  className={`transition-colors ${
                    isActiveLink("/services/project-consultation")
                      ? "text-terracotta font-medium"
                      : "text-slate-300 hover:text-terracotta"
                  }`}
                >
                  Project Consultation
                </Link>
              </li>
              <li>
                <Link
                  href="/portal/login"
                  className={`transition-colors ${
                    isActiveLink("/portal/login")
                      ? "text-terracotta font-medium"
                      : "text-slate-300 hover:text-terracotta"
                  }`}
                >
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className={`transition-colors ${
                    isActiveLink("/") && pathname === "/"
                      ? "text-terracotta font-medium"
                      : "text-slate-300 hover:text-terracotta"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`transition-colors ${
                    isActiveLink("/about")
                      ? "text-terracotta font-medium"
                      : "text-slate-300 hover:text-terracotta"
                  }`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className={`transition-colors ${
                    isActiveLink("/portfolio")
                      ? "text-terracotta font-medium"
                      : "text-slate-300 hover:text-terracotta"
                  }`}
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className={`transition-colors ${
                    isActiveLink("/blog")
                      ? "text-terracotta font-medium"
                      : "text-slate-300 hover:text-terracotta"
                  }`}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className={`transition-colors ${
                    isActiveLink("/resources")
                      ? "text-terracotta font-medium"
                      : "text-slate-300 hover:text-terracotta"
                  }`}
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-white">
              Get In Touch
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-terracotta mt-0.5 flex-shrink-0" />
                <div>
                  <a
                    href="tel:+233543543356"
                    className="text-slate-300 hover:text-terracotta transition-colors"
                  >
                    +233 54 354 3356
                  </a>
                  <p className="text-xs text-slate-400">Nathan Amarkwei</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-terracotta mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:amartconsult1@gmail.com"
                  className="text-slate-300 hover:text-terracotta transition-colors"
                >
                  amartconsult1@gmail.com
                </a>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-terracotta mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">Accra, Ghana</span>
              </div>

              {/* vCard Link */}
              <div className="pt-2">
                <a
                  href="https://linko.page/ry6zcs6o1qsu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-sm bg-terracotta hover:bg-terracotta/90 text-white px-3 py-2 rounded-md transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Save Contact</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-slate-400">
              © {new Date().getFullYear()} Amart Consult. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-slate-400">50+ Projects Completed</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400">98% Client Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
