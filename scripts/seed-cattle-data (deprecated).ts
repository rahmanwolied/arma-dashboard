import { eq } from "drizzle-orm";

import CattleData from "./arma-data-export-2025-09-19T08-13-19-123Z.json" assert {
  type: "json",
};
import {
  animalPurchases,
  animals,
  cattle,
  markets,
  weightRecords,
} from "../src/db/schema/tables";
import { db } from "./db";

// Types for the JSON data structure
type CattleRecord = {
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
  cattlePurchase: {
    id: string;
    purchaseDate: string;
    purchasePricePerKg: number;
    liveWeight: number;
    meatPercentage: number;
    fatPercentage: number;
    purchaseLocation: string;
    createdAt: string;
  };
  cattleSale: null | object;
  transactionItems: object[];
};

type ExportData = {
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
    cattle: CattleRecord[];
  };
};

// Default farm ID - you'll need to adjust this based on your setup
const DEFAULT_FARM_ID = "00000000-0000-0000-0000-000000000001";

/**
 * Create a default market if it doesn't exist
 */
const ensureDefaultMarket = async () => {
  try {
    const existingMarket = await db.select().from(markets).where(
      eq(markets.name, "AAL Market"),
    );

    if (existingMarket.length > 0) {
      console.log("Default market already exists");
      return existingMarket[0];
    }

    const newMarket = await db.insert(markets).values({
      name: "AAL Market",
      location: "AAL",
      contactInfo: "Default market for AAL location",
    }).returning();

    console.log("✅ Created default market");
    return newMarket[0];
  } catch (error) {
    console.error("Error creating default market:", error);
    throw error;
  }
};

/**
 * Seed cattle data in batches for optimal performance
 */
const seedCattleData = async () => {
  console.log("🐄 Starting cattle data seeding...");

  const cattleData = CattleData as ExportData;
  const cattleRecords = cattleData.data.cattle;

  console.log(`📊 Found ${cattleRecords.length} cattle records to process`);

  // Ensure default market exists
  const defaultMarket = await ensureDefaultMarket();

  // Check which animals already exist to avoid duplicates
  const existingAnimals = await db.select().from(animals);
  const existingAnimalIds = new Set(existingAnimals.map((a) => a.id));

  // Prepare animals data for batch insert
  const animalsToInsert = cattleRecords
    .filter((record) => !existingAnimalIds.has(record.id))
    .map((record) => ({
      id: record.id, // Use the existing ID from JSON
      animalType: "CATTLE" as const,
      status: "ON_FARM" as const,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    }));

  console.log(
    `📝 Preparing to insert ${animalsToInsert.length} new animals...`,
  );

  // Insert animals in batches
  const batchSize = 100;
  let insertedAnimalsCount = 0;

  if (animalsToInsert.length > 0) {
    for (let i = 0; i < animalsToInsert.length; i += batchSize) {
      const batch = animalsToInsert.slice(i, i + batchSize);
      await db.insert(animals).values(batch);
      insertedAnimalsCount += batch.length;
      console.log(
        `✅ Inserted ${insertedAnimalsCount}/${animalsToInsert.length} animals`,
      );
    }
  } else {
    console.log("All animals already exist in database");
  }

  // Get all cattle that should exist (existing + newly inserted)
  const allAnimals = await db.select().from(animals);
  const animalIdSet = new Set(allAnimals.map((a) => a.id));

  // Check which cattle records already exist
  const existingCattle = await db.select().from(cattle);
  const existingCattleIds = new Set(existingCattle.map((c) => c.animalId));

  // Prepare cattle data for batch insert
  const cattleToInsert = cattleRecords
    .filter((record) =>
      animalIdSet.has(record.id) && // Animal exists
      !existingCattleIds.has(record.id) // Cattle record doesn't exist
    )
    .map((record) => ({
      animalId: record.id,
      cattleNumber: record.cattleNumber.toString(),
      tagNumber: record.cattleNumber.toString(), // Using cattle number as tag
      gender: record.gender,
      healthStatus: record.healthStatus,
      isQuarantined: record.isQuarantined,
      isPregnant: record.isPregnant,
      isLactating: record.isLactating,
      cattleClass: record.cattleClass,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    }));

  console.log(
    `🐮 Preparing to insert ${cattleToInsert.length} cattle records...`,
  );

  // Insert cattle in batches
  let insertedCattleCount = 0;

  if (cattleToInsert.length > 0) {
    for (let i = 0; i < cattleToInsert.length; i += batchSize) {
      const batch = cattleToInsert.slice(i, i + batchSize);
      await db.insert(cattle).values(batch);
      insertedCattleCount += batch.length;
      console.log(
        `✅ Inserted ${insertedCattleCount}/${cattleToInsert.length} cattle records`,
      );
    }
  } else {
    console.log("All cattle records already exist in database");
  }

  // Check which purchases already exist
  const existingPurchases = await db.select().from(animalPurchases);
  const existingPurchaseAnimalIds = new Set(
    existingPurchases.map((p) => p.animalId),
  );

  // Prepare purchase data for batch insert
  const purchasesToInsert = cattleRecords
    .filter((record) =>
      animalIdSet.has(record.id) && // Animal exists
      !existingPurchaseAnimalIds.has(record.id) && // Purchase doesn't exist
      record.cattlePurchase // Has purchase data
    )
    .map((record) => {
      const purchase = record.cattlePurchase;
      const totalPrice = purchase.purchasePricePerKg * purchase.liveWeight;

      return {
        id: purchase.id, // Use existing purchase ID
        animalId: record.id,
        marketId: defaultMarket.id, // Link to our default market
        purchaseDate: new Date(purchase.purchaseDate),
        purchasePrice: totalPrice.toString(), // Convert to string for decimal
        notes:
          `Live weight: ${purchase.liveWeight}kg, Price per kg: ${purchase.purchasePricePerKg}, Meat %: ${purchase.meatPercentage}%, Fat %: ${purchase.fatPercentage}%, Location: ${purchase.purchaseLocation}`,
        createdAt: new Date(purchase.createdAt),
      };
    });

  console.log(
    `💰 Preparing to insert ${purchasesToInsert.length} purchase records...`,
  );

  // Insert purchases in batches
  let insertedPurchasesCount = 0;

  if (purchasesToInsert.length > 0) {
    for (let i = 0; i < purchasesToInsert.length; i += batchSize) {
      const batch = purchasesToInsert.slice(i, i + batchSize);
      await db.insert(animalPurchases).values(batch);
      insertedPurchasesCount += batch.length;
      console.log(
        `✅ Inserted ${insertedPurchasesCount}/${purchasesToInsert.length} purchase records`,
      );
    }
  } else {
    console.log("All purchase records already exist in database");
  }

  // Check which weight records already exist
  const existingWeights = await db.select().from(weightRecords);
  const existingWeightAnimalIds = new Set(
    existingWeights.map((w) => w.animalId),
  );

  // Prepare weight records for batch insert (initial weights from purchase)
  const weightsToInsert = cattleRecords
    .filter((record) =>
      animalIdSet.has(record.id) && // Animal exists
      !existingWeightAnimalIds.has(record.id) && // Weight record doesn't exist
      record.cattlePurchase?.liveWeight // Has weight data
    )
    .map((record) => {
      const purchase = record.cattlePurchase;
      return {
        animalId: record.id,
        weightKg: purchase.liveWeight.toString(), // Convert to string for decimal
        recordedAt: new Date(purchase.purchaseDate), // Use purchase date as initial weight date
        onPurchase: true,
        notes:
          `Initial weight from purchase - Meat %: ${purchase.meatPercentage}%, Fat %: ${purchase.fatPercentage}%`,
      };
    });

  console.log(
    `⚖️ Preparing to insert ${weightsToInsert.length} weight records...`,
  );

  // Insert weight records in batches
  let insertedWeightsCount = 0;

  if (weightsToInsert.length > 0) {
    for (let i = 0; i < weightsToInsert.length; i += batchSize) {
      const batch = weightsToInsert.slice(i, i + batchSize);
      await db.insert(weightRecords).values(batch);
      insertedWeightsCount += batch.length;
      console.log(
        `✅ Inserted ${insertedWeightsCount}/${weightsToInsert.length} weight records`,
      );
    }
  } else {
    console.log("All weight records already exist in database");
  }

  console.log("🎉 Cattle data seeding completed successfully!");
  console.log("📊 Summary:");
  console.log(`   • Animals inserted: ${insertedAnimalsCount}`);
  console.log(`   • Cattle records inserted: ${insertedCattleCount}`);
  console.log(`   • Purchase records inserted: ${insertedPurchasesCount}`);
  console.log(`   • Weight records inserted: ${insertedWeightsCount}`);
};

/**
 * Main execution function with error handling
 */
const main = async () => {
  try {
    await seedCattleData();
  } catch (error) {
    console.error("❌ Error during cattle data seeding:");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

// Execute the script
main();
