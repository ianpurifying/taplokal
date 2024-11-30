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
      // Ensure React and ReactDOM are treated as external dependencies on the server
      config.externals = config.externals || {};
      config.externals["react"] = "react";
      config.externals["react-dom"] = "react-dom";
    }
    return config;
  },
};

export default nextConfig;
