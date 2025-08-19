/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Netlify deployment
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Enable static export for better Netlify compatibility - temporarily disabled for dev
  // output: 'export',
  // distDir: 'out',
  // Ensure static assets are properly handled
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
}

module.exports = nextConfig