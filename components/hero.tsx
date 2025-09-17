"use client";

import { useState, useEffect } from "react";
import OptimizedImage from "./optimized-image";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slideImages = [
    "/resources/hero/Hero_image1.webp",
    "/resources/hero/Hero_image2.webp",
    "/resources/hero/Hero_image3.webp",
    "/resources/hero/Hero_image4.webp",
    "/resources/hero/Hero_image5.webp",
    "/resources/hero/Hero_image6.webp",
    "/resources/hero/Hero_image7.webp",
  ];

  const imageDescriptions = [
    "Modern two-story house with contemporary design, stone and concrete elements, balcony with hanging chairs",
    "Colorful modern townhouse complex with orange and beige facades, multiple units",
    "Warm evening shot of modern house with large windows and welcoming entrance",
    "Modern minimalist house with large glass windows, outdoor entertainment area, desert landscaping",
    "Contemporary house with wood cladding accents, hanging egg chairs on balcony, front view",
    "Luxury modern house with pool, multiple levels, outdoor living spaces",
    "Modern apartment/commercial complex with geometric design, parking areas, multiple levels",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [slideImages.length]);

  return (
    <section
      id="home"
      className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-screen overflow-hidden"
      aria-label="Amart Consult architectural showcase"
    >
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
              priority={index === 0}
              aspectRatio="16:9"
              objectFit="cover"
              className="w-full h-full object-cover object-center"
              sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1440px) 1440px, 1920px"
              quality={85}
              placeholder="blur"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
          </div>
        ))}
      </div>

      {/* Conditional preloading - only when hero is actually displayed */}
      {typeof window !== "undefined" && (
        <link
          rel="preload"
          as="image"
          href={slideImages[(currentSlide + 1) % slideImages.length]}
        />
      )}

      <div
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3"
        role="tablist"
        aria-label="Hero image slideshow navigation"
      >
        {slideImages.map((_, index) => (
          <button
            key={index}
            suppressHydrationWarning={true}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-full transition-all duration-300 focus-visible:ring-enhanced ${
              index === currentSlide
                ? "bg-terracotta scale-110 shadow-lg ring-1 sm:ring-2 ring-white/50"
                : "bg-white/60 hover:bg-white/80 backdrop-blur-sm"
            }`}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`View slide ${index + 1}: ${imageDescriptions[index]}`}
          />
        ))}
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentSlide + 1} of {slideImages.length}:{" "}
        {imageDescriptions[currentSlide]}
      </div>
    </section>
  );
}
