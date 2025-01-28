import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env?.BUILD_STANDALONE ? "standalone" : undefined,
};

export default nextConfig;
