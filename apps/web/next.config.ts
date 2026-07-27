import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../../"),
  serverExternalPackages: ["@prisma/client", "@invoicex/db"],
  outputFileTracingIncludes: {
  "/**/*": [
    "../../packages/db/prisma/generated/client/*.node",
    "../../packages/db/prisma/generated/client/*.wasm",
    "./prisma/generated/client/*.node",
    "./prisma/generated/client/*.wasm",
  ],
},
};

export default nextConfig;