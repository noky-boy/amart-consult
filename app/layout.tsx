import type React from "react";
import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";

import Navigation from "@/components/navigation";
import WhatsAppFloat from "@/components/whatsapp-float";
import Footer from "@/components/footer";
import { AuthProvider } from "@/hooks/useAuth";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700"], // Only weights used in the codebase
  preload: true, // Preload for better LCP performance
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "sans-serif",
  ],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"], // Only weights used in the codebase
  preload: true, // Preload for better LCP performance
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://amart-consult.vercel.app"),
  title: {
    default:
      "Amart Consult - Premier Architectural & Construction Services in Ghana",
    template: "%s | Amart Consult",
  },
  description:
    "Leading architectural design and construction management firm in Ghana. 50+ projects completed, 8+ years experience. Expert design-to-build services, BOQ preparation, and project consultation.",
  keywords: [
    "architecture Ghana",
    "construction management Ghana",
    "architectural design",
    "building construction",
    "bill of quantities",
    "project consultation Ghana",
    "design and build Ghana",
    "Amart Consult",
    "construction services Accra",
  ],
  authors: [{ name: "Amart Consult" }],
  creator: "Amart Consult",
  publisher: "Amart Consult",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://amart-consult.vercel.app",
    siteName: "Amart Consult",
    title:
      "Amart Consult - Premier Architectural & Construction Services in Ghana",
    description:
      "Leading architectural design and construction management firm in Ghana. 50+ projects completed, 8+ years experience.",
    images: [
      {
        url: "/images/amart-logo.png", // Update this to your actual OG image
        width: 1200,
        height: 630,
        alt: "Amart Consult - Architectural Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Amart Consult - Premier Architectural & Construction Services in Ghana",
    description:
      "Leading architectural design and construction management firm in Ghana. 50+ projects completed, 8+ years experience.",
    images: ["/images/amart-logo.png"], // Update this to your actual Twitter card image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  verification: {
    // Add Google Search Console verification here once you set it up
    // google: 'your-google-verification-code',
  },
    generator: 'v0.app'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${openSans.variable} antialiased`}
    >
      <head></head>
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-indigo-deep focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          >
            Skip to main content
          </a>
          <header role="banner">
            <Navigation />
          </header>
          <main id="main-content" role="main">
            {children}
          </main>
          <WhatsAppFloat />
          <footer role="contentinfo">
            <Footer />
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
