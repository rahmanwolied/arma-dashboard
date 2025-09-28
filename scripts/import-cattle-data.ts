#!/usr/bin/env tsx

import { drizzle } from "drizzle-orm/postgres-js";
// @ts-ignore - postgres package types are available at runtime
import postgres from "postgres";
import { db } from "./db";
import {
  animalPurchases,
  animals,
  cattle,
  markets,
  purchases,
  weightRecords,
} from "../src/db/schema";
import * as schema from "../src/db/schema";
import * as fs from "node:fs";
import * as path from "node:path";
import { and, eq } from "drizzle-orm";

interface CattlePurchaseData {
  id: string;
  purchaseDate: string;
  purchasePricePerKg: number;
  liveWeight: number;
  meatPercentage: number;
  fatPercentage: number;
  purchaseLocation: string;
  createdAt: string;
}

interface CattleData {
  id: string;
  cattleNumber: number;
  name: string | null;
  gender: "MALE" | "FEMALE";
  cattlePurchaseId: string;
  cattleSaleId: string | null;
  cattleClass: "GOLD" | "SILVER" | "PLATINUM";
  imageUrl: string | null;
  isQuarantined: boolean;
  isPregnant: boolean;
  isLactating: boolean;
  isInseminated: boolean;
  healthStatus: "HEALTHY" | "MINOR_ISSUE" | "SICK" | "CRITICAL";
  healthNotes: string | null;
  isVaccinated: boolean;
  createdAt: string;
  updatedAt: string;
  cattlePurchase: CattlePurchaseData;
  cattleSale: unknown;
  transactionItems: unknown[];
}

interface ImportData {
  exportTimestamp: string;
  summary: {
    totalCattle: number;
    totalCustomers: number;
    totalTransactions: number;
    totalTransactionItems: number;
    totalCattlePurchases: number;
    totalCattleSales: number;
  };
  data: {
    cattle: CattleData[];
    customers: unknown[];
    transactions: unknown[];
    transactionItems: unknown[];
    cattlePurchases: unknown[];
    cattleSales: unknown[];
  };
}

type CattleBatch = {
  [key: string]: CattleData[];
};

class CattleImporter {
  private db: typeof db;
  constructor() {
    this.db = db;
  }

  async importFromFile(filePath: string): Promise<void> {
    console.log("🚀 Starting cattle data import...");

    // Validate file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Read and parse JSON data
    console.log("📖 Reading JSON file...");
    const rawData = fs.readFileSync(filePath, "utf8");
    const importData: ImportData = JSON.parse(rawData);

    console.log("📊 Data summary:", importData.summary);

    // Validate data structure
    this.validateData(importData);

    // Import in batches
    await this.importCattleInBatches(importData.data.cattle);

    console.log("🎉 Import completed successfully!");
  }

  private validateData(data: ImportData): void {
    if (!data.data || !data.data.cattle || !Array.isArray(data.data.cattle)) {
      throw new Error("Invalid data structure: cattle array not found");
    }

    if (data.data.cattle.length === 0) {
      throw new Error("No cattle data to import");
    }

    console.log(
      `✅ Validation passed: ${data.data.cattle.length} cattle records found`,
    );
  }

  private async insertMarket(
    tx: Parameters<Parameters<typeof this.db.transaction>[0]>[0],
    marketName: string,
  ): Promise<string> {
    const [marketEntry] = await tx.select().from(markets).where(
      eq(markets.name, marketName),
    ).limit(1);
    if (!marketEntry) {
      const [newMarket] = await tx.insert(markets).values({
        name: marketName,
      }).returning();
      return newMarket.id;
    }
    return marketEntry.id;
  }

  private async insertPurchase(
    tx: Parameters<Parameters<typeof this.db.transaction>[0]>[0],
    purchaseData: {
      purchaseDate: string;
      market: string;
      notes: string;
    },
  ): Promise<string> {
    const marketId = await this.insertMarket(tx, purchaseData.market);
    if (!marketId) {
      throw new Error("Failed to create market record");
    }

    const [purchase] = await tx.insert(purchases).values({
      purchaseDate: new Date(purchaseData.purchaseDate),
      marketId,
      totalTransportCost: "0",
      notes: purchaseData.notes,
    }).returning();

    if (!purchase) {
      throw new Error("Failed to create purchase record");
    }

    return purchase.id;
  }

  private async importCattleInBatches(cattleData: CattleData[]): Promise<void> {
    const totalCattle = cattleData.length;
    const batches = this.createBatches(cattleData);

    console.log(
      `🔄 Processing ${totalCattle} cattle in ${
        Object.keys(batches).length
      } batches...`,
    );

    let successCount = 0;
    let errorCount = 0;
    const batchKeys = Object.keys(batches);

    for (let i = 0; i < batchKeys.length; i++) {
      const batch = batches[batchKeys[i]];
      const batchNum = i + 1;

      try {
        console.log(
          `⚡ Processing batch ${batchNum}/${batchKeys.length} (${batch.length} cattle)...`,
        );

        await this.db.transaction(async (tx) => {
          const purchaseId = await this.insertPurchase(tx, {
            purchaseDate: batchKeys[i],
            market: batch[0].cattlePurchase.purchaseLocation,
            notes: "Imported from legacy system",
          });

          if (!purchaseId) {
            throw new Error("Failed to create purchase record");
          }

          for (const cattleRecord of batch) {
            await this.importSingleCattle(tx, cattleRecord, purchaseId);
            successCount++;
          }
        });

        console.log(`✅ Batch ${batchNum} completed successfully`);
      } catch (error) {
        errorCount += batch.length;
        console.error(`❌ Batch ${batchNum} failed:`, error);

        // Log which cattle failed in this batch
        console.error(
          "Failed cattle numbers in batch:",
          batch.map((c) => c.cattleNumber),
        );

        // Continue with next batch instead of stopping
        console.log("⏩ Continuing with next batch...");
      }
    }

    console.log("\n📈 Import Summary:");
    console.log(`  ✅ Successfully imported: ${successCount} cattle`);
    console.log(`  ❌ Failed to import: ${errorCount} cattle`);
    console.log(
      `  📊 Success rate: ${((successCount / totalCattle) * 100).toFixed(1)}%`,
    );
  }

  private async importSingleCattle(
    tx: Parameters<Parameters<typeof this.db.transaction>[0]>[0],
    cattleRecord: CattleData,
    purchaseId: string,
  ): Promise<void> {
    //check if animal already exists
    const existingCattle = await tx.select().from(cattle).innerJoin(
      animalPurchases,
      eq(cattle.animalId, animalPurchases.animalId),
    ).innerJoin(
      purchases,
      eq(animalPurchases.purchaseId, purchases.id),
    ).innerJoin(
      markets,
      eq(purchases.marketId, markets.id),
    ).where(
      and(
        eq(cattle.tagNumber, cattleRecord.cattleNumber.toString()),
        eq(markets.name, cattleRecord.cattlePurchase.purchaseLocation),
        eq(
          purchases.purchaseDate,
          new Date(cattleRecord.cattlePurchase.purchaseDate),
        ),
      ),
    );

    if (existingCattle.length > 0) {
      console.log(`Cattle ${cattleRecord.cattleNumber} already exists`);
      return;
    }

    // 1. Create animal record first
    const [animal] = await tx.insert(animals).values({
      animalType: "CATTLE",
      status: "ON_FARM",
      createdAt: new Date(cattleRecord.createdAt),
      updatedAt: new Date(cattleRecord.updatedAt),
    }).returning();

    // 2. Create cattle record (1:1 relationship with animals)
    await tx.insert(cattle).values({
      animalId: animal.id,
      tagNumber: cattleRecord.cattleNumber.toString(),
      gender: cattleRecord.gender,
      healthStatus: cattleRecord.healthStatus,
      isQuarantined: cattleRecord.isQuarantined,
      isPregnant: cattleRecord.isPregnant,
      isLactating: cattleRecord.isLactating,
      createdAt: new Date(cattleRecord.createdAt),
      updatedAt: new Date(cattleRecord.updatedAt),
    });

    // 3. Create purchase record if exists
    if (cattleRecord.cattlePurchase) {
      const purchasePrice = cattleRecord.cattlePurchase.purchasePricePerKg *
        cattleRecord.cattlePurchase.liveWeight;

      await tx.insert(animalPurchases).values({
        animalId: animal.id,
        purchaseId,
        purchasePrice: purchasePrice.toString(),

        notes:
          `Imported from legacy system. Location: ${cattleRecord.cattlePurchase.purchaseLocation}, Live Weight: ${cattleRecord.cattlePurchase.liveWeight}kg, Price per kg: ${cattleRecord.cattlePurchase.purchasePricePerKg}`,
        createdAt: new Date(cattleRecord.cattlePurchase.createdAt),
      });
    }

    // 4. Create weight record from purchase data
    if (cattleRecord.cattlePurchase?.liveWeight) {
      await tx.insert(weightRecords).values({
        animalId: animal.id,
        weightKg: cattleRecord.cattlePurchase.liveWeight.toString(),
        recordedAt: new Date(
          cattleRecord.cattlePurchase.purchaseDate || cattleRecord.createdAt,
        ),
        notes: "Initial weight from purchase record",
      });
    }
  }

  private createBatches(items: CattleData[]): CattleBatch {
    const batches: CattleBatch = {};
    for (let i = 0; i < items.length; i++) {
      const purchaseDate = items[i].cattlePurchase.purchaseDate;
      if (!batches[purchaseDate]) {
        batches[purchaseDate] = [];
      }
      batches[purchaseDate].push(items[i]);
    }
    return batches;
  }
}

// CLI Interface
async function main() {
  const filePath = "./scripts/arma-data-export-2025-09-19T08-13-19-123Z.json";
  try {
    const importer = new CattleImporter();
    await importer.importFromFile(filePath);
  } catch (error) {
    console.error("💥 Import failed:", error);
    process.exit(1);
  }
}

// Run the import if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error("💥 Unexpected error:", error);
    process.exit(1);
  });
}

export { CattleImporter };
