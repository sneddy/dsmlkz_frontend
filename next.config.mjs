/** @type {import('next').NextConfig} */
const nextConfig = {
  // Удаляем output: 'export', чтобы поддерживать динамические API-маршруты
  // output: 'export',
  images: {
    unoptimized: true,
    domains: [
      'swfxusemimczhhhfzjhc.supabase.co',
      'api.dicebear.com'
    ],
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
