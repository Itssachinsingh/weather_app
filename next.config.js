/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      unoptimized: true, // Disables Next.js Image Optimization
    },
    experimental: {
      appDir: true, // Only if you're using the App Router
    },
  };
  
  module.exports = nextConfig;
  