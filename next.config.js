/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'flagcdn.com'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/try',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
