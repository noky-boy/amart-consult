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
    identifier: string,
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

// Validate reCAPTCHA Enterprise token
export const validateRecaptcha = async (
  token: string,
  request?: NextRequest,
): Promise<boolean> => {
  if (!token) return false;

  // Skip validation in development localhost
  // if (process.env.NODE_ENV === "development") {
  //   console.log("Development mode: Skipping reCAPTCHA validation");
  //   return true;
  // }
  // Check if we're using Enterprise reCAPTCHA
  const projectId = process.env.RECAPTCHA_PROJECT_ID;
  const apiKey = process.env.RECAPTCHA_API_KEY;

  if (projectId && apiKey) {
    // Enterprise reCAPTCHA validation
    return await validateEnterpriseRecaptcha(token, projectId, apiKey, request);
  } else {
    // Fallback to regular reCAPTCHA validation
    return await validateRegularRecaptcha(token);
  }
};

// Enterprise reCAPTCHA validation
// Enterprise reCAPTCHA validation with proper authentication
const validateEnterpriseRecaptcha = async (
  token: string,
  projectId: string,
  apiKey: string,
  request?: NextRequest,
): Promise<boolean> => {
  try {
    // Option 1: Use Google Auth Library (install: npm install google-auth-library)
    // const { GoogleAuth } = require('google-auth-library');
    // const auth = new GoogleAuth({
    //   scopes: 'https://www.googleapis.com/auth/cloud-platform'
    // });
    // const authClient = await auth.getClient();
    // const accessToken = await authClient.getAccessToken();

    // Option 2: Use API Key (your current approach)
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;

    const requestBody = {
      event: {
        token: token,
        siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        expectedAction: "CONTACT_FORM",
        // Add userIpAddress if available
        ...(request && {
          userIpAddress:
            getClientIP(request) !== "unknown"
              ? getClientIP(request)
              : undefined,
        }),
      },
    };

    console.log("=== DEBUG: Enterprise reCAPTCHA validation ===");
    console.log("Making request to:", url);
    console.log("Project ID:", projectId);
    console.log("Site Key:", process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Option 1: If using OAuth token
        // "Authorization": `Bearer ${accessToken.token}`,

        // Option 2: API key is in URL, so no additional auth headers needed
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("reCAPTCHA API Error:", errorResponse);

      // Specific error handling
      if (response.status === 403) {
        console.error("403 Error - Check:");
        console.error("1. API key has reCAPTCHA Enterprise API enabled");
        console.error("2. Project ID is correct");
        console.error("3. Domain is properly configured in reCAPTCHA key");
      }

      console.log("=== END DEBUG ===");
      return false;
    }

    const data = await response.json();
    console.log("Enterprise reCAPTCHA response:", data);

    // Validate the response
    if (!data.tokenProperties?.valid) {
      console.warn("Invalid token:", data.tokenProperties?.invalidReason);
      return false;
    }

    if (data.tokenProperties?.action !== "CONTACT_FORM") {
      console.warn(
        "Action mismatch. Expected: CONTACT_FORM, Got:",
        data.tokenProperties?.action,
      );
      return false;
    }

    // Check risk score (0.0 = bot, 1.0 = human)
    const riskScore = data.riskAnalysis?.score ?? 0;
    const threshold = 0.5;

    console.log(`Risk Analysis - Score: ${riskScore}, Threshold: ${threshold}`);
    console.log("=== END DEBUG ===");

    return riskScore >= threshold;
  } catch (error) {
    console.error("Enterprise reCAPTCHA validation error:", error);
    console.log("=== END DEBUG ===");
    return false;
  }
};

// Regular reCAPTCHA validation (fallback)
const validateRegularRecaptcha = async (token: string): Promise<boolean> => {
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
      },
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
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com https://www.google.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    // ✅ Allow Sanity CDN video/audio files (cdn.sanity.io/files/)
    "media-src 'self' https://cdn.sanity.io",
    "connect-src 'self' https://api.github.com https://9mnu7l2c.api.sanity.io https://recaptchaenterprise.googleapis.com https://www.google.com https://iwimbcemuaocizmkjqpx.supabase.co ", // Added https://www.google.com
    "frame-src 'self' https://calendly.com https://www.google.com",
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
  success: boolean,
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
  sessionToken: string,
): boolean => {
  return token === sessionToken;
};
