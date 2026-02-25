/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint moved to eslint.config.mjs or next lint CLI — not valid here in Next 16
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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/9mnu7l2c/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/files/9mnu7l2c/**",
      },
    ],
    localPatterns: [
      { pathname: "/placeholder.svg", search: "" },
      { pathname: "/placeholder.jpg", search: "" },
      { pathname: "/placeholder-logo.svg", search: "" },
      { pathname: "/placeholder-logo.png", search: "" },
      { pathname: "/placeholder-user.jpg", search: "" },
      { pathname: "/images/**", search: "" },
      { pathname: "/resources/**", search: "" },
    ],
  },
  // NOTE: CSP headers live in middleware.ts — middleware takes precedence over next.config headers()
};

export default nextConfig;
