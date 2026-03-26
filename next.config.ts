import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/psycho',
  assetPrefix: '/psycho/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
