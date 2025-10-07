/**
 * Comprehensive TypeScript types for cattle query system
 */

import type { SQL } from "drizzle-orm";
import type {
    animalPurchases,
    animals,
    cattle,
    markets,
    purchases,
    sales,
} from "@/db/schema";
import type { GetCattleSchema } from "@/app/_lib/validations";
import type { CattleClass } from "@/config/cattle-query";

// Raw data types from database queries
export interface RawCattleData {
    animal: typeof animals.$inferSelect;
    cattle: typeof cattle.$inferSelect;
    animalPurchase: typeof animalPurchases.$inferSelect | null;
    purchase: typeof purchases.$inferSelect | null;
    market: typeof markets.$inferSelect | null;
}

export interface WeightRecord {
    animalId: string;
    weightKg: string;
    recordedAt: Date;
    onPurchase: boolean;
    onSale: boolean;
}

export interface SaleRecord {
    animalId: string;
    sale: typeof sales.$inferSelect;
    linkCreatedAt: Date;
}

export interface CattleThreshold {
    className: string;
    minWeightKg: string | null;
    maxWeightKg: string | null;
}

// Processed data types
export interface ProcessedWeights {
    latest: { weightKg: string; recordedAt: Date } | null;
    purchase: { weightKg: string; recordedAt: Date } | null;
}

export interface CattleWithDetails {
    // Animal data
    animal: typeof animals.$inferSelect;
    // Cattle data
    cattle: typeof cattle.$inferSelect;
    // Purchase data (optional)
    animalPurchase: typeof animalPurchases.$inferSelect | null;
    purchase: typeof purchases.$inferSelect | null;
    // Latest weight record
    latestWeight: { weightKg: string; recordedAt: Date };
    // Purchase weight record
    purchaseWeight: { weightKg: string; recordedAt: Date } | null;
    // Sale data (for multi-animal sales)
    sales: Array<{ sale: typeof sales.$inferSelect; linkCreatedAt: Date }>;
    // Cattle class
    cattleClass: CattleClass;
    // Market data
    market: typeof markets.$inferSelect | null;
}

// Query configuration types
export interface FilterConfig {
    search?: string;
    gender: string[];
    healthStatus: string[];
    animalStatus: string[];
    cattleClass: string[];
    createdAt: number[];
    purchasePrice: number[];
    advancedFilters?: unknown[];
    joinOperator: "and" | "or";
}

export interface SortConfig {
    id: string;
    desc: boolean;
}

export interface PaginationConfig {
    page: number;
    perPage: number;
    offset: number;
}

export interface CattleQueryConfig {
    filters: FilterConfig;
    sorting: SortConfig[];
    pagination: PaginationConfig;
    includeWeights: boolean;
    includeSales: boolean;
    useAdvancedFiltering: boolean;
}

// Result types
export interface CattleQueryResult {
    data: CattleWithDetails[];
    total: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface RelatedData {
    weights: WeightRecord[];
    sales: SaleRecord[];
    thresholds: CattleThreshold[];
}

// Service interfaces
export interface ICattleFilterService {
    buildWhereClause(
        input: GetCattleSchema,
        thresholds?: CattleThreshold[],
    ): SQL | undefined;
    buildAdvancedFilters(
        filters: unknown[],
        joinOperator: "and" | "or",
        additionalTables: Record<string, unknown>,
        thresholds?: CattleThreshold[],
    ): SQL | undefined;
    buildHealthStatusFilters(
        healthStatus: string[],
    ): [SQL<unknown>[] | undefined, SQL<unknown> | undefined];
    buildWeightRangeFilters(
        cattleClass: string[],
        thresholds: CattleThreshold[],
    ): SQL[];
    buildDateRangeFilters(createdAt: number[]): SQL | undefined;
    buildPriceRangeFilters(purchasePrice: number[]): SQL | undefined;
}

export interface ICattleSortingService {
    needsComputedSort(sortConfig: SortConfig[]): boolean;
    getSQLOrderBy(sortConfig: SortConfig[]): SQL[];
    applySorting(
        data: CattleWithDetails[],
        sortConfig: SortConfig[],
    ): CattleWithDetails[];
    sortByCattleClass(
        data: CattleWithDetails[],
        desc: boolean,
    ): CattleWithDetails[];
    sortByPurchasePrice(
        data: CattleWithDetails[],
        desc: boolean,
    ): CattleWithDetails[];
    sortByTotalPrice(
        data: CattleWithDetails[],
        desc: boolean,
    ): CattleWithDetails[];
    sortByPurchaseDate(
        data: CattleWithDetails[],
        desc: boolean,
    ): CattleWithDetails[];
}

export interface ICattleDataProcessor {
    mapRawDataToCattleWithDetails(
        rawData: RawCattleData[],
        relatedData: RelatedData,
    ): CattleWithDetails[];
    calculateCattleClass(
        weightKg: number,
        thresholds: CattleThreshold[],
    ): CattleClass;
    processWeightData(
        weights: WeightRecord[],
        animalId: string,
    ): ProcessedWeights;
    processSalesData(
        salesRecords: SaleRecord[],
        animalId: string,
    ): Array<{ sale: typeof sales.$inferSelect; linkCreatedAt: Date }>;
}

export interface ICattleQueryService {
    getCattleData(input: GetCattleSchema): Promise<CattleQueryResult>;
}

// Error types
export class CattleQueryError extends Error {
    constructor(
        message: string,
        public code: string,
        public details?: unknown,
    ) {
        super(message);
        this.name = "CattleQueryError";
    }
}

// Validation types
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// Cache types
export interface CacheConfig {
    key: string;
    ttl: number;
    tags: string[];
}

export interface CachedData<T> {
    data: T;
    timestamp: number;
    key: string;
}
