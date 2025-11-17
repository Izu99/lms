import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/api/uploads/**',
      },
    ],
  },
  
  // ✅ SECURITY: Enable TypeScript strict mode in production
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // ✅ SECURITY: Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },
  
  // ✅ PERFORMANCE: Enable compression
  compress: true,
  
  // ✅ PERFORMANCE: Optimize production builds
  swcMinify: true,
  
  // ✅ PERFORMANCE: Enable experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};

export default nextConfig;
