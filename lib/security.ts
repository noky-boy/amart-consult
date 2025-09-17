import type { NextRequest } from "next/server";

// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore: RateLimitStore = {};

// Rate limiting function
export const rateLimit = (config: RateLimitConfig) => {
  return (
    identifier: string
  ): { allowed: boolean; remaining: number; resetTime: number } => {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean up old entries
    Object.keys(rateLimitStore).forEach((key) => {
      if (rateLimitStore[key].resetTime < windowStart) {
        delete rateLimitStore[key];
      }
    });

    // Get or create entry for this identifier
    if (!rateLimitStore[identifier]) {
      rateLimitStore[identifier] = {
        count: 0,
        resetTime: now + config.windowMs,
      };
    }

    const entry = rateLimitStore[identifier];

    // Reset if window has passed
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + config.windowMs;
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment counter
    entry.count++;

    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  };
};

// Get client IP address
export const getClientIP = (request: NextRequest): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return "unknown";
};

// Validate reCAPTCHA token
export const validateRecaptcha = async (token: string): Promise<boolean> => {
  if (!token) return false;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.warn("reCAPTCHA secret key not configured");
    return true; // Allow in development if not configured
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    );

    const data = await response.json();
    return data.success && data.score > 0.5; // Adjust score threshold as needed
  } catch (error) {
    console.error("reCAPTCHA validation error:", error);
    return false;
  }
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof input !== "string") return "";

  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, ""); // Remove event handlers
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Ghana format)
export const isValidGhanaPhone = (phone: string): boolean => {
  const ghanaPhoneRegex = /^(\+233|0)[2-9]\d{8}$/;
  return ghanaPhoneRegex.test(phone.replace(/\s+/g, ""));
};

// Security headers configuration
export const securityHeaders = {
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-XSS-Protection": "1; mode=block",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "origin-when-cross-origin",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.github.com https://9mnu7l2c.api.sanity.io",
    "frame-src 'self' https://calendly.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; "),
};

// Login attempt tracking
interface LoginAttempt {
  count: number;
  lastAttempt: number;
  blockedUntil?: number;
}

const loginAttempts: { [key: string]: LoginAttempt } = {};

export const trackLoginAttempt = (
  identifier: string,
  success: boolean
): { allowed: boolean; blockedUntil?: number } => {
  const now = Date.now();
  const maxAttempts = 5;
  const blockDuration = 15 * 60 * 1000; // 15 minutes
  const resetWindow = 60 * 60 * 1000; // 1 hour

  if (!loginAttempts[identifier]) {
    loginAttempts[identifier] = {
      count: 0,
      lastAttempt: now,
    };
  }

  const attempt = loginAttempts[identifier];

  // Check if currently blocked
  if (attempt.blockedUntil && now < attempt.blockedUntil) {
    return {
      allowed: false,
      blockedUntil: attempt.blockedUntil,
    };
  }

  // Reset counter if enough time has passed
  if (now - attempt.lastAttempt > resetWindow) {
    attempt.count = 0;
    attempt.blockedUntil = undefined;
  }

  if (success) {
    // Reset on successful login
    attempt.count = 0;
    attempt.blockedUntil = undefined;
    attempt.lastAttempt = now;
    return { allowed: true };
  }

  // Increment failed attempts
  attempt.count++;
  attempt.lastAttempt = now;

  // Block if too many attempts
  if (attempt.count >= maxAttempts) {
    attempt.blockedUntil = now + blockDuration;
    return {
      allowed: false,
      blockedUntil: attempt.blockedUntil,
    };
  }

  return { allowed: true };
};

// CSRF token generation and validation
export const generateCSRFToken = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const validateCSRFToken = (
  token: string,
  sessionToken: string
): boolean => {
  return token === sessionToken;
};
