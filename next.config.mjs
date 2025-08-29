/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Enable SWC minification for improved build times
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Remove console.log in production
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add image optimization settings
  images: {
    formats: ["image/avif", "image/webp"], // Serve modern image formats
    minimumCacheTTL: 60 * 60 * 24 * 7, // Cache images for 7 days
    domains: ["blob.v0.dev"], // Add external domains if you are using them
    unoptimized: true,
  },
  // Enable compression
  compress: true,
}

export default nextConfig
