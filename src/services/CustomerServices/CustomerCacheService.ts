/**
 * CustomerCacheService - Provides granular caching for customer queries
 */

import { unstable_cache } from "@/lib/unstable-cache";

export namespace CustomerCacheService {
    /**
     * Cache base customer query results with shorter TTL
     */
    export async function getCachedBaseQuery<T>(
        queryKey: string,
        fetcher: () => Promise<T>,
        ttl = 300, // 5 minutes default
    ): Promise<T> {
        return await unstable_cache(
            fetcher,
            [`customer-base-${queryKey}`],
            {
                revalidate: ttl,
                tags: ["customers"],
            },
        )();
    }

    /**
     * Generate cache key for customer queries
     */
    export function generateCacheKey(
        input: import("@/app/_lib/validations").GetCustomersSchema,
    ): string {
        // Create a deterministic cache key from the input
        const keyParts = [
            `page-${input.page}`,
            `perPage-${input.perPage}`,
            `search-${input.search || ""}`,
            `division-${input.division.sort().join(",")}`,
            `district-${input.district.sort().join(",")}`,
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
        input: import("@/app/_lib/validations").GetCustomersSchema,
    ): number {
        // Default TTL
        let ttl = 300; // 5 minutes

        // Reduce TTL for advanced filters
        if (
            input.filterFlag === "advancedFilters" || input.filters.length > 0
        ) {
            ttl = Math.max(30, ttl / 2);
        }

        // Increase TTL for simple, stable queries
        if (
            input.search === "" && input.filters.length === 0 &&
            input.sort.length === 0 && input.division.length === 0 &&
            input.district.length === 0
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
}



