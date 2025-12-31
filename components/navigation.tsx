"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, User } from "@/components/ui/icons";
import Image from "next/image";
import Link from "next/link";
import WhatsAppConsultationForm from "./whatsapp-consultation-form";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWhatsAppFormOpen, setIsWhatsAppFormOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Enhanced handleNavClick with better navigation handling
  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);

    if (href.startsWith("#")) {
      // Handle hash links (like #contact)
      if (pathname === "/") {
        // If we're on homepage, scroll to the element
        setTimeout(() => {
          const element = document.getElementById(href.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        // If we're not on homepage, navigate to homepage with hash
        window.location.href = "/" + href;
      }
    } else if (href.startsWith("/")) {
      // Handle regular routes - let Next.js handle navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  const openWhatsAppForm = () => {
    setIsWhatsAppFormOpen(true);
    setIsMenuOpen(false);
  };

  // Close menu on route change (additional safety net)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Resources", href: "/resources" },
    { name: "Contact", href: "#contact" },
  ];

  const isActiveLink = (href: string) => {
    if (!isMounted) return false;

    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("#")) {
      return (
        pathname === "/" &&
        typeof window !== "undefined" &&
        window.location.hash === href &&
        document.getElementById(href.substring(1)) !== null
      );
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <div
        className={`hidden lg:block bg-indigo-deep text-white py-2 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "opacity-90" : "opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+233 54 354 3356</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>amartconsult1@gmail.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-terracotta">🏆</span> GIA Certified
                Architectural Firm
              </div>
              <a
                href="https://linko.page/ry6zcs6o1qsu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white hover:text-terracotta transition-colors duration-300 font-medium flex items-center space-x-1"
              >
                <User className="h-3 w-3" />
                <span>Nathan's Card</span>
              </a>
              <Link
                href="/portal/login"
                className="text-sm text-white hover:text-terracotta transition-colors duration-300 font-medium"
              >
                Client Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav
        className={`bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm fixed top-10 lg:top-10 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? "opacity-85 shadow-lg" : "opacity-100"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link
              href="/"
              className="flex-shrink-0 group cursor-pointer"
              onClick={() => handleNavClick("/")}
            >
              <Image
                src="/images/amart-logo.png"
                alt="Amart Consult - Home"
                width={140}
                height={46}
                className="h-12 w-auto transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 group-hover:drop-shadow-md focus-visible:ring-enhanced"
                priority
              />
            </Link>

            <div className="hidden lg:block">
              <nav role="navigation" aria-label="Primary navigation">
                <ul className="flex items-center space-x-1">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className={`relative px-4 py-2 font-medium text-sm transition-all duration-300 group focus-visible:ring-enhanced rounded-md ${
                          isActiveLink(item.href)
                            ? "text-indigo-deep bg-indigo-deep/5"
                            : "text-gray-700 hover:text-indigo-deep"
                        }`}
                        aria-current={
                          isActiveLink(item.href) ? "page" : undefined
                        }
                      >
                        <span className="relative z-10">{item.name}</span>
                        <div
                          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-terracotta to-indigo-deep transition-all duration-300 ${
                            isActiveLink(item.href)
                              ? "w-full"
                              : "w-0 group-hover:w-full"
                          }`}
                        ></div>
                        <div
                          className={`absolute inset-0 bg-gradient-to-r from-terracotta/5 to-indigo-deep/5 rounded-lg transition-opacity duration-300 ${
                            isActiveLink(item.href)
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                        ></div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/portal/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-indigo-deep hover:text-terracotta hover:bg-indigo-deep/5 transition-all duration-300 focus-visible:ring-enhanced"
                  aria-label="Sign in to client portal"
                >
                  Sign In
                </Button>
              </Link>

              <a href="tel:+233543543356">
                <Button
                  variant="outline"
                  className="border-indigo-deep text-indigo-deep hover:bg-indigo-deep hover:text-white transition-all duration-300 bg-transparent focus-visible:ring-enhanced"
                  aria-label="Call Amart Consult now"
                >
                  <Phone className="h-4 w-4 mr-2" aria-hidden="true" />
                  Call Now
                </Button>
              </a>
              <Button
                onClick={openWhatsAppForm}
                className="bg-indigo-deep hover:bg-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 focus-visible:ring-enhanced"
                aria-label="Get free architectural consultation via WhatsApp"
              >
                Get Free Consultation
              </Button>
            </div>

            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative p-2 hover:bg-gray-100 transition-colors duration-300 focus-visible:ring-enhanced"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={
                  isMenuOpen ? "Close navigation menu" : "Open navigation menu"
                }
              >
                <div className="relative w-6 h-6">
                  <Menu
                    className={`h-6 w-6 absolute transition-all duration-300 ${
                      isMenuOpen
                        ? "opacity-0 rotate-180"
                        : "opacity-100 rotate-0"
                    }`}
                  />
                  <X
                    className={`h-6 w-6 absolute transition-all duration-300 ${
                      isMenuOpen
                        ? "opacity-100 rotate-0"
                        : "opacity-0 -rotate-180"
                    }`}
                  />
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
          id="mobile-menu"
        >
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 font-medium transition-all duration-300 transform hover:translate-x-2 rounded-lg ${
                    isActiveLink(item.href)
                      ? "text-indigo-deep bg-gradient-to-r from-terracotta/10 to-indigo-deep/10 border-l-4 border-indigo-deep"
                      : "text-gray-700 hover:text-indigo-deep hover:bg-gradient-to-r hover:from-terracotta/5 hover:to-indigo-deep/5"
                  }`}
                  onClick={() => handleNavClick(item.href)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  aria-current={isActiveLink(item.href) ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 space-y-3 border-t border-gray-200 mt-4">
                {/* FIXED: Client Portal link now closes menu */}
                <Link
                  href="/portal/login"
                  onClick={() => handleNavClick("/portal/login")}
                >
                  <Button
                    variant="ghost"
                    className="w-full text-indigo-deep hover:text-terracotta hover:bg-indigo-deep/5 transition-all duration-300 justify-start focus-visible:ring-enhanced"
                    aria-label="Sign in to client portal"
                  >
                    Client Portal Sign In
                  </Button>
                </Link>

                <a href="tel:+233543543356">
                  <Button
                    variant="outline"
                    className="w-full border-indigo-deep text-indigo-deep hover:bg-indigo-deep hover:text-white transition-all duration-300 bg-transparent focus-visible:ring-enhanced"
                    aria-label="Call Amart Consult now"
                  >
                    <Phone className="h-4 w-4 mr-2" aria-hidden="true" />
                    Call Now
                  </Button>
                </a>

                <Button
                  onClick={openWhatsAppForm}
                  className="w-full bg-indigo-deep hover:bg-indigo-800 text-white shadow-lg transition-all duration-300 focus-visible:ring-enhanced"
                  aria-label="Get free architectural consultation via WhatsApp"
                >
                  Get Free Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-10 lg:h-10"></div>
      <div className="h-20"></div>

      <WhatsAppConsultationForm
        isOpen={isWhatsAppFormOpen}
        onClose={() => setIsWhatsAppFormOpen(false)}
      />
    </>
  );
}
