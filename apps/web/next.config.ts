import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/**/*': ['../../packages/db/prisma/generated/client/**/*'],
  },
  
};

export default nextConfig;
