import config from "@/lib/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

if (!config.env.databaseUrl) {
  throw new Error(
    "No database connection string was provided. Please check your DATABASE_URL environment variable."
  );
}

const sql = neon(config.env.databaseUrl);

export const db = drizzle({ client: sql, casing: "snake_case" });
