/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    qualities: [75, 85],

    // Add these configurations to fix your error
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/9mnu7l2c/**",
      },
    ],
    localPatterns: [
      {
        pathname: "/placeholder.svg",
        search: "",
      },
      {
        pathname: "/placeholder.jpg",
        search: "",
      },
      {
        pathname: "/placeholder-logo.svg",
        search: "",
      },
      {
        pathname: "/placeholder-logo.png",
        search: "",
      },
      {
        pathname: "/placeholder-user.jpg",
        search: "",
      },
      {
        pathname: "/images/**",
        search: "",
      },
      {
        pathname: "/resources/**",
        search: "",
      },
    ],
  },

  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts — Next.js needs unsafe-inline/eval in dev
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Styles
              "style-src 'self' 'unsafe-inline'",
              // Images — self + Sanity CDN + data URIs (blur placeholders)
              "img-src 'self' data: blob: https://cdn.sanity.io",
              // ✅ Media (video/audio) — allow Sanity CDN files
              "media-src 'self' https://cdn.sanity.io",
              // Iframes — for YouTube/Vimeo embeds if you ever use them
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
              // Fetch/XHR — Sanity API + your own API routes
              "connect-src 'self' https://cdn.sanity.io https://*.sanity.io wss://*.sanity.io",
              // Fonts
              "font-src 'self' data:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
