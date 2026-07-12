import { defineConfig } from "prisma/config";

import { config } from "dotenv";
import path from "node:path";

config({ path: path.resolve(__dirname, "../../.env") });



export default defineConfig({
  engine : 'classic',
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'bun ./prisma/seed.ts'
  },
  datasource: {
    url: process.env["DIRECT_URL"]!,  
  },
});