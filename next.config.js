/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Disable webpack cache in development to avoid cache issues
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
