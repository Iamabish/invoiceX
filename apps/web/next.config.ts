import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../../"),
  serverExternalPackages: ["@prisma/client", "@invoicex/db"],
  outputFileTracingIncludes: {
    "/**/*": ["./prisma/generated/client/*.wasm"],
  },
};

export default nextConfig;