/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["simli-client"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
