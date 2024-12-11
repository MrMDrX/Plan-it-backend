import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    database: "planit",
    user: "postgres",
    password: "postgres",
    ssl: false, // TODO: set to true when SSL is enabled
  },
});
