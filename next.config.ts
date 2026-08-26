import type { NextConfig } from "next";

import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'backend-production-a2f6.up.railway.app',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // For Medusa S3 storage
      },
      {
        protocol: 'https',
        hostname: 'pub-42387e1a037e49f0920e629b852abe7f.r2.dev', // Cloudflare R2 Bucket
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: "sevlex",
  project: "laundrymall",
  silent: !process.env.CI,
});
