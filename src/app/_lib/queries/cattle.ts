import "server-only";

/**
 * Cattle Data Query Function - Refactored
 *
 * Usage example:
 *
 * ```typescript
 * import { getCattleData } from "@/app/_lib/queries/cattle";
 * import { cattleSearchParamsCache } from "@/app/_lib/validations";
 *
 * // In your component or API route:
 * const searchParams = cattleSearchParamsCache.parse({
 *   page: 1,
 *   perPage: 20,
 *   search: "tag123",
 *   gender: ["FEMALE"],
 *   healthStatus: ["HEALTHY"],
 *   isPregnant: true
 * });
 *
 * const result = await getCattleData(searchParams);
 * // result.data - array of cattle with details
 * // result.total - total count
 * // result.pageCount - number of pages
 * // result.hasNextPage - boolean
 * // result.hasPreviousPage - boolean
 * ```
 */

import { CattleQueryService } from "@/services/CattleQueryService";
import type { GetCattleSchema } from "../validations";
import type { CattleWithDetails } from "@/types/cattle-query";

// Re-export the type for backward compatibility
export type { CattleWithDetails };

/**
 * Main cattle data query function - now uses CattleQueryService
 */
export async function getCattleData(input: GetCattleSchema) {
    if (input.sort.length === 0) input.sort.push({ id: "purchaseDate", desc: true } as any);
    const queryService = new CattleQueryService();
    return await queryService.getCattleData(input);
}

/**
 * Gets cattle data by specific IDs
 */
export async function getCattleByIds(ids: string[]) {
    const queryService = new CattleQueryService();
    return await queryService.getCattleByIds(ids);
}
