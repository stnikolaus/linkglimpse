import type { NextConfig } from "next";
import { withPlausibleProxy } from 'next-plausible';

const nextConfig: NextConfig = {
  // Keep development and production artifacts separate so `next build` cannot
  // invalidate manifests while a local dev server is running.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  sassOptions: {
    includePaths: ['./src'],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  async redirects() {
    return [
      {
        source: '/facebook-social-preview',
        destination: '/facebook-open-graph-debugger',
        permanent: true,
      },
      {
        source: '/twitter-social-preview',
        destination: '/twitter-card-validator',
        permanent: true,
      },
      {
        source: '/linkedin-social-preview',
        destination: '/linkedin-post-preview',
        permanent: true,
      },
      {
        source: '/ai',
        destination: '/open-graph-checker',
        permanent: true,
      },
      {
        source: '/blog/ai-content-optimization',
        destination: '/blog/social-media-preview-best-practices',
        permanent: true,
      },
    ];
  },
};

export default withPlausibleProxy()(nextConfig);
