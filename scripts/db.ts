// Load environment variables from .env file
import { config } from "dotenv";
config();

import { drizzle } from "drizzle-orm/postgres-js";
// @ts-ignore - postgres package types are available at runtime
import postgres from "postgres";
import * as schema from "../src/db/schema";

// Create the connection

const getClient = () => {
    try {
        const client = postgres(process.env.NEON_DB_URL || "", {
            max: 20,
            idle_timeout: 20,
            connect_timeout: 10,
        });
        return client;
    } catch (error) {
        console.error("Error creating client ==>", error);
        throw error;
    }
};

const client = getClient();

// Create the database instance
export const db = drizzle(client, {
    schema,
    logger: process.env.NODE_ENV === "development",
});

export type Database = typeof db;
