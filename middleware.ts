import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { rateLimit, getClientIP, securityHeaders } from "./lib/security"

// Rate limiting configurations
const contactFormLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 3, // 3 submissions per 15 minutes
})

const generalAPILimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
})

const adminLoginLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
})

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const clientIP = getClientIP(request)
  const pathname = request.nextUrl.pathname

  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    let rateLimitResult

    if (pathname === "/api/contact" || pathname === "/api/quote") {
      // Stricter rate limiting for form submissions
      rateLimitResult = contactFormLimit(clientIP)
    } else if (pathname.startsWith("/api/admin") || pathname.includes("login")) {
      // Stricter rate limiting for admin routes
      rateLimitResult = adminLoginLimit(clientIP)
    } else {
      // General API rate limiting
      rateLimitResult = generalAPILimit(clientIP)
    }

    if (!rateLimitResult.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
          resetTime: rateLimitResult.resetTime,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": pathname === "/api/contact" || pathname === "/api/quote" ? "3" : "60",
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
          },
        },
      )
    }

    // Add rate limit headers to successful responses
    response.headers.set("X-RateLimit-Limit", pathname === "/api/contact" || pathname === "/api/quote" ? "3" : "60")
    response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString())
    response.headers.set("X-RateLimit-Reset", rateLimitResult.resetTime.toString())
  }

  // Additional security for admin routes
  if (pathname.startsWith("/admin")) {
    // Add extra security headers for admin pages
    response.headers.set("X-Robots-Tag", "noindex, nofollow")
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
  }

  // Block common attack patterns
  const suspiciousPatterns = [
    /\.\./,
    /\/etc\/passwd/,
    /\/proc\/self\/environ/,
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
  ]

  const url = request.url.toLowerCase()
  const userAgent = request.headers.get("user-agent") || ""

  if (suspiciousPatterns.some((pattern) => pattern.test(url) || pattern.test(userAgent))) {
    console.warn(`Suspicious request blocked from ${clientIP}: ${url}`)
    return new NextResponse("Forbidden", { status: 403 })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
