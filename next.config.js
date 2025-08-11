/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Netlify deployment
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Enable static export for better Netlify compatibility
  output: 'export',
  distDir: 'out'
}

module.exports = nextConfig