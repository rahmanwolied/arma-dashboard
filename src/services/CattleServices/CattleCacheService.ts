/**
 * CattleCacheService - Provides granular caching for cattle queries
 */

import { unstable_cache } from "@/lib/unstable-cache";
import { CATTLE_QUERY_CONFIG } from "@/config/cattle-query";
import type { CattleThreshold } from "@/types/cattle-query";

export namespace CattleCacheService {
    /**
     * Cache cattle class thresholds (changes rarely)
     */
    export async function getCachedThresholds(
        fetcher: () => Promise<CattleThreshold[]>,
    ): Promise<CattleThreshold[]> {
        return await unstable_cache(
            fetcher,
            ["cattle-thresholds"],
            {
                revalidate: 3600, // 1 hour - thresholds don't change often
                tags: ["cattle-thresholds"],
            },
        )();
    }

    /**
     * Cache base cattle query results with shorter TTL
     */
    export async function getCachedBaseQuery<T>(
        queryKey: string,
        fetcher: () => Promise<T>,
        ttl = 300, // 5 minutes default
    ): Promise<T> {
        return await unstable_cache(
            fetcher,
            [`cattle-base-${queryKey}`],
            {
                revalidate: ttl,
                tags: ["cattle", "animals"],
            },
        )();
    }

    /**
     * Cache weight records with very short TTL (real-time-ish data)
     */
    export async function getCachedWeights<T>(
        animalIds: string[],
        fetcher: () => Promise<T>,
    ): Promise<T> {
        const cacheKey = `weights-${animalIds.sort().join("-")}`;

        return await unstable_cache(
            fetcher,
            [cacheKey],
            {
                revalidate: 60, // 1 minute - weights can change frequently
                tags: ["weights"],
            },
        )();
    }

    /**
     * Cache sales data with medium TTL
     */
    export async function getCachedSales<T>(
        animalIds: string[],
        fetcher: () => Promise<T>,
    ): Promise<T> {
        const cacheKey = `sales-${animalIds.sort().join("-")}`;

        return await unstable_cache(
            fetcher,
            [cacheKey],
            {
                revalidate: 600, // 10 minutes - sales don't change as often
                tags: ["sales"],
            },
        )();
    }

    /**
     * Generate cache key for cattle queries
     */
    export function generateCacheKey(
        input: import("@/app/_lib/validations").GetCattleSchema,
    ): string {
        // Create a deterministic cache key from the input
        const keyParts = [
            `page-${input.page}`,
            `perPage-${input.perPage}`,
            `search-${input.search || ""}`,
            `gender-${input.gender.sort().join(",")}`,
            `health-${input.healthStatus.sort().join(",")}`,
            `animal-${input.animalStatus.sort().join(",")}`,
            `class-${input.cattleClass.sort().join(",")}`,
            `created-${input.createdAt.join("-")}`,
            `price-${input.purchasePrice.join("-")}`,
            `sort-${JSON.stringify(input.sort)}`,
            `filter-${input.filterFlag || ""}`,
            `join-${input.joinOperator}`,
        ];

        return keyParts.filter((part) =>
            !part.endsWith("-") && !part.endsWith(",")
        ).join("_");
    }

    /**
     * Get cache TTL based on query complexity
     */
    export function getCacheTTL(
        input: import("@/app/_lib/validations").GetCattleSchema,
    ): number {
        // More complex queries get shorter TTL
        let ttl: number = CATTLE_QUERY_CONFIG.CACHE_TTL as number;

        // Reduce TTL for real-time filters
        if (
            input.healthStatus.includes("SICK") ||
            input.healthStatus.includes("CRITICAL")
        ) {
            ttl = 30; // 30 seconds for health-critical queries
        }

        // Reduce TTL for advanced filters
        if (
            input.filterFlag === "advancedFilters" || input.filters.length > 0
        ) {
            ttl = Math.max(30, ttl / 2);
        }

        // Increase TTL for simple, stable queries
        if (
            input.search === "" && input.filters.length === 0 &&
            input.sort.length === 0
        ) {
            ttl = ttl * 2;
        }

        return ttl;
    }

    /**
     * Clear specific cache entries
     */
    export async function invalidateCache(_tags: string[]): Promise<void> {
        // Hook for cache invalidation - integrate with your cache layer
        void _tags;
        return;
    }

    /**
     * Warm up cache with common queries
     */
    export async function warmUpCache(
        commonQueries: import("@/app/_lib/validations").GetCattleSchema[],
    ): Promise<void> {
        // Pre-populate cache with common query patterns
        for (let i = 0; i < commonQueries.length; i++) {
            // This would trigger the query to populate the cache
            // no-op: integrate with real cache warmer if needed
        }
    }
}
