/** @type {import('next').NextConfig} */
const nextConfig = {
  // Удаляем output: 'export', чтобы поддерживать динамические API-маршруты
  // output: 'export',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: false,
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/index.php', destination: '/', permanent: true },
      { source: '/signup', destination: '/auth/signup', permanent: true },
      {
        source: '/:path*/',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.dsml.kz' }],
        destination: 'https://www.dsml.kz/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
