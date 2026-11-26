import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/admin/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
