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
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

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
};

export default nextConfig;
