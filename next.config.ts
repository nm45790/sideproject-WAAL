import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 프로덕션에서 console.log 제거 (보안 및 성능)
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"], // error와 warn은 유지
          }
        : false,
  },
};

export default nextConfig;
