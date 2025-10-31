import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",       // Standalone build for Azure deployment
  reactStrictMode: true,      // Recommended to catch React issues
};

export default nextConfig;
