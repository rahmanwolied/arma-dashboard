import "server-only";

import { CattleQueryService } from "@/services/CattleServices/CattleQueryService";
import type { GetCattleSchema } from "../validations";
import type { CattleWithDetails } from "@/types/cattle-query";

// Re-export the type for backward compatibility
export type { CattleWithDetails };

/**
 * Main cattle data query function - now uses CattleQueryService
 */
export async function getCattleData(input: GetCattleSchema) {
    const queryInput = {
        ...input,
        sort: input.sort.length === 0
            ? [{ id: "purchaseDate", desc: true }, { id: "tagNumber", desc: true }] as typeof input.sort
            : input.sort
    };
    const queryService = new CattleQueryService();
    return await queryService.getCattleData(queryInput);
}

/**
 * Gets cattle data by specific IDs
 */
export async function getCattleByIds(ids: string[]) {
    const queryService = new CattleQueryService();
    return await queryService.getCattleByIds(ids);
}
