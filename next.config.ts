import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
  compiler: {
    removeConsole:
      process.env.APP_ENV === "production" ? { exclude: ["error"] } : false,
  },

  productionBrowserSourceMaps: false,

  /* config options here */
};

export default nextConfig;
