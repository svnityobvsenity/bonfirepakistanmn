/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Netlify deployment
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // For Netlify, we'll use serverless functions instead of static export
  // This allows API routes to work properly
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // Ensure static assets are properly handled
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Optimize for serverless deployment
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
}

module.exports = nextConfig