import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.trycloudflare.com', 'localhost:3000', '*.loca.lt'],
};

export default nextConfig;
