import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",       // Standalone build for Azure deployment
  reactStrictMode: true,      // Recommended to catch React issues
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/api/uploads/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },
};

export default nextConfig;

export default nextConfig;
