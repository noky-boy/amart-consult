"use client"

import { useState, useEffect } from "react"

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slideImages = [
    "/placeholder.svg?height=1080&width=1920",
    "/placeholder.svg?height=1080&width=1920",
    "/placeholder.svg?height=1080&width=1920",
    "/placeholder.svg?height=1080&width=1920",
    "/placeholder.svg?height=1080&width=1920",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length)
    }, 4000) // Slightly faster transitions for better engagement

    return () => clearInterval(timer)
  }, [slideImages.length])

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        {slideImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat transform transition-transform duration-[4000ms] ease-out"
              style={{
                backgroundImage: `url(${image})`,
                transform: index === currentSlide ? "scale(1.05)" : "scale(1)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slideImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-terracotta scale-125 shadow-lg ring-2 ring-white/50"
                : "bg-white/60 hover:bg-white/80 backdrop-blur-sm"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
