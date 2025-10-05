/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  env: {
    BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5000",
  },
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable features not compatible with static export
  trailingSlash: true,
}

module.exports = nextConfig
