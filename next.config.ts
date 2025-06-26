import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",   // for Cloudinary
      "img.clerk.com",        // for Clerk user images
      "images.clerk.dev",     // also used by Clerk sometimes
    ],
  },
};

export default nextConfig;
