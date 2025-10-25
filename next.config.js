/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    // Add your production domains here when deploying
    // domains: ['localhost', 'your-production-domain.com'],
  },
  // Don't expose server-only secrets to the client
  // Use API routes for server-side Stripe operations
}

module.exports = nextConfig
