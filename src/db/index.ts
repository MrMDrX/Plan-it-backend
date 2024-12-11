import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "planit",
  password: "postgres",
  port: 5432,
});

export const db = drizzle(pool);
