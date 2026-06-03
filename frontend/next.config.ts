import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.63"],
  images: {
    qualities: [1, 20, 50, 75],
  },
};

export default nextConfig;
