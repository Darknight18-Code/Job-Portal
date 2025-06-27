import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",   // for Cloudinary
      "img.clerk.com",        // for Clerk user images
      "images.clerk.dev",     // also used by Clerk sometimes
    ],
  },
  // Add these ESLint and TypeScript configurations
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. This is generally not recommended.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;