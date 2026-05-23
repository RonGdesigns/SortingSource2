/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: 'export' for Vercel support (Allows API routes to work)
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
export default nextConfig;