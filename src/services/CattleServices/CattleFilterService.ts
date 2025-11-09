/**
 * CattleFilterService - Handles all filtering logic for cattle queries
 * Uses Drizzle ORM methods exclusively, no raw SQL
 */

import {
    and,
    eq,
    gte,
    ilike,
    inArray,
    lte,
    or,
    type SQL,
    sql,
    type Table,
} from "drizzle-orm";
import {
    animalPurchases,
    animals,
    cattle,
    cattleClassThresholds,
    markets,
    purchases,
    weightRecords,
} from "@/db/schema";
import { filterColumns } from "@/lib/filters";
import { CATTLE_QUERY_CONFIG } from "@/config/cattle-query";
import type {
    CattleThreshold,
    ICattleFilterService,
} from "@/types/cattle-query";
import type { ExtendedColumnFilter } from "@/types/data-table";
import type { GetCattleSchema } from "@/app/_lib/validations";

export class CattleFilterService implements ICattleFilterService {
    /**
     * Builds the main WHERE clause for cattle queries
     */
    buildWhereClause(
        input: GetCattleSchema,
        thresholds?: CattleThreshold[],
    ): SQL | undefined {
        const isAdvancedTable = input.filterFlag === "advancedFilters" ||
            input.filterFlag === "commandFilters";

        if (isAdvancedTable) {
            return this.buildAdvancedFilters(
                input.filters,
                input.joinOperator,
                {
                    animals,
                    cattle,
                    animalPurchases,
                    purchases,
                    markets,
                    cattleClassThresholds,
                    weightRecords,
                },
                thresholds,
            );
        }

        return this.buildBasicFilters(input);
    }

    /**
     * Builds advanced filters using the filterColumns utility
     */
    buildAdvancedFilters(
        filters: ExtendedColumnFilter<typeof cattle>[],
        joinOperator: "and" | "or",
        additionalTables: Record<string, Table>,
        thresholds?: CattleThreshold[],
    ): SQL | undefined {
        return filterColumns({
            table: cattle,
            filters,
            joinOperator,
            cattleClassThresholds: thresholds,
            additionalTables,
        });
    }

    /**
     * Builds basic filters for standard cattle queries
     */
    private buildBasicFilters(input: GetCattleSchema): SQL | undefined {
        const conditions: SQL[] = [];
        const search = this.buildSearchFilter(input.search);
        if (search) conditions.push(search);

        const gender = this.buildGenderFilter(input.gender);
        if (gender) conditions.push(gender);

        const [booleanHealth, healthEnum] = this.buildHealthStatusFilters(
            input.healthStatus,
        );
        if (Array.isArray(booleanHealth) && booleanHealth.length > 0) {
            conditions.push(...booleanHealth);
        }
        if (healthEnum) conditions.push(healthEnum as SQL);

        const animalStatus = this.buildAnimalStatusFilter(input.animalStatus);
        if (animalStatus) conditions.push(animalStatus as SQL);

        const createdRange = this.buildDateRangeFilters(input.createdAt);
        if (createdRange) conditions.push(createdRange);

        const priceRange = this.buildPriceRangeFilters(input.purchasePrice);
        if (priceRange) conditions.push(priceRange);

        const tagNumber = this.buildTagNumberFilter(input.tagNumber);
        if (tagNumber) conditions.push(tagNumber);

        // Only show cattle (not other animal types)
        conditions.push(eq(animals.animalType, "CATTLE"));
        // Exclude soft-deleted records
        conditions.push(sql`${animals.deletedAt} IS NULL`);
        conditions.push(sql`${cattle.deletedAt} IS NULL`);

        return conditions.length > 0 ? and(...conditions) : undefined;
    }

    /**
     * Builds search filter for tag number
     */
    private buildSearchFilter(search?: string): SQL | undefined {
        if (!search) return undefined;
        return ilike(cattle.tagNumber, `%${search}%`);
    }

    /**
     * Builds gender filter
     */
    private buildGenderFilter(genders: string[]): SQL | undefined {
        if (genders.length === 0) return undefined;
        // Input is string[] from query params; cast to enum array for Drizzle
        return inArray(
            cattle.gender,
            genders as unknown as readonly typeof cattle.gender._.enumValues[
            number
            ][],
        );
    }

    /**
     * Builds animal status filter
     */
    private buildAnimalStatusFilter(statuses: string[]): SQL | undefined {
        if (statuses.length === 0) return undefined;
        return inArray(
            animals.status,
            statuses as unknown as readonly typeof animals.status._.enumValues[
            number
            ][],
        );
    }

    /**
     * Builds health status filters - handles both boolean fields and health status enum
     */
    buildHealthStatusFilters(
        healthStatus: string[],
    ): [SQL<unknown>[] | undefined, SQL<unknown> | undefined] {
        if (healthStatus.length === 0) {
            return [undefined, undefined];
        }

        const { HEALTH_STATUS_CATEGORIES } = CATTLE_QUERY_CONFIG;

        // Separate boolean field statuses from health status enum values
        const booleanFieldStatuses = healthStatus.filter((status) =>
            (HEALTH_STATUS_CATEGORIES.BOOLEAN_FIELDS as readonly string[])
                .includes(status)
        );

        const healthStatusEnumValues = healthStatus.filter((status) =>
            (HEALTH_STATUS_CATEGORIES.HEALTH_STATUSES as readonly string[])
                .includes(status)
        );

        // Build boolean field conditions
        const booleanConditions: SQL[] | undefined =
            booleanFieldStatuses.length > 0
                ? booleanFieldStatuses.map((status) => {
                    switch (status) {
                        case "LACTATING":
                            return eq(cattle.isLactating, true);
                        case "PREGNANT":
                            return eq(cattle.isPregnant, true);
                        case "QUARANTINED":
                            return eq(cattle.isQuarantined, true);
                        case "NOT_LACTATING":
                            return eq(cattle.isLactating, false);
                        case "NOT_PREGNANT":
                            return eq(cattle.isPregnant, false);
                        case "NOT_QUARANTINED":
                            return eq(cattle.isQuarantined, false);
                        default:
                            return undefined;
                    }
                }).filter((condition): condition is SQL =>
                    condition !== undefined
                )
                : undefined;

        // Build health status enum condition
        const healthStatusCondition = healthStatusEnumValues.length > 0
            ? inArray(
                cattle.healthStatus,
                healthStatusEnumValues as unknown as readonly typeof cattle.healthStatus._.enumValues[
                number
                ][],
            )
            : undefined;

        return [booleanConditions, healthStatusCondition];
    }

    /**
     * Builds weight range filters for cattle class filtering
     */
    buildWeightRangeFilters(
        cattleClasses: string[],
        thresholds: CattleThreshold[],
    ): SQL[] {
        if (cattleClasses.length === 0 || thresholds.length === 0) {
            return [];
        }

        const relevantThresholds = thresholds.filter((threshold) =>
            cattleClasses.includes(threshold.className)
        );

        const ranges: SQL[] = [];
        for (const threshold of relevantThresholds) {
            const minWeight = threshold.minWeightKg || "0";
            const maxWeight = threshold.maxWeightKg || "999999";
            ranges.push(
                and(
                    gte(weightRecords.weightKg, minWeight),
                    lte(weightRecords.weightKg, maxWeight),
                ) as SQL,
            );
        }
        return ranges;
    }

    /**
     * Builds date range filters for creation date
     */
    buildDateRangeFilters(createdAt: number[]): SQL | undefined {
        if (createdAt.length === 0) return undefined;

        const conditions: SQL[] = [];

        if (createdAt[0]) {
            const startDate = new Date(createdAt[0]);
            startDate.setHours(0, 0, 0, 0);
            conditions.push(gte(cattle.createdAt, startDate));
        }

        if (createdAt[1]) {
            const endDate = new Date(createdAt[1]);
            endDate.setHours(23, 59, 59, 999);
            conditions.push(lte(cattle.createdAt, endDate));
        }

        return conditions.length > 0 ? and(...conditions) : undefined;
    }

    /**
     * Builds tag number filter
     */
    private buildTagNumberFilter(tagNumber?: string): SQL | undefined {
        if (!tagNumber) return undefined;
        return ilike(cattle.tagNumber, `%${tagNumber}%`);
    }

    /**
     * Builds price range filters for purchase price per kg
     */
    buildPriceRangeFilters(purchasePrice: number[]): SQL | undefined {
        if (purchasePrice.length === 0) return undefined;

        const conditions: SQL[] = [];

        if (purchasePrice[0] !== undefined) {
            conditions.push(
                gte(
                    sql`${animalPurchases.purchasePrice} / (SELECT weight_kg FROM weight_records WHERE animal_id = ${animals.id} AND on_purchase = true LIMIT 1)`,
                    purchasePrice[0].toString(),
                ),
            );
        }

        if (purchasePrice[1] !== undefined) {
            conditions.push(
                lte(
                    sql`${animalPurchases.purchasePrice} / (SELECT weight_kg FROM weight_records WHERE animal_id = ${animals.id} AND on_purchase = true LIMIT 1)`,
                    purchasePrice[1].toString(),
                ),
            );
        }

        return conditions.length > 0 ? and(...conditions) : undefined;
    }

    /**
     * Builds weight range condition for cattle class filtering
     */
    buildCattleClassFilter(
        cattleClasses: string[],
        thresholds: CattleThreshold[],
    ): SQL | undefined {
        const weightRangeConditions = this.buildWeightRangeFilters(
            cattleClasses,
            thresholds,
        );
        return weightRangeConditions.length > 0
            ? or(...weightRangeConditions)
            : undefined;
    }

    /**
     * Validates filter input
     */
    validateFilterInput(
        input: GetCattleSchema,
    ): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (input.page < 1) {
            errors.push("Page number must be greater than 0");
        }

        if (input.perPage > CATTLE_QUERY_CONFIG.MAX_PER_PAGE) {
            errors.push(
                `Page size cannot exceed ${CATTLE_QUERY_CONFIG.MAX_PER_PAGE}`,
            );
        }

        if (input.perPage < 1) {
            errors.push("Page size must be greater than 0");
        }

        if (input.createdAt.length > 2) {
            errors.push("Created date range should have at most 2 values");
        }

        if (input.purchasePrice.length > 2) {
            errors.push("Purchase price range should have at most 2 values");
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }
}
