import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/server/db/schema/*",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_SYNC_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  tablesFilter: ["good-lyft_*"],
} satisfies Config;
