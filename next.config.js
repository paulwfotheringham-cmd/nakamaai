/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/signup",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
