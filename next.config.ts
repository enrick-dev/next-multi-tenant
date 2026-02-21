import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@dheme/sdk", "@dheme/react", "@dheme/next"],
};

export default nextConfig;
