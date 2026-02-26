/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
          domains: [],
    },
    serverExternalPackages: ['@prisma/client', 'prisma', '@vercel/blob'],
}

module.exports = nextConfig
