import { drizzle } from "drizzle-orm/postgres-js";
// @ts-ignore - postgres package types are available at runtime
import postgres from "postgres";
import { env } from "../env";
import * as schema from "./schema";
console.log(`env.NEON_DB_URL: ${env.NEON_DB_URL}`)
// Create the connection
const client = postgres(env.NEON_DB_URL, {
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create the database instance
export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV === "development",
});

export type Database = typeof db;

// Export all schema for convenience
export * from "./schema";
