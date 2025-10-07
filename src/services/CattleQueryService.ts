/**
 * CattleQueryService - Main service for cattle data queries
 * Orchestrates all cattle query operations using specialized services
 */

import { and, count, desc, eq, inArray, type SQL, sql } from "drizzle-orm";
import { db } from "@/db";
import {
    animalPurchases,
    animals,
    cattle,
    cattleClassThresholds,
    markets,
    purchases,
    saleAnimalLinks,
    sales,
    weightRecords,
} from "@/db/schema";
// import { CATTLE_QUERY_CONFIG } from "@/config/cattle-query";
import { CattleFilterService } from "./CattleFilterService";
import { CattleSortingService } from "./CattleSortingService";
import { CattleDataProcessor } from "./CattleDataProcessor";
import { CattleCacheService } from "./CattleCacheService";
import type {
    CattleQueryResult,
    CattleThreshold,
    ICattleQueryService,
    RawCattleData,
    RelatedData,
    SaleRecord,
    WeightRecord,
} from "@/types/cattle-query";
import type { GetCattleSchema } from "@/app/_lib/validations";

export class CattleQueryService implements ICattleQueryService {
    private filterService: CattleFilterService;
    private sortingService: CattleSortingService;
    private dataProcessor: CattleDataProcessor;

    constructor() {
        this.filterService = new CattleFilterService();
        this.sortingService = new CattleSortingService();
        this.dataProcessor = new CattleDataProcessor();
    }

    /**
     * Main method to get cattle data with all processing
     */
    async getCattleData(input: GetCattleSchema): Promise<CattleQueryResult> {
        const cacheKey = CattleCacheService.generateCacheKey(input);
        const ttl = CattleCacheService.getCacheTTL(input);

        return await CattleCacheService.getCachedBaseQuery(
            cacheKey,
            async () => {
                try {
                    // Validate input
                    const filterValidation = this.filterService
                        .validateFilterInput(input);
                    if (!filterValidation.isValid) {
                        throw new Error(
                            `Invalid filter input: ${
                                filterValidation.errors.join(", ")
                            }`,
                        );
                    }

                    const sortValidation = this.sortingService
                        .validateSortConfig(input.sort);
                    if (!sortValidation.isValid) {
                        throw new Error(
                            `Invalid sort configuration: ${
                                sortValidation.errors.join(", ")
                            }`,
                        );
                    }

                    const offset = (input.page - 1) * input.perPage;
                    const needsComputedSort = this.sortingService
                        .needsComputedSort(input.sort);

                    return await db.transaction(async (tx) => {
                        // Get thresholds for cattle class filtering
                        const thresholds = await this.getThresholds(tx);

                        // Build where clause
                        const whereClause = this.buildWhereClause(
                            input,
                            thresholds,
                        );

                        // Get base cattle data
                        const rawData = await this.getBaseCattleData(
                            tx,
                            whereClause,
                            input,
                            needsComputedSort,
                            offset,
                        );

                        if (rawData.length === 0) {
                            return {
                                data: [],
                                total: 0,
                                pageCount: 0,
                                hasNextPage: false,
                                hasPreviousPage: false,
                            };
                        }

                        // Get related data
                        const animalIds = rawData.map((item) => item.animal.id);
                        const relatedData = await this.getRelatedData(
                            tx,
                            animalIds,
                            thresholds,
                        );

                        // Process and map data
                        let processedData = this.dataProcessor
                            .mapRawDataToCattleWithDetails(
                                rawData,
                                relatedData,
                            );

                        // Apply computed sorting if needed
                        if (needsComputedSort) {
                            processedData = this.sortingService.applySorting(
                                processedData,
                                input.sort,
                            );
                            // Apply pagination after sorting for computed fields
                            processedData = processedData.slice(
                                offset,
                                offset + input.perPage,
                            );
                        }

                        // Get total count
                        const total = await this.getTotalCount(tx, whereClause);

                        const pageCount = Math.ceil(total / input.perPage);

                        return {
                            data: processedData,
                            total,
                            pageCount,
                            hasNextPage: input.page < pageCount,
                            hasPreviousPage: input.page > 1,
                        };
                    });
                } catch (_error) {
                    return {
                        data: [],
                        total: 0,
                        pageCount: 0,
                        hasNextPage: false,
                        hasPreviousPage: false,
                    };
                }
            },
            ttl,
        );
    }

    /**
     * Gets cattle class thresholds with caching
     */
    private async getThresholds(tx: unknown): Promise<CattleThreshold[]> {
        return await CattleCacheService.getCachedThresholds(async () => {
            const t = tx as typeof db;
            return await t
                .select({
                    className: cattleClassThresholds.className,
                    minWeightKg: cattleClassThresholds.minWeightKg,
                    maxWeightKg: cattleClassThresholds.maxWeightKg,
                })
                .from(cattleClassThresholds)
                .where(eq(cattleClassThresholds.isActive, true))
                .orderBy(cattleClassThresholds.minWeightKg);
        });
    }

    /**
     * Builds the complete WHERE clause
     */
    private buildWhereClause(
        input: GetCattleSchema,
        thresholds: CattleThreshold[],
    ) {
        const baseWhere = this.filterService.buildWhereClause(
            input,
            thresholds,
        );

        // Add cattle class filter if specified (for basic filters only)
        if (
            input.cattleClass.length > 0 &&
            input.filterFlag !== "advancedFilters" &&
            input.filterFlag !== "commandFilters"
        ) {
            const cattleClassFilter = this.filterService.buildCattleClassFilter(
                input.cattleClass,
                thresholds,
            );
            return baseWhere && cattleClassFilter
                ? and(baseWhere, cattleClassFilter)
                : (baseWhere || cattleClassFilter);
        }

        return baseWhere;
    }

    /**
     * Gets base cattle data with joins
     */
    private async getBaseCattleData(
        tx: unknown,
        whereClause: SQL | undefined,
        input: GetCattleSchema,
        needsComputedSort: boolean,
        offset: number,
    ): Promise<RawCattleData[]> {
        const orderBy = this.sortingService.getSQLOrderBy(input.sort);
        const t = tx as typeof db;

        const query = t
            .select({
                animal: animals,
                cattle: cattle,
                animalPurchase: animalPurchases,
                purchase: purchases,
                market: markets,
            })
            .from(animals)
            .innerJoin(cattle, eq(cattle.animalId, animals.id))
            .leftJoin(animalPurchases, eq(animalPurchases.animalId, animals.id))
            .leftJoin(purchases, eq(purchases.id, animalPurchases.purchaseId))
            .leftJoin(markets, eq(markets.id, purchases.marketId))
            .leftJoin(
                weightRecords,
                and(
                    eq(weightRecords.animalId, animals.id),
                    eq(
                        weightRecords.recordedAt,
                        sql`(SELECT MAX(recorded_at) FROM weight_records WHERE animal_id = ${animals.id})`,
                    ),
                ),
            )
            .where(whereClause)
            .orderBy(...orderBy);

        // For computed sorting, get all data first
        // For simple sorting, apply pagination at SQL level
        return needsComputedSort
            ? await query
            : await query.limit(input.perPage).offset(offset);
    }

    /**
     * Gets all related data for the animals
     */
    private async getRelatedData(
        tx: unknown,
        animalIds: string[],
        thresholds: CattleThreshold[],
    ): Promise<RelatedData> {
        if (animalIds.length === 0) {
            return { weights: [], sales: [], thresholds };
        }

        // Get weight records
        const weights = await this.getWeightRecords(tx, animalIds);

        // Get sales records
        const sales = await this.getSalesRecords(tx, animalIds);

        return { weights, sales, thresholds };
    }

    /**
     * Gets weight records for animals
     */
    private async getWeightRecords(
        tx: unknown,
        animalIds: string[],
    ): Promise<WeightRecord[]> {
        const t = tx as typeof db;
        return await t
            .select({
                animalId: weightRecords.animalId,
                weightKg: weightRecords.weightKg,
                recordedAt: weightRecords.recordedAt,
                onPurchase: weightRecords.onPurchase,
                onSale: weightRecords.onSale,
            })
            .from(weightRecords)
            .where(inArray(weightRecords.animalId, animalIds))
            .orderBy(desc(weightRecords.recordedAt));
    }

    /**
     * Gets sales records for animals
     */
    private async getSalesRecords(
        tx: unknown,
        animalIds: string[],
    ): Promise<SaleRecord[]> {
        const t = tx as typeof db;
        return await t
            .select({
                animalId: saleAnimalLinks.animalId,
                sale: sales,
                linkCreatedAt: saleAnimalLinks.createdAt,
            })
            .from(saleAnimalLinks)
            .innerJoin(sales, eq(sales.id, saleAnimalLinks.saleId))
            .where(inArray(saleAnimalLinks.animalId, animalIds))
            .orderBy(desc(saleAnimalLinks.createdAt));
    }

    /**
     * Gets total count for pagination
     */
    private async getTotalCount(
        tx: unknown,
        whereClause: SQL | undefined,
    ): Promise<number> {
        const t = tx as typeof db;
        const result = await t
            .select({ count: count() })
            .from(animals)
            .innerJoin(cattle, eq(cattle.animalId, animals.id))
            .leftJoin(animalPurchases, eq(animalPurchases.animalId, animals.id))
            .leftJoin(purchases, eq(purchases.id, animalPurchases.purchaseId))
            .leftJoin(markets, eq(markets.id, purchases.marketId))
            .leftJoin(
                weightRecords,
                and(
                    eq(weightRecords.animalId, animals.id),
                    eq(
                        weightRecords.recordedAt,
                        sql`(SELECT MAX(recorded_at) FROM weight_records WHERE animal_id = ${animals.id})`,
                    ),
                ),
            )
            .where(whereClause);

        return result[0]?.count ?? 0;
    }

    /**
     * Gets cattle data by IDs
     */
    async getCattleByIds(ids: string[]): Promise<CattleQueryResult> {
        if (ids.length === 0) {
            return {
                data: [],
                total: 0,
                pageCount: 0,
                hasNextPage: false,
                hasPreviousPage: false,
            };
        }

        return await db.transaction(async (tx) => {
            const thresholds = await this.getThresholds(tx);

            const rawData = await tx
                .select({
                    animal: animals,
                    cattle: cattle,
                    animalPurchase: animalPurchases,
                    purchase: purchases,
                    market: markets,
                })
                .from(animals)
                .innerJoin(cattle, eq(cattle.animalId, animals.id))
                .leftJoin(
                    animalPurchases,
                    eq(animalPurchases.animalId, animals.id),
                )
                .leftJoin(
                    purchases,
                    eq(purchases.id, animalPurchases.purchaseId),
                )
                .leftJoin(markets, eq(markets.id, purchases.marketId))
                .where(
                    and(
                        inArray(animals.id, ids),
                        eq(animals.animalType, "CATTLE"),
                        sql`${animals.deletedAt} IS NULL`,
                        sql`${cattle.deletedAt} IS NULL`,
                    ),
                );

            const animalIds = rawData.map((item) => item.animal.id);
            const relatedData = await this.getRelatedData(
                tx,
                animalIds,
                thresholds,
            );

            const processedData = this.dataProcessor
                .mapRawDataToCattleWithDetails(rawData, relatedData);

            return {
                data: processedData,
                total: processedData.length,
                pageCount: 1,
                hasNextPage: false,
                hasPreviousPage: false,
            };
        });
    }
}
