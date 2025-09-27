/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete
    // even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Allow production builds to complete even if there are TS errors
    ignoreBuildErrors: true,
  },
  experimental: {
    turbo: {
      resolveAlias: {
        '@vercel/turbopack-next/internal/font/google/font': false,
      },
    },
  },
};

module.exports = nextConfig;
