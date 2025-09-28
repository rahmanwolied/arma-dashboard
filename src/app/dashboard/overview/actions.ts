"use server";

import { db } from "@/db";
import {
  animalPurchases,
  cattle,
  markets,
  purchases,
  weightRecords,
} from "@/db/schema";
import { and, avg, count, desc, eq, gte, lte, sql, sum } from "drizzle-orm";

export interface CattleStats {
  totalCows: number;
  totalCost: number;
  locationWithHighestCount: {
    location: string;
    count: number;
  };
  averageWeight: number;
  cowsBoughtThisMonth: number;
}

export async function getCattleStatistics(): Promise<CattleStats> {
  try {
    // Get total number of cows
    const totalCowsResult = await db.select({ count: count() }).from(cattle);
    const totalCows = totalCowsResult[0]?.count || 0;

    // Get cows bought this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const cowsBoughtThisMonthResult = await db
      .select({ count: count() })
      .from(purchases)
      .innerJoin(animalPurchases, eq(animalPurchases.purchaseId, purchases.id))
      .innerJoin(cattle, eq(cattle.animalId, animalPurchases.animalId))
      .where(
        and(
          gte(purchases.purchaseDate, startOfMonth),
          lte(purchases.purchaseDate, endOfMonth),
        ),
      );

    const cowsBoughtThisMonth = cowsBoughtThisMonthResult[0]?.count || 0;

    // Calculate total cost of all cattle purchases
    const purchaseCosts = await db
      .select({
        purchasePrice: animalPurchases.purchasePrice,
      })
      .from(animalPurchases);

    const totalCost = purchaseCosts.reduce((sum, purchase) => {
      return sum + Number(purchase.purchasePrice || 0);
    }, 0);

    // Get location with highest count (using vendors as location proxy)
    const locationCounts = await db
      .select({
        marketName: markets.name,
        count: count(),
      })
      .from(purchases)
      .innerJoin(markets, eq(markets.id, purchases.marketId))
      .innerJoin(animalPurchases, eq(animalPurchases.purchaseId, purchases.id))
      .groupBy(markets.name)
      .orderBy(desc(count()))
      .limit(1);

    const locationWithHighestCount = locationCounts[0]
      ? {
        location: locationCounts[0].marketName,
        count: locationCounts[0].count,
      }
      : {
        location: "No data",
        count: 0,
      };

    // Get average cow weight from latest weight records
    const averageWeightResult = await db
      .select({ averageWeight: avg(weightRecords.weightKg) })
      .from(weightRecords);

    const averageWeight = Math.round(
      Number(averageWeightResult[0]?.averageWeight || 0),
    );

    return {
      totalCows,
      totalCost: Math.round(totalCost),
      locationWithHighestCount,
      averageWeight,
      cowsBoughtThisMonth,
    };
  } catch (error) {
    // Log error for debugging
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Error fetching cattle statistics:", error);
    }
    throw new Error("Failed to fetch cattle statistics");
  }
}

// Alternative action that returns formatted data for display
export async function getCattleStatisticsFormatted(): Promise<{
  totalCows: string;
  totalCost: string;
  locationWithHighestCount: {
    location: string;
    count: string;
  };
  averageWeight: string;
  cowsBoughtThisMonth: string;
}> {
  try {
    const stats = await getCattleStatistics();

    return {
      totalCows: stats.totalCows.toLocaleString(),
      totalCost: `৳${stats.totalCost.toLocaleString()}`,
      locationWithHighestCount: {
        location: `${stats.locationWithHighestCount.location}`,
        count: `${stats.locationWithHighestCount.count}`,
      },
      averageWeight: `${stats.averageWeight} kg`,
      cowsBoughtThisMonth: `${stats.cowsBoughtThisMonth}`,
    };
  } catch (error) {
    // Log error for debugging
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Error fetching formatted cattle statistics:", error);
    }
    throw new Error("Failed to fetch formatted cattle statistics");
  }
}

// Detailed statistics action with additional breakdown
export async function getDetailedCattleStatistics(): Promise<{
  basic: CattleStats;
  breakdown: {
    healthStatus: { status: string; count: number; percentage: number }[];
    cattleClass: { class: string; count: number; percentage: number }[];
    genderDistribution: { gender: string; count: number; percentage: number }[];
    locationBreakdown: { location: string; count: number; totalCost: number }[];
  };
}> {
  try {
    const basic = await getCattleStatistics();

    // Health status breakdown
    const healthStatusCounts = await db
      .select({
        status: cattle.healthStatus,
        count: count(),
      })
      .from(cattle)
      .groupBy(cattle.healthStatus);

    const healthStatus = healthStatusCounts.map((item) => ({
      status: item.status,
      count: item.count,
      percentage: Math.round((item.count / basic.totalCows) * 100),
    }));

    // Cattle class breakdown
    const cattleClassCounts = await db
      .select({
        class: cattle.cattleClass,
        count: count(),
      })
      .from(cattle)
      .where(sql`${cattle.cattleClass} IS NOT NULL`)
      .groupBy(cattle.cattleClass);

    const cattleClass = cattleClassCounts.map((item) => ({
      class: item.class || "UNCLASSIFIED",
      count: item.count,
      percentage: Math.round((item.count / basic.totalCows) * 100),
    }));

    // Gender distribution
    const genderCounts = await db
      .select({
        gender: cattle.gender,
        count: count(),
      })
      .from(cattle)
      .groupBy(cattle.gender);

    const genderDistribution = genderCounts.map((item) => ({
      gender: item.gender,
      count: item.count,
      percentage: Math.round((item.count / basic.totalCows) * 100),
    }));

    // Location breakdown with costs (using purchase notes as location)
    const locationData = await db
      .select({
        location: sql<
          string
        >`COALESCE(${animalPurchases.notes}, 'Unknown Location')`.as(
          "location",
        ),
        count: count(),
        totalCost: sum(animalPurchases.purchasePrice),
      })
      .from(animalPurchases)
      .groupBy(sql`COALESCE(${animalPurchases.notes}, 'Unknown Location')`)
      .orderBy(desc(count()));

    const locationBreakdown = locationData.map((item) => ({
      location: item.location,
      count: item.count,
      totalCost: Math.round(Number(item.totalCost || 0)),
    }));

    return {
      basic,
      breakdown: {
        healthStatus,
        cattleClass,
        genderDistribution,
        locationBreakdown,
      },
    };
  } catch (error) {
    // Log error for debugging
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Error fetching detailed cattle statistics:", error);
    }
    throw new Error("Failed to fetch detailed cattle statistics");
  }
}

// Additional utility functions for dashboard

export async function getCattleGrowthTrends(): Promise<{
  monthlyGrowth: { month: string; purchases: number; totalCost: number }[];
  weightTrends: { period: string; averageWeight: number }[];
}> {
  try {
    // Get monthly purchase trends for the last 12 months
    const monthlyGrowth = await db
      .select({
        month: sql<string>`TO_CHAR(${animalPurchases.purchaseDate}, 'YYYY-MM')`
          .as("month"),
        purchases: count(),
        totalCost: sum(animalPurchases.purchasePrice),
      })
      .from(animalPurchases)
      .where(
        gte(
          animalPurchases.purchaseDate,
          new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
        ),
      )
      .groupBy(sql`TO_CHAR(${animalPurchases.purchaseDate}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${animalPurchases.purchaseDate}, 'YYYY-MM')`);

    // Get weight trends (quarterly averages)
    const weightTrends = await db
      .select({
        period: sql<string>`TO_CHAR(${weightRecords.recordedAt}, 'YYYY-Q')`.as(
          "period",
        ),
        averageWeight: avg(weightRecords.weightKg),
      })
      .from(weightRecords)
      .where(
        gte(
          weightRecords.recordedAt,
          new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000),
        ),
      )
      .groupBy(sql`TO_CHAR(${weightRecords.recordedAt}, 'YYYY-Q')`)
      .orderBy(sql`TO_CHAR(${weightRecords.recordedAt}, 'YYYY-Q')`);

    return {
      monthlyGrowth: monthlyGrowth.map((item) => ({
        month: item.month,
        purchases: item.purchases,
        totalCost: Math.round(Number(item.totalCost || 0)),
      })),
      weightTrends: weightTrends.map((item) => ({
        period: item.period,
        averageWeight: Math.round(Number(item.averageWeight || 0)),
      })),
    };
  } catch (error) {
    // Log error for debugging
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Error fetching cattle growth trends:", error);
    }
    throw new Error("Failed to fetch cattle growth trends");
  }
}

export async function getRecentActivities(): Promise<{
  recentPurchases: Array<{
    id: string;
    purchaseDate: Date;
    cost: number;
    notes: string | null;
  }>;
  recentWeightRecords: Array<{
    id: string;
    recordedAt: Date;
    weightKg: number;
    notes: string | null;
  }>;
}> {
  try {
    // Get recent purchases
    const recentPurchases = await db
      .select({
        id: animalPurchases.id,
        purchaseDate: animalPurchases.purchaseDate,
        cost: animalPurchases.purchasePrice,
        notes: animalPurchases.notes,
      })
      .from(animalPurchases)
      .orderBy(desc(animalPurchases.purchaseDate))
      .limit(10);

    // Get recent weight records
    const recentWeightRecords = await db
      .select({
        id: weightRecords.id,
        recordedAt: weightRecords.recordedAt,
        weightKg: weightRecords.weightKg,
        notes: weightRecords.notes,
      })
      .from(weightRecords)
      .orderBy(desc(weightRecords.recordedAt))
      .limit(10);

    return {
      recentPurchases: recentPurchases.map((item) => ({
        id: item.id,
        purchaseDate: item.purchaseDate,
        cost: Number(item.cost),
        notes: item.notes,
      })),
      recentWeightRecords: recentWeightRecords.map((item) => ({
        id: item.id,
        recordedAt: item.recordedAt,
        weightKg: Number(item.weightKg),
        notes: item.notes,
      })),
    };
  } catch (error) {
    // Log error for debugging
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Error fetching recent activities:", error);
    }
    throw new Error("Failed to fetch recent activities");
  }
}
