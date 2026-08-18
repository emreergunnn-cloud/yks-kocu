import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.0.2.2"],

  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination:
          "https://yks-kocu-cfd78.firebaseapp.com/__/auth/:path*",
      },
    ];
  },
};

export default nextConfig;