import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'i.scdn.co' },
    ],
  },
  experimental: { serverActions: { bodySizeLimit: '50mb' } },
}
export default nextConfig
