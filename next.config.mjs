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
};

export default nextConfig;
