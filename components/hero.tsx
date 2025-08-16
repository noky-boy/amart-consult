"use client"

import { useState, useEffect } from "react"
import OptimizedImage from "./optimized-image"

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slideImages = [
    "/resources/hero/modern-residential-villa.jpg",
    "/resources/hero/commercial-complex.jpg",
    "/resources/hero/contemporary-glass-house.jpg",
    "/resources/hero/luxury-pool-villa.jpg",
    "/resources/hero/evening-modern-home.jpg",
    "/resources/hero/minimalist-single-story.jpg",
    "/resources/hero/urban-apartment-complex.jpg",
    "/resources/hero/colorful-townhouses.jpg",
  ]

  const imageDescriptions = [
    "Modern residential villa with contemporary design and luxury features",
    "Commercial complex showcasing innovative architectural solutions",
    "Contemporary glass house with seamless indoor-outdoor living",
    "Luxury pool villa featuring elegant design and premium amenities",
    "Evening view of modern home with sophisticated lighting design",
    "Minimalist single-story residence with clean architectural lines",
    "Urban apartment complex with modern facade and efficient design",
    "Colorful townhouses demonstrating vibrant architectural diversity",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length)
    }, 6500)

    return () => clearInterval(timer)
  }, [slideImages.length])

  return (
    <section id="home" className="relative h-screen overflow-hidden" aria-label="Amart Consult architectural showcase">
      <div className="absolute inset-0 z-0">
        {slideImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <OptimizedImage
              src={image}
              alt={imageDescriptions[index]}
              priority={index === 0} // Priority loading for first image only
              aspectRatio="16:9"
              objectFit="cover"
              className={`w-full h-full transform transition-transform duration-[6500ms] ease-out ${
                index === currentSlide ? "scale-105" : "scale-100"
              }`}
              sizes="100vw" // Full viewport width for hero images
              quality={90} // Higher quality for hero images
              placeholder="blur"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
          </div>
        ))}
      </div>

      <link rel="preload" as="image" href={slideImages[(currentSlide + 1) % slideImages.length]} />

      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3"
        role="tablist"
        aria-label="Hero image slideshow navigation"
      >
        {slideImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 focus-visible:ring-enhanced ${
              index === currentSlide
                ? "bg-terracotta scale-125 shadow-lg ring-2 ring-white/50"
                : "bg-white/60 hover:bg-white/80 backdrop-blur-sm"
            }`}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`View slide ${index + 1}: ${imageDescriptions[index]}`}
          />
        ))}
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentSlide + 1} of {slideImages.length}: {imageDescriptions[currentSlide]}
      </div>
    </section>
  )
}
