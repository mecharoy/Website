/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  experimental: {
    serverComponentsExternalPackages: ['@vercel/blob'],
  },
}

module.exports = nextConfig
