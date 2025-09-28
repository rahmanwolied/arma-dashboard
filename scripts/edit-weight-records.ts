#!/usr/bin/env tsx

import { db } from "./db";
import { weightRecords } from "@/db/schema/tables/animals";
import { sql } from "drizzle-orm";

async function updateAllWeightRecords() {
    try {
        console.log("🔄 Starting update of all weight records...");

        // Update all weight records to set onPurchase = true
        const result = await db
            .update(weightRecords)
            .set({ onPurchase: true })
            .execute();

        console.log("✅ Successfully updated weight records!");
        console.log(`📊 Rows affected: ${result.rowCount || "Unknown"}`);

        // Verify the update by counting records
        const totalRecords = await db
            .select({ count: sql`count(*)` })
            .from(weightRecords)
            .execute();

        const updatedRecords = await db
            .select({ count: sql`count(*)` })
            .from(weightRecords)
            .where(sql`${weightRecords.onPurchase} = true`)
            .execute();

        console.log(`📈 Total weight records: ${totalRecords[0]?.count || 0}`);
        console.log(
            `📈 Records with onPurchase = true: ${
                updatedRecords[0]?.count || 0
            }`,
        );
    } catch (error) {
        console.error("❌ Error updating weight records:", error);
        throw error;
    } finally {
        process.exit(0);
    }
}

// Run the update
updateAllWeightRecords();
