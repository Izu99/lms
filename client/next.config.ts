/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ Required for Azure App Service
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(), // Use the client directory as the root
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.azurewebsites.net',
        pathname: '/api/uploads/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
