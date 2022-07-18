/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: false,

  swcMinify: true,

  productionBrowserSourceMaps: true,

  compiler: {
    emotion: true,
    styledComponent: true,
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    return config;
  },

  rewrites: !isProduction
    ? () => [
        {
          source: '/@:route',
          destination: `${process.env.PREVIEW_PREFIX ?? '/'}:route`,
        },
      ]
    : undefined,
};

module.exports = nextConfig;
