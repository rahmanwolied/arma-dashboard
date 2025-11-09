/**
 * Market Actions
 * Server actions for CRUD operations on markets
 */

"use server";

import { db } from "@/db";
import { markets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { asc } from "drizzle-orm";

/**
 * Fetch all markets from the database
 */
export async function getMarkets() {
    try {
        const allMarkets = await db
            .select({
                id: markets.id,
                name: markets.name,
                location: markets.location,
                phone: markets.phone,
                createdAt: markets.createdAt,
                createdBy: markets.createdBy,
            })
            .from(markets)
            .orderBy(asc(markets.name));

        return {
            success: true,
            message: "Markets fetched successfully",
            markets: allMarkets,
        };
    } catch (error) {
        console.error("Error fetching markets:", error);
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "Failed to fetch markets",
            markets: [],
        };
    }
}

/**
 * Get a single market by ID
 */
export async function getMarketById(id: string) {
    try {
        const market = await db.query.markets.findFirst({
            where: eq(markets.id, id),
        });

        if (!market) {
            return {
                success: false,
                message: `Market with ID ${id} not found`,
            };
        }

        return {
            success: true,
            message: `Market with ID ${id} found`,
            market,
        };
    } catch (error) {
        console.error("Error fetching market:", error);
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "Failed to fetch market",
        };
    }
}

/**
 * Create a new market
 */
export async function createMarket(data: {
    name: string;
    location?: string | null;
    phone?: string | null;
}) {
    try {
        const [market] = await db
            .insert(markets)
            .values({
                name: data.name,
                location: data.location || null,
                phone: data.phone || null,
            })
            .returning();

        // Revalidate markets cache
        revalidateTag("markets");

        return {
            success: true,
            message: "Market created successfully",
            market,
        };
    } catch (error) {
        console.error("Error creating market:", error);
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "Failed to create market",
        };
    }
}

/**
 * Update an existing market
 */
export async function updateMarket(
    id: string,
    data: {
        name: string;
        location?: string | null;
        phone?: string | null;
    },
) {
    try {
        const [market] = await db
            .update(markets)
            .set({
                name: data.name,
                location: data.location || null,
                phone: data.phone || null,
            })
            .where(eq(markets.id, id))
            .returning();

        if (!market) {
            return {
                success: false,
                message: `Market with ID ${id} not found`,
            };
        }

        // Revalidate markets cache
        revalidateTag("markets");

        return {
            success: true,
            message: `Market with ID ${id} updated`,
            market,
        };
    } catch (error) {
        console.error("Error updating market:", error);
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "Failed to update market",
        };
    }
}

/**
 * Delete a market
 */
export async function deleteMarket(id: string) {
    try {
        const [market] = await db
            .delete(markets)
            .where(eq(markets.id, id))
            .returning();

        if (!market) {
            return {
                success: false,
                message: `Market with ID ${id} not found`,
            };
        }

        // Revalidate markets cache
        revalidateTag("markets");

        return {
            success: true,
            message: "Market deleted successfully",
            market,
        };
    } catch (error) {
        console.error("Error deleting market:", error);
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "Failed to delete market",
        };
    }
}

