/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      { source: '/campaigns/:id(\\d+)', destination: '/tasks/:id', permanent: true },
    ];
  },
};

export default nextConfig;
