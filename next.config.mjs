/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  webpack(config, { isServer }) {
    if (isServer) {
      // If it's the server-side, we ensure some modules don't get bundled
      config.externals = ["react", "react-dom"];
    }

    return config;
  },
};

export default nextConfig;
