/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Netlify deployment with Next.js plugin
  images: {
    unoptimized: true
  },
  
  // Let Netlify handle the output format
  // The @netlify/plugin-nextjs will handle serverless functions automatically
  
  // Ensure proper asset handling
  assetPrefix: '',
  
  // Enable experimental features for better performance
  experimental: {
    // Remove outputFileTracingRoot as it's not needed with Netlify plugin
  },
}

module.exports = nextConfig