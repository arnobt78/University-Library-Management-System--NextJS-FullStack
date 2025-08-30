import { config } from "dotenv";

config({ path: ".env" });

const drizzleConfig = {
  schema: "./database/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
};

export default drizzleConfig;
