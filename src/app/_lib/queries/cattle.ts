import "server-only";

/**
 * Cattle Data Query Function
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
 * ```
 */

import {
    and,
    asc,
    count,
    desc,
    eq,
    gte,
    ilike,
    inArray,
    lte,
    min,
    or,
    SQL,
    sql,
} from "drizzle-orm";
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

import { filterColumns } from "@/lib/filter-columns";
import { unstable_cache } from "@/lib/unstable-cache";

import type { GetCattleSchema } from "../validations";

export type CattleWithDetails = {
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
    cattleClass: "SILVER" | "GOLD" | "PLATINUM";
    // Market data
    market: typeof markets.$inferSelect | null;
};

export async function getCattleData(input: GetCattleSchema) {
    return await unstable_cache(
        async () => {
            try {
                const offset = (input.page - 1) * input.perPage;
                const advancedTable = input.filterFlag === "advancedFilters" ||
                    input.filterFlag === "commandFilters";

                const advancedWhere = filterColumns({
                    table: cattle,
                    filters: input.filters,
                    joinOperator: input.joinOperator,
                    additionalTables: {
                        animals,
                        cattle,
                        animalPurchases,
                        purchases,
                        markets,
                        cattleClassThresholds,
                    },
                });

                const getHealthStatusWhere = (): [
                    SQL<unknown>[] | undefined,
                    SQL<unknown> | undefined,
                ] => {
                    const cattleInfoValues = input.healthStatus.filter((
                        status,
                    ) => status !== "HEALTHY" && status !== "MINOR_ISSUE" &&
                        status !== "SICK" && status !== "CRITICAL"
                    );
                    const healthStatusValues = input.healthStatus.filter((
                        status,
                    ) => status === "HEALTHY" || status === "MINOR_ISSUE" ||
                        status === "SICK" || status === "CRITICAL"
                    );

                    const cattleInfoFilter = cattleInfoValues.length > 0
                        ? cattleInfoValues.map((status) => {
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
                            }
                        }).filter((filter) => filter !== undefined)
                        : undefined;

                    const healthStatusFilter = healthStatusValues.length > 0
                        ? inArray(cattle.healthStatus, healthStatusValues)
                        : undefined;

                    return [cattleInfoFilter, healthStatusFilter];
                };

                const [cattleInfoFilter, healthStatusFilter] =
                    getHealthStatusWhere();

                // Note: For complex sorting like cattleClass, purchasePrice, etc., we'll need to sort after data fetching
                // since these require computed values from joins and latest weight records
                const orderBy = input.sort.length > 0
                    ? input.sort.map((item) => {
                        // Handle different sortable fields
                        switch (item.id) {
                            case "tagNumber":
                                return item.desc
                                    ? desc(cattle.tagNumber)
                                    : asc(cattle.tagNumber);
                            case "gender":
                                return item.desc
                                    ? desc(cattle.gender)
                                    : asc(cattle.gender);
                            case "healthStatus":
                                return item.desc
                                    ? desc(cattle.healthStatus)
                                    : asc(cattle.healthStatus);
                            case "createdAt":
                                return item.desc
                                    ? desc(cattle.createdAt)
                                    : asc(cattle.createdAt);
                            case "animalStatus":
                                return item.desc
                                    ? desc(animals.status)
                                    : asc(animals.status);
                            // For complex sorting that requires computed values, we sort by a fallback field
                            // and handle the actual sorting after data is processed
                            case "cattleClass":
                            case "purchasePrice":
                            case "totalPrice":
                            case "purchaseDate":
                                return item.desc
                                    ? desc(cattle.createdAt)
                                    : asc(cattle.createdAt);
                            default:
                                return item.desc
                                    ? desc(cattle.createdAt)
                                    : asc(cattle.createdAt);
                        }
                    })
                    : [asc(cattle.tagNumber)];

                const { data: finalSortedData, total } = await db.transaction(
                    async (tx) => {
                        // Get weight thresholds for selected cattle classes
                        const weightThresholds = input.cattleClass.length > 0
                            ? await tx.select({
                                minWeight: cattleClassThresholds.minWeightKg,
                                maxWeight: cattleClassThresholds.maxWeightKg,
                            }).from(cattleClassThresholds).where(
                                and(
                                    eq(cattleClassThresholds.isActive, true),
                                    inArray(
                                        cattleClassThresholds.className,
                                        input.cattleClass,
                                    ),
                                ),
                            ).execute()
                            : [];

                        // Create weight range conditions for SQL filtering
                        const weightRangeConditions =
                            weightThresholds.length > 0
                                ? weightThresholds.map((threshold) =>
                                    and(
                                        gte(
                                            weightRecords.weightKg,
                                            threshold.minWeight || "0",
                                        ),
                                        lte(
                                            weightRecords.weightKg,
                                            threshold.maxWeight || "999999",
                                        ),
                                    )
                                )
                                : [];

                        const where = advancedTable ? advancedWhere : and(
                            // Search by tag number or cattle number
                            input.search
                                ? ilike(cattle.tagNumber, `%${input.search}%`)
                                : undefined,
                            // Filter by gender
                            input.gender.length > 0
                                ? inArray(cattle.gender, input.gender)
                                : undefined,
                            // Filter by health status
                            cattleInfoFilter
                                ? and(...cattleInfoFilter)
                                : undefined,
                            healthStatusFilter ? healthStatusFilter : undefined,
                            // Filter by animal status
                            input.animalStatus.length > 0
                                ? inArray(animals.status, input.animalStatus)
                                : undefined,
                            // Filter by cattle class using weight ranges
                            weightRangeConditions.length > 0
                                ? or(...weightRangeConditions)
                                : undefined,
                            // Filter by creation date range
                            input.createdAt.length > 0
                                ? and(
                                    input.createdAt[0]
                                        ? gte(
                                            cattle.createdAt,
                                            (() => {
                                                const date = new Date(
                                                    input.createdAt[0],
                                                );
                                                date.setHours(0, 0, 0, 0);
                                                return date;
                                            })(),
                                        )
                                        : undefined,
                                    input.createdAt[1]
                                        ? lte(
                                            cattle.createdAt,
                                            (() => {
                                                const date = new Date(
                                                    input.createdAt[1],
                                                );
                                                date.setHours(23, 59, 59, 999);
                                                return date;
                                            })(),
                                        )
                                        : undefined,
                                )
                                : undefined,
                            input.purchasePrice.length > 0
                                ? and(
                                    gte(
                                        sql`${animalPurchases.purchasePrice} / (SELECT weight_kg FROM weight_records WHERE animal_id = ${animals.id} AND on_purchase = true LIMIT 1)`,
                                        input.purchasePrice[0].toString(),
                                    ),
                                    lte(
                                        sql`${animalPurchases.purchasePrice} / (SELECT weight_kg FROM weight_records WHERE animal_id = ${animals.id} AND on_purchase = true LIMIT 1)`,
                                        input.purchasePrice[1].toString(),
                                    ),
                                )
                                : undefined,
                            // Only show cattle (not other animal types)
                            eq(animals.animalType, "CATTLE"),
                            // Exclude soft-deleted records
                            sql`${animals.deletedAt} IS NULL`,
                            sql`${cattle.deletedAt} IS NULL`,
                        );
                        // Check if we need to sort by computed fields
                        const needsComputedSort = input.sort.length > 0 &&
                            [
                                "cattleClass",
                                "purchasePrice",
                                "totalPrice",
                                "purchaseDate",
                            ].includes(input.sort[0].id);

                        // Get cattle with basic animal and purchase data
                        const cattleDataQuery = tx
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
                            .leftJoin(
                                markets,
                                eq(markets.id, purchases.marketId),
                            )
                            .leftJoin(
                                weightRecords,
                                and(
                                    eq(weightRecords.animalId, animals.id),
                                    // Only join latest weight record per animal
                                    eq(
                                        weightRecords.recordedAt,
                                        sql`(SELECT MAX(recorded_at) FROM weight_records WHERE animal_id = ${animals.id})`,
                                    ),
                                ),
                            )
                            .where(where)
                            .orderBy(...orderBy);

                        // For computed fields, we need to fetch all data, sort, then paginate
                        // For simple fields, we can paginate at the SQL level for better performance
                        const cattleData = needsComputedSort
                            ? await cattleDataQuery
                            : await cattleDataQuery.limit(input.perPage).offset(
                                offset,
                            );

                        // Get animal IDs for related data queries
                        const animalIds = cattleData.map((item) =>
                            item.animal.id
                        );

                        // Get latest weight records for each animal
                        const allWeights = animalIds.length > 0
                            ? await tx
                                .select({
                                    animalId: weightRecords.animalId,
                                    weightKg: weightRecords.weightKg,
                                    recordedAt: weightRecords.recordedAt,
                                    onPurchase: weightRecords.onPurchase,
                                    onSale: weightRecords.onSale,
                                })
                                .from(weightRecords)
                                .where(
                                    inArray(weightRecords.animalId, animalIds),
                                )
                                .orderBy(desc(weightRecords.recordedAt))
                            : [];

                        // Get latest weight per animal
                        const latestWeights = animalIds.map((animalId) => {
                            return allWeights.find((weight) =>
                                weight.animalId === animalId
                            );
                        }).filter((
                            weight,
                        ): weight is NonNullable<typeof weight> =>
                            weight !== undefined
                        );

                        // Get purchase weights per animal
                        const purchaseWeights = animalIds.map((animalId) => {
                            return allWeights.find((weight) =>
                                weight.animalId === animalId &&
                                weight.onPurchase === true
                            );
                        }).filter((
                            weight,
                        ): weight is NonNullable<typeof weight> =>
                            weight !== undefined
                        );

                        // Get cattle class thresholds for classification
                        const thresholds = animalIds.length > 0
                            ? await tx
                                .select()
                                .from(cattleClassThresholds)
                                .where(eq(cattleClassThresholds.isActive, true))
                                .orderBy(asc(cattleClassThresholds.minWeightKg))
                            : [];
                        // Get sales data for each animal
                        const salesData = animalIds.length > 0
                            ? await tx
                                .select({
                                    animalId: saleAnimalLinks.animalId,
                                    sale: sales,
                                    linkCreatedAt: saleAnimalLinks.createdAt,
                                })
                                .from(saleAnimalLinks)
                                .innerJoin(
                                    sales,
                                    eq(sales.id, saleAnimalLinks.saleId),
                                )
                                .where(
                                    inArray(
                                        saleAnimalLinks.animalId,
                                        animalIds,
                                    ),
                                )
                                .orderBy(desc(saleAnimalLinks.createdAt))
                            : [];

                        // Combine all data
                        const data: CattleWithDetails[] = cattleData.map(
                            (item) => {
                                const latestWeight = latestWeights.find((w) =>
                                    w.animalId === item.animal.id
                                );
                                const purchaseWeight = purchaseWeights.find((
                                    w,
                                ) => w.animalId === item.animal.id);

                                // Calculate cattle class based on latest weight
                                const weightKg = latestWeight
                                    ? Number(latestWeight.weightKg)
                                    : 0;

                                const cattleClass = getCattleClassFromWeight(
                                    weightKg,
                                    thresholds,
                                );
                                const animalSales = salesData
                                    .filter((s) =>
                                        s.animalId === item.animal.id
                                    )
                                    .map((s) => ({
                                        sale: s.sale,
                                        linkCreatedAt: s.linkCreatedAt,
                                    }));

                                return {
                                    animal: item.animal,
                                    cattle: item.cattle,
                                    animalPurchase: item.animalPurchase,
                                    purchase: item.purchase,
                                    latestWeight: latestWeight
                                        ? {
                                            weightKg: latestWeight.weightKg,
                                            recordedAt: latestWeight.recordedAt,
                                        }
                                        : {
                                            weightKg: "",
                                            recordedAt: new Date(),
                                        },
                                    purchaseWeight: purchaseWeight
                                        ? {
                                            weightKg: purchaseWeight.weightKg,
                                            recordedAt:
                                                purchaseWeight.recordedAt,
                                        }
                                        : null,
                                    cattleClass,
                                    sales: animalSales,
                                    market: item.market,
                                };
                            },
                        );

                        // Apply post-processing sorting for computed fields
                        let finalData = data;
                        if (input.sort.length > 0 && needsComputedSort) {
                            const sortConfig = input.sort[0]; // Take the first sort configuration
                            switch (sortConfig.id) {
                                case "cattleClass":
                                    finalData = data.sort((a, b) => {
                                        const weightA =
                                            Number(a.latestWeight.weightKg) ||
                                            0;
                                        const weightB =
                                            Number(b.latestWeight.weightKg) ||
                                            0;
                                        return sortConfig.desc
                                            ? weightB - weightA
                                            : weightA - weightB;
                                    });
                                    break;
                                case "purchasePrice":
                                    finalData = data.sort((a, b) => {
                                        const priceA =
                                            a.animalPurchase && a.purchaseWeight
                                                ? Number(
                                                    a.animalPurchase
                                                        .purchasePrice,
                                                ) /
                                                    Number(
                                                        a.purchaseWeight
                                                            .weightKg,
                                                    )
                                                : 0;
                                        const priceB =
                                            b.animalPurchase && b.purchaseWeight
                                                ? Number(
                                                    b.animalPurchase
                                                        .purchasePrice,
                                                ) /
                                                    Number(
                                                        b.purchaseWeight
                                                            .weightKg,
                                                    )
                                                : 0;
                                        return sortConfig.desc
                                            ? priceB - priceA
                                            : priceA - priceB;
                                    });
                                    break;
                                case "totalPrice":
                                    finalData = data.sort((a, b) => {
                                        const totalA = a.animalPurchase
                                            ? Number(
                                                a.animalPurchase.purchasePrice,
                                            )
                                            : 0;
                                        const totalB = b.animalPurchase
                                            ? Number(
                                                b.animalPurchase.purchasePrice,
                                            )
                                            : 0;
                                        return sortConfig.desc
                                            ? totalB - totalA
                                            : totalA - totalB;
                                    });
                                    break;
                                case "purchaseDate":
                                    finalData = data.sort((a, b) => {
                                        const dateA = a.purchase?.purchaseDate
                                            ? new Date(a.purchase.purchaseDate)
                                                .getTime()
                                            : 0;
                                        const dateB = b.purchase?.purchaseDate
                                            ? new Date(b.purchase.purchaseDate)
                                                .getTime()
                                            : 0;
                                        return sortConfig.desc
                                            ? dateB - dateA
                                            : dateA - dateB;
                                    });
                                    break;
                                default:
                                    // For simple fields, sorting is already handled in the SQL query
                                    break;
                            }

                            // Apply pagination after sorting for computed fields
                            finalData = finalData.slice(
                                offset,
                                offset + input.perPage,
                            );
                        }

                        // Get total count
                        const total = await tx
                            .select({
                                count: count(),
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
                            .leftJoin(
                                markets,
                                eq(markets.id, purchases.marketId),
                            )
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
                            .where(where)
                            .execute()
                            .then((res) => res[0]?.count ?? 0);

                        return {
                            data: finalData,
                            total,
                        };
                    },
                );

                const pageCount = Math.ceil(total / input.perPage);
                return { data: finalSortedData, pageCount, total };
            } catch (_err) {
                // eslint-disable-next-line no-console
                console.error("Error fetching cattle data:", _err);
                return { data: [], pageCount: 0, total: 0 };
            }
        },
        [JSON.stringify(input)],
        {
            revalidate: 60, // Cache for 1 minute
            tags: ["cattle", "animals", "purchases", "weights", "sales"],
        },
    )();
}

function getCattleClassFromWeight(
    weightKg: number,
    thresholds: typeof cattleClassThresholds.$inferSelect[],
): "SILVER" | "GOLD" | "PLATINUM" {
    for (const threshold of thresholds.reverse()) {
        if (
            weightKg >= Number(threshold.minWeightKg) &&
            weightKg <= Number(threshold.maxWeightKg)
        ) {
            return threshold.className as "SILVER" | "GOLD" | "PLATINUM";
        }
    }
    return "SILVER"; // Default
}
