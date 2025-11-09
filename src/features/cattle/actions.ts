"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { matchSorter } from "match-sorter"; // For filtering
import { db } from "@/db";
import {
  animalPurchases,
  animals,
  cattle,
  saleAnimalLinks,
  sales,
  weightRecords,
} from "@/db/schema";
import type { Animal, AnimalPurchase, Cattle, Sale } from "@/db/schema";
import type { formSchema } from "./components/cattle-form";
import type { z } from "zod";
import { hasPermission } from "@/permissions";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";

// Combined type for cattle with purchase and optional sale data
export type CattleWithPurchase = {
  // Animal data
  animal: Animal;
  // Cattle data
  cattle: Cattle;
  // Purchase data (optional - one-to-zero-or-one relationship)
  purchase: AnimalPurchase | null;
  // Latest weight record
  latestWeight: { weightKg: string; recordedAt: Date } | null;
  // Sale data (for multi-animal sales)
  sales: Array<{ sale: Sale; linkCreatedAt: Date }>;
};

export type FlattenedCattle = Cattle & AnimalPurchase & Partial<Sale> & {
  // Additional computed fields
  latestWeight?: string;
  latestWeightDate?: Date;
  purchaseId?: string;
  saleId?: string;
};

interface CattleFilters {
  cattleClass?: string;
  search?: string;
  healthStatus?: string;
  purchasePrice?: string;
  cattleNumber?: string;
  purchaseDate?: string;
  animalStatus?: string;
}

export async function deleteCattle(id: string) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!hasPermission(sessionClaims?.role, "delete:cattle")) {
    throw new Error("Unauthorized");
  }

  try {
    // Find the animal first to ensure it exists and is cattle
    const animalToDelete = await db
      .select({ id: animals.id, animalType: animals.animalType })
      .from(animals)
      .where(eq(animals.id, id))
      .limit(1);

    if (!animalToDelete.length || animalToDelete[0].animalType !== "CATTLE") {
      throw new Error("Cattle not found");
    }

    // Delete the animal (cascade will handle cattle and related records)
    await db.delete(animals).where(eq(animals.id, id));

    // Revalidate the cache tags used by getCattleData
    revalidateTag("cattle");
    revalidateTag("animals");
    revalidateTag("purchases");
    revalidateTag("weights");
    revalidateTag("sales");

    return {
      success: true,
      message: `Cattle with ID ${id} deleted successfully`,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Error deleting cattle:", error);
    }
    throw new Error("Failed to delete cattle");
  }
}

interface DownloadFilters {
  search?: string;
  sort?: string;
  healthStatus?: string;
  cattleClass?: string;
  cattleNumber?: string;
  purchaseDate?: string;
  purchasePrice?: string;
  animalStatus?: string;
}

export async function downloadCattleData(
  filters: DownloadFilters,
): Promise<FlattenedCattle[]> {
  const cattleActions = await initializeCattleActions();
  const result = await cattleActions.getCattle(filters, true);
  return result.cattle;
}

// export async function initializeCattleActions() {
//   await cattleActions.initialize();
//   return cattleActions;
// }

export const createCattle = async (values: z.infer<typeof formSchema>) => {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!hasPermission(sessionClaims?.role, "write:cattle")) {
    throw new Error("Unauthorized");
  }

  try {
    // Get the next cattle number
    const latestCattleResult = await db
      .select({ cattleNumber: cattle.cattleNumber })
      .from(cattle)
      .orderBy(desc(cattle.cattleNumber))
      .limit(1);

    const newCattleNumber = latestCattleResult.length > 0
      ? latestCattleResult[0].cattleNumber + 1
      : 1;

    // Create animal first
    const newAnimal = await db
      .insert(animals)
      .values({
        farmId: "default-farm", // This should come from the user context
        animalType: "CATTLE",
        status: "ON_FARM",
        createdBy: userId,
      })
      .returning({ id: animals.id });

    if (!newAnimal.length) {
      throw new Error("Failed to create animal record");
    }

    const animalId = newAnimal[0].id;

    // Create cattle record
    const newCattleRecord = await db
      .insert(cattle)
      .values({
        animalId,
        cattleNumber: newCattleNumber.toString(),
        gender: values.gender as "MALE" | "FEMALE",
        healthStatus: "HEALTHY",
        isQuarantined: values.isQuarantined || false,
        isPregnant: values.isPregnant || false,
        isLactating: values.isLactating || false,
        cattleClass: values.cattleClass as
          | "GOLD"
          | "SILVER"
          | "PLATINUM"
          | null,
        createdBy: userId,
      })
      .returning();

    // Create purchase record using purchasePricePerKg from form
    let purchaseRecord = null;
    if (values.purchasePricePerKg && values.liveWeight) {
      const totalPurchasePrice = Number(values.purchasePricePerKg) *
        Number(values.liveWeight);
      purchaseRecord = await db
        .insert(animalPurchases)
        .values({
          animalId,
          purchaseDate: new Date(),
          purchasePrice: totalPurchasePrice.toString(),
          notes:
            `Purchase: ${values.purchasePricePerKg}/kg × ${values.liveWeight}kg`,
          createdBy: userId,
        })
        .returning();
    }

    // Create initial weight record from liveWeight
    if (values.liveWeight) {
      await db
        .insert(weightRecords)
        .values({
          animalId,
          weightKg: values.liveWeight,
          recordedAt: new Date(),
          recordedBy: userId,
          notes: "Initial weight record",
          createdBy: userId,
        });
    }

    return {
      success: true,
      message: "Cattle created successfully",
      data: {
        animal: newAnimal[0],
        cattle: newCattleRecord[0],
        purchase: purchaseRecord?.[0] || null,
      },
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Error creating cattle:", error);
    }
    throw new Error("Failed to create cattle");
  }
};

// Additional utility functions using Drizzle ORM best practices

export async function updateCattleDetails(
  animalId: string,
  updates: {
    cattleClass?: "GOLD" | "SILVER" | "PLATINUM";
    healthStatus?: "HEALTHY" | "MINOR_ISSUE" | "SICK" | "CRITICAL";
    isQuarantined?: boolean;
    isPregnant?: boolean;
    isLactating?: boolean;
    tagNumber?: string;
  },
) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!hasPermission(sessionClaims?.role, "update:cattle")) {
    throw new Error("Unauthorized");
  }

  try {
    const updatedCattle = await db
      .update(cattle)
      .set({
        ...updates,
        updatedAt: new Date(),
        updatedBy: userId,
      })
      .where(eq(cattle.animalId, animalId))
      .returning();

    if (!updatedCattle.length) {
      throw new Error("Cattle not found");
    }

    return {
      success: true,
      message: "Cattle updated successfully",
      data: updatedCattle[0],
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Error updating cattle:", error);
    }
    throw new Error("Failed to update cattle");
  }
}

export async function addWeightRecord(
  animalId: string,
  weightKg: number,
  notes?: string,
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const weightRecord = await db
      .insert(weightRecords)
      .values({
        animalId,
        weightKg: weightKg.toString(),
        recordedAt: new Date(),
        recordedBy: userId,
        notes,
        createdBy: userId,
      })
      .returning();

    return {
      success: true,
      message: "Weight record added successfully",
      data: weightRecord[0],
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Error adding weight record:", error);
    }
    throw new Error("Failed to add weight record");
  }
}

export async function getCattleWeightHistory(animalId: string) {
  try {
    const weightHistory = await db
      .select({
        id: weightRecords.id,
        weightKg: weightRecords.weightKg,
        recordedAt: weightRecords.recordedAt,
        notes: weightRecords.notes,
        recordedBy: weightRecords.recordedBy,
      })
      .from(weightRecords)
      .where(eq(weightRecords.animalId, animalId))
      .orderBy(desc(weightRecords.recordedAt));

    return {
      success: true,
      data: weightHistory.map((record) => ({
        ...record,
        weightKg: Number(record.weightKg),
      })),
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Error fetching weight history:", error);
    }
    throw new Error("Failed to fetch weight history");
  }
}

export async function bulkUpdateCattleStatus(
  animalIds: string[],
  status: "ON_FARM" | "SOLD" | "SLAUGHTERED",
) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!hasPermission(sessionClaims?.role, "update:cattle")) {
    throw new Error("Unauthorized");
  }

  try {
    const updatedAnimals = await db
      .update(animals)
      .set({
        status,
        updatedAt: new Date(),
        updatedBy: userId,
      })
      .where(inArray(animals.id, animalIds))
      .returning({ id: animals.id, status: animals.status });

    return {
      success: true,
      message: `Updated ${updatedAnimals.length} cattle status to ${status}`,
      data: updatedAnimals,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Error bulk updating cattle status:", error);
    }
    throw new Error("Failed to bulk update cattle status");
  }
}

export async function getAvailableCattle(searchTag?: string) {
  try {
    // Query available cattle (ON_FARM status only)
    let query = db
      .select({
        id: animals.id,
        tagNumber: cattle.tagNumber,
        gender: cattle.gender,
        healthStatus: cattle.healthStatus,
        status: animals.status,
        // Get latest weight from weight_records
        liveWeight: sql<string>`(
          SELECT weight_kg 
          FROM ${weightRecords} 
          WHERE ${weightRecords.animalId} = ${animals.id}
          ORDER BY recorded_at DESC 
          LIMIT 1
        )`,
        // Get adjusted price from animal_purchases
        adjustedPrice: sql<string>`(
          SELECT adjusted_price 
          FROM ${animalPurchases} 
          WHERE ${animalPurchases.animalId} = ${animals.id}
          LIMIT 1
        )`,
      })
      .from(animals)
      .innerJoin(cattle, eq(animals.id, cattle.animalId))
      .where(eq(animals.status, "ON_FARM"));

    // Apply tag number filter if provided
    if (searchTag && searchTag.trim() !== "") {
      query = query.where(
        and(
          eq(animals.status, "ON_FARM"),
          sql`${cattle.tagNumber} ILIKE ${`%${searchTag.trim()}%`}`,
        ),
      );
    }

    const results = await query.limit(20);

    return {
      success: true,
      cattle: results.map((item) => ({
        id: item.id,
        tagNumber: item.tagNumber,
        liveWeight: item.liveWeight ? Number.parseFloat(item.liveWeight) : 0,
        adjustedPrice: item.adjustedPrice ? Number.parseFloat(item.adjustedPrice) : 0,
        gender: item.gender,
        healthStatus: item.healthStatus,
        status: item.status,
      })),
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Error fetching available cattle:", error);
    }
    return {
      success: false,
      cattle: [],
      error: "Failed to fetch available cattle",
    };
  }
}
