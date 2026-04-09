import type { NextConfig } from 'next'

const securityHeaders = [
  // Prevent clickjacking
  { key: 'X-Frame-Options',         value: 'DENY' },
  // Block MIME sniffing
  { key: 'X-Content-Type-Options',  value: 'nosniff' },
  // XSS protection in older browsers
  { key: 'X-XSS-Protection',        value: '1; mode=block' },
  // Control referrer information
  { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
  // Disable browser features not needed
  { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=(self), payment=()' },
  // HSTS — force HTTPS for 1 year in production
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",   // unsafe-eval required by Next.js dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.supabase.co https://*.tile.openstreetmap.org",
      "connect-src 'self' https://*.supabase.co https://api.anthropic.com wss://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],

  // Security headers on all routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
    // Prevent unbounded image disk cache growth (CVE fix)
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
  },

  // Hardened production build
  poweredByHeader: false, // Remove X-Powered-By: Next.js header (info leakage)
  compress: true,
}

export default nextConfig
