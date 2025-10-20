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

// const cattleActions = {
//   records: [] as CattleWithPurchase[],

//   // Initialize with Drizzle ORM
//   // async initialize() {
//   //   const { userId, sessionClaims } = await auth();

//   //   if (process.env.NODE_ENV === "development") {
//   //     // eslint-disable-next-line no-console
//   //     console.log("sessionClaims, userId", sessionClaims, userId);
//   //   }

//   //   if (!userId) {
//   //     throw new Error("Unauthorized");
//   //   }

//   //   if (!hasPermission(sessionClaims?.role, "read:cattle")) {
//   //     throw new Error("Unauthorized");
//   //   }

//   //   // Fetch cattle with all related data using Drizzle ORM
//   //   const cattleData = await db
//   //     .select({
//   //       // Animal data
//   //       animal: animals,
//   //       // Cattle data
//   //       cattle: cattle,
//   //       // Purchase data (may be null)
//   //       purchase: animalPurchases,
//   //     })
//   //     .from(animals)
//   //     .innerJoin(cattle, eq(cattle.animalId, animals.id))
//   //     .leftJoin(animalPurchases, eq(animalPurchases.animalId, animals.id))
//   //     .where(eq(animals.animalType, "CATTLE"))
//   //     .orderBy(asc(cattle.tagNumber));

//   //   // Get latest weight records for each animal
//   //   const animalIds = cattleData.map((item) => item.animal.id);
//   //   const latestWeights = animalIds.length > 0
//   //     ? await db
//   //       .select({
//   //         animalId: weightRecords.animalId,
//   //         weightKg: weightRecords.weightKg,
//   //         recordedAt: weightRecords.recordedAt,
//   //       })
//   //       .from(weightRecords)
//   //       .where(
//   //         and(
//   //           inArray(weightRecords.animalId, animalIds),
//   //           eq(
//   //             weightRecords.recordedAt,
//   //             sql`(SELECT MAX(recorded_at) FROM weight_records WHERE animal_id = ${weightRecords.animalId})`,
//   //           ),
//   //         ),
//   //       )
//   //     : [];

//   //   // Get sales data for each animal
//   //   const salesData = animalIds.length > 0
//   //     ? await db
//   //       .select({
//   //         animalId: saleAnimalLinks.animalId,
//   //         sale: sales,
//   //         linkCreatedAt: saleAnimalLinks.createdAt,
//   //       })
//   //       .from(saleAnimalLinks)
//   //       .innerJoin(sales, eq(sales.id, saleAnimalLinks.saleId))
//   //       .where(inArray(saleAnimalLinks.animalId, animalIds))
//   //       .orderBy(desc(saleAnimalLinks.createdAt))
//   //     : [];

//   //   // Combine all data
//   //   this.records = cattleData.map((item) => {
//   //     const latestWeight = latestWeights.find((w) =>
//   //       w.animalId === item.animal.id
//   //     );
//   //     const animalSales = salesData.filter((s) =>
//   //       s.animalId === item.animal.id
//   //     );

//   //     return {
//   //       animal: item.animal,
//   //       cattle: item.cattle,
//   //       purchase: item.purchase,
//   //       latestWeight: latestWeight
//   //         ? {
//   //           weightKg: latestWeight.weightKg,
//   //           recordedAt: latestWeight.recordedAt,
//   //         }
//   //         : null,
//   //       sales: animalSales.map((s) => ({
//   //         sale: s.sale,
//   //         linkCreatedAt: s.linkCreatedAt,
//   //       })),
//   //     };
//   //   });
//   // },

//   // async getAll({
//   //   cattleClass,
//   //   search,
//   //   healthStatus,
//   //   cattleNumber,
//   //   purchaseDate,
//   //   purchasePrice,
//   //   animalStatus,
//   // }: CattleFilters) {
//   //   let cattleData = [...this.records];

//   //   // Filter by cattle class
//   //   if (cattleClass) {
//   //     const cattleClasses = cattleClass
//   //       .split(",")
//   //       .map((c) => c.trim().toLowerCase());
//   //     if (cattleClasses.length > 0) {
//   //       cattleData = cattleData.filter((item) =>
//   //         item.cattle.cattleClass
//   //           ? cattleClasses.includes(item.cattle.cattleClass.toLowerCase())
//   //           : false
//   //       );
//   //     }
//   //   }

//   //   // Filter by health status
//   //   if (healthStatus) {
//   //     const healthStatuses = healthStatus.split(",").map((status) => ({
//   //       value: status.trim(),
//   //       isBool: status.startsWith("is"),
//   //     }));
//   //     if (healthStatuses.length > 0) {
//   //       for (const status of healthStatuses) {
//   //         cattleData = cattleData.filter((item) => {
//   //           if (status.isBool) {
//   //             // Handle boolean fields like isQuarantined, isPregnant, etc.
//   //             return item.cattle[status.value as keyof Cattle];
//   //           }
//   //           return item.cattle.healthStatus === status.value;
//   //         });
//   //       }
//   //     }
//   //   }

//   //   // Filter by animal status
//   //   if (animalStatus) {
//   //     const statuses = animalStatus.split(",").map((s) => s.trim());
//   //     cattleData = cattleData.filter((item) =>
//   //       statuses.includes(item.animal.status)
//   //     );
//   //   }

//   //   // Filter by cattle number
//   //   if (cattleNumber) {
//   //     cattleData = cattleData.filter((item) =>
//   //       item.cattle.cattleNumber
//   //         .toLowerCase()
//   //         .includes(cattleNumber.toLowerCase())
//   //     );
//   //   }

//   //   // Filter by purchase date
//   //   if (purchaseDate) {
//   //     const [filterDate, filterDateEnd] = purchaseDate
//   //       .split(",")
//   //       .map((date) => new Date(Number(date)));

//   //     if (!Number.isNaN(filterDate.getTime())) {
//   //       cattleData = cattleData.filter((item) => {
//   //         if (!item.purchase) return false;
//   //         const purchaseDateValue = new Date(item.purchase.purchaseDate);
//   //         return (
//   //           purchaseDateValue >= filterDate &&
//   //           purchaseDateValue <= filterDateEnd
//   //         );
//   //       });
//   //     }
//   //   }

//   //   // Filter by purchase price
//   //   if (purchasePrice) {
//   //     const price = Number.parseFloat(purchasePrice);
//   //     if (!Number.isNaN(price)) {
//   //       cattleData = cattleData.filter((item) => {
//   //         if (!item.purchase) return false;
//   //         const totalPrice = Number(item.purchase.purchasePrice);
//   //         return totalPrice >= price;
//   //       });
//   //     }
//   //   }

//   //   // Search functionality across multiple fields
//   //   if (search) {
//   //     const searchableData = cattleData.map((item) => ({
//   //       ...item,
//   //       searchableText: `${item.cattle.cattleNumber} ${
//   //         item.cattle.tagNumber || ""
//   //       }`,
//   //     }));

//   //     const filtered = matchSorter(searchableData, search, {
//   //       keys: ["cattle.cattleNumber", "cattle.tagNumber", "searchableText"],
//   //     });

//   //     cattleData = filtered;
//   //   }

//   //   return cattleData;
//   // },

//   // Sort cattle based on the sort parameter
//   // sortCattle(
//   //   cattleData: CattleWithPurchase[],
//   //   _sort?: string,
//   // ) {
//   //   let sort = _sort;
//   //   if (!sort) {
//   //     sort = '[{"id":"purchaseDate","desc":true}]';
//   //   }

//   //   let sortCriteria: Array<{ id: string; desc: boolean }>;
//   //   try {
//   //     sortCriteria = JSON.parse(sort);
//   //   } catch (error) {
//   //     if (process.env.NODE_ENV === "development") {
//   //       // eslint-disable-next-line no-console
//   //       console.error("Failed to parse sort criteria:", error);
//   //     }
//   //     return cattleData; // Return unsorted if sort is invalid
//   //   }

//   //   if (!Array.isArray(sortCriteria) || sortCriteria.length === 0) {
//   //     return cattleData;
//   //   }

//   //   const { id: field, desc } = sortCriteria[0];
//   //   const isAsc = !desc;

//   //   return cattleData.sort((a, b) => {
//   //     let aValue: number | string;
//   //     let bValue: number | string;

//   //     switch (field) {
//   //       case "purchaseDate":
//   //         aValue = a.purchase ? new Date(a.purchase.purchaseDate).getTime() : 0;
//   //         bValue = b.purchase ? new Date(b.purchase.purchaseDate).getTime() : 0;
//   //         break;
//   //       case "cattleNumber":
//   //         aValue = a.cattle.cattleNumber;
//   //         bValue = b.cattle.cattleNumber;
//   //         break;
//   //       case "tagNumber":
//   //         aValue = a.cattle.tagNumber || "";
//   //         bValue = b.cattle.tagNumber || "";
//   //         break;
//   //       case "latestWeight":
//   //         aValue = a.latestWeight ? Number(a.latestWeight.weightKg) : 0;
//   //         bValue = b.latestWeight ? Number(b.latestWeight.weightKg) : 0;
//   //         break;
//   //       case "purchasePrice":
//   //         aValue = a.purchase ? Number(a.purchase.purchasePrice) : 0;
//   //         bValue = b.purchase ? Number(b.purchase.purchasePrice) : 0;
//   //         break;
//   //       case "createdAt":
//   //         aValue = new Date(a.animal.createdAt || 0).getTime();
//   //         bValue = new Date(b.animal.createdAt || 0).getTime();
//   //         break;
//   //       case "healthStatus":
//   //         aValue = a.cattle.healthStatus || "";
//   //         bValue = b.cattle.healthStatus || "";
//   //         break;
//   //       case "cattleClass":
//   //         aValue = a.cattle.cattleClass || "";
//   //         bValue = b.cattle.cattleClass || "";
//   //         break;
//   //       case "gender":
//   //         aValue = a.cattle.gender;
//   //         bValue = b.cattle.gender;
//   //         break;
//   //       case "animalStatus":
//   //         aValue = a.animal.status;
//   //         bValue = b.animal.status;
//   //         break;
//   //       default:
//   //         return 0;
//   //     }

//   //     if (typeof aValue === "string" && typeof bValue === "string") {
//   //       return isAsc
//   //         ? aValue.localeCompare(bValue)
//   //         : bValue.localeCompare(aValue);
//   //     }

//   //     if (aValue < bValue) return isAsc ? -1 : 1;
//   //     if (aValue > bValue) return isAsc ? 1 : -1;
//   //     return 0;
//   //   });
//   // },

//   // async getCattle(
//   //   {
//   //     page = 1,
//   //     limit = 10,
//   //     cattleClass,
//   //     search,
//   //     sort,
//   //     healthStatus,
//   //     cattleNumber,
//   //     purchaseDate,
//   //     purchasePrice,
//   //     animalStatus,
//   //   }: PaginatedCattleFilters,
//   //   forDownload = false,
//   // ) {
//   //   const allCattle = await this.getAll({
//   //     cattleClass,
//   //     search,
//   //     healthStatus,
//   //     cattleNumber,
//   //     purchaseDate,
//   //     purchasePrice,
//   //     animalStatus,
//   //   });

//   //   const sortedCattle = this.sortCattle(allCattle, sort);

//   //   const totalCattle = sortedCattle.length;

//   //   const offset = (page - 1) * limit;
//   //   const paginatedCattle = forDownload
//   //     ? sortedCattle
//   //     : sortedCattle.slice(offset, offset + limit);
//   //   const currentTime = new Date().toISOString();

//   //   // Convert to flattened format for backward compatibility
//   //   const flattenedCattle: FlattenedCattle[] = paginatedCattle.map((item) => {
//   //     const baseData = {
//   //       // Animal fields
//   //       id: item.animal.id,
//   //       farmId: item.animal.farmId,
//   //       animalType: item.animal.animalType,
//   //       status: item.animal.status,
//   //       // Cattle fields
//   //       animalId: item.cattle.animalId,
//   //       cattleNumber: item.cattle.cattleNumber,
//   //       tagNumber: item.cattle.tagNumber,
//   //       gender: item.cattle.gender,
//   //       healthStatus: item.cattle.healthStatus,
//   //       isQuarantined: item.cattle.isQuarantined,
//   //       isPregnant: item.cattle.isPregnant,
//   //       isLactating: item.cattle.isLactating,
//   //       cattleClass: item.cattle.cattleClass,
//   //       classComputedAt: item.cattle.classComputedAt,
//   //       createdAt: item.cattle.createdAt,
//   //       createdBy: item.cattle.createdBy,
//   //       updatedAt: item.cattle.updatedAt,
//   //       updatedBy: item.cattle.updatedBy,
//   //       deletedAt: item.cattle.deletedAt,
//   //     };

//   //     // Add purchase data if available
//   //     const purchaseData = item.purchase
//   //       ? {
//   //         purchaseId: item.purchase.id,
//   //         purchaseDate: item.purchase.purchaseDate,
//   //         purchasePrice: item.purchase.purchasePrice,
//   //         invoiceReference: item.purchase.invoiceReference,
//   //         transportCost: item.purchase.transportCost,
//   //         notes: item.purchase.notes,
//   //       }
//   //       : {};

//   //     // Add latest sale data if available
//   //     const latestSale = item.sales[0]?.sale;
//   //     const saleData = latestSale
//   //       ? {
//   //         saleId: latestSale.id,
//   //         saleDate: latestSale.saleDate,
//   //         totalAmount: latestSale.totalAmount,
//   //         invoiceNumber: latestSale.invoiceNumber,
//   //       }
//   //       : {};

//   //     return {
//   //       ...baseData,
//   //       ...purchaseData,
//   //       ...saleData,
//   //       // Add calculated fields
//   //       latestWeight: item.latestWeight?.weightKg,
//   //       latestWeightDate: item.latestWeight?.recordedAt,
//   //       // Add missing required AnimalPurchase fields with defaults
//   //       vendorId: item.purchase?.vendorId || null,
//   //       marketId: item.purchase?.marketId || null,
//   //     } as FlattenedCattle;
//   //   });

//   //   return {
//   //     success: true,
//   //     time: currentTime,
//   //     message: "Cattle fetched successfully",
//   //     total_cattle: totalCattle,
//   //     offset,
//   //     limit,
//   //     cattle: flattenedCattle,
//   //   };
//   // },

//   // async getCattleById(id: string) {
//   //   const cattleData = this.records.find((item) =>
//   //     item.animal.id === id || item.cattle.animalId === id
//   //   );

//   //   if (!cattleData) {
//   //     return {
//   //       success: false,
//   //       message: `Cattle with ID ${id} not found`,
//   //     };
//   //   }

//   //   return {
//   //     success: true,
//   //     message: `Cattle with ID ${id} found`,
//   //     cattle: cattleData,
//   //   };
//   // },
// };

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
