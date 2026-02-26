/** @type {import('next').NextConfig} */
const nextConfig = {
      reactStrictMode: true,
      swcMinify: true,
      images: { domains: [] },
      experimental: {
              serverComponentsExternalPackages: ['@prisma/client', 'prisma', '@vercel/blob', 'undici'],
      },
}
module.exports = nextConfig
