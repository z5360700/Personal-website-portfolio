/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  
  // Image optimization - using unoptimized for simpler loading
  images: {
    unoptimized: true,
  },
  
  // Compression
  compress: true,
  
  // Enable SWC minification
  swcMinify: true,
  
  // Optimize CSS
  optimizeFonts: true,
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
