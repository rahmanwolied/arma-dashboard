/**
 * CattleDataProcessor - Handles data processing and transformation for cattle queries
 */

import { CATTLE_QUERY_CONFIG } from "@/config/cattle-query";
import type {
    CattleThreshold,
    CattleWithDetails,
    ICattleDataProcessor,
    ProcessedWeights,
    RawCattleData,
    RelatedData,
    SaleRecord,
    WeightRecord,
} from "@/types/cattle-query";
import type { CattleClass } from "@/config/cattle-query";
import type { sales } from "@/db/schema";

export class CattleDataProcessor implements ICattleDataProcessor {
    /**
     * Maps raw database data to CattleWithDetails objects
     */
    mapRawDataToCattleWithDetails(
        rawData: RawCattleData[],
        relatedData: RelatedData,
    ): CattleWithDetails[] {
        return rawData.map((item) => {
            const animalId = item.animal.id;

            // Process weight data for this animal
            const weights = this.processWeightData(
                relatedData.weights,
                animalId,
            );

            // Process sales data for this animal
            const sales = this.processSalesData(relatedData.sales, animalId);

            // Calculate cattle class based on latest weight
            const weightKg = weights.latest
                ? Number(weights.latest.weightKg)
                : 0;
            const cattleClass = this.calculateCattleClass(
                weightKg,
                relatedData.thresholds,
            );

            return {
                animal: item.animal,
                cattle: item.cattle,
                animalPurchase: item.animalPurchase,
                purchase: item.purchase,
                market: item.market,
                latestWeight: weights.latest || {
                    weightKg: CATTLE_QUERY_CONFIG.DEFAULT_WEIGHT,
                    recordedAt: new Date(),
                },
                purchaseWeight: weights.purchase,
                sales,
                cattleClass,
            };
        });
    }

    /**
     * Calculates cattle class based on weight and thresholds
     */
    calculateCattleClass(
        weightKg: number,
        thresholds: CattleThreshold[],
    ): CattleClass {
        // Sort thresholds by minimum weight in descending order to check from highest to lowest
        const sortedThresholds = [...thresholds].sort((a, b) => {
            const minA = Number(a.minWeightKg) || 0;
            const minB = Number(b.minWeightKg) || 0;
            return minB - minA;
        });

        for (const threshold of sortedThresholds) {
            const minWeight = Number(threshold.minWeightKg) || 0;
            const maxWeight = Number(threshold.maxWeightKg) ||
                Number.MAX_SAFE_INTEGER;

            if (weightKg >= minWeight && weightKg <= maxWeight) {
                return threshold.className as CattleClass;
            }
        }

        return CATTLE_QUERY_CONFIG.DEFAULT_CATTLE_CLASS;
    }

    /**
     * Processes weight data for a specific animal
     */
    processWeightData(
        weights: WeightRecord[],
        animalId: string,
    ): ProcessedWeights {
        const animalWeights = weights.filter((weight) =>
            weight.animalId === animalId
        );

        if (animalWeights.length === 0) {
            return { latest: null, purchase: null };
        }

        // Sort by recorded date descending to get latest first
        const sortedWeights = animalWeights.sort((a, b) =>
            new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
        );

        // Get latest weight (first in sorted array)
        const latest = sortedWeights[0]
            ? {
                weightKg: sortedWeights[0].weightKg,
                recordedAt: sortedWeights[0].recordedAt,
            }
            : null;

        // Get purchase weight (weight marked as onPurchase)
        const purchaseWeight = animalWeights.find((weight) =>
            weight.onPurchase
        );
        const purchase = purchaseWeight
            ? {
                weightKg: purchaseWeight.weightKg,
                recordedAt: purchaseWeight.recordedAt,
            }
            : null;

        return { latest, purchase };
    }

    /**
     * Processes sales data for a specific animal
     */
    processSalesData(
        sales: SaleRecord[],
        animalId: string,
    ): Array<{ sale: typeof sales.$inferSelect; linkCreatedAt: Date }> {
        return sales
            .filter((sale) => sale.animalId === animalId)
            .map((sale) => ({
                sale: sale.sale,
                linkCreatedAt: sale.linkCreatedAt,
            }))
            .sort((a, b) =>
                new Date(b.linkCreatedAt).getTime() -
                new Date(a.linkCreatedAt).getTime()
            );
    }

    /**
     * Validates weight data consistency
     */
    validateWeightData(
        weights: WeightRecord[],
    ): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        for (const weight of weights) {
            const weightValue = Number(weight.weightKg);

            if (Number.isNaN(weightValue) || weightValue < 0) {
                errors.push(
                    `Invalid weight value: ${weight.weightKg} for animal ${weight.animalId}`,
                );
            }

            if (weightValue > 2000) { // Reasonable upper limit for cattle weight
                errors.push(
                    `Unrealistic weight value: ${weight.weightKg}kg for animal ${weight.animalId}`,
                );
            }

            if (
                !weight.recordedAt ||
                Number.isNaN(new Date(weight.recordedAt).getTime())
            ) {
                errors.push(
                    `Invalid recorded date for weight record of animal ${weight.animalId}`,
                );
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Validates cattle class thresholds
     */
    validateThresholds(
        thresholds: CattleThreshold[],
    ): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        for (const threshold of thresholds) {
            const minWeight = Number(threshold.minWeightKg);
            const maxWeight = Number(threshold.maxWeightKg);

            if (
                threshold.minWeightKg &&
                (Number.isNaN(minWeight) || minWeight < 0)
            ) {
                errors.push(
                    `Invalid minimum weight for ${threshold.className}: ${threshold.minWeightKg}`,
                );
            }

            if (
                threshold.maxWeightKg &&
                (Number.isNaN(maxWeight) || maxWeight < 0)
            ) {
                errors.push(
                    `Invalid maximum weight for ${threshold.className}: ${threshold.maxWeightKg}`,
                );
            }

            if (
                threshold.minWeightKg && threshold.maxWeightKg &&
                minWeight > maxWeight
            ) {
                errors.push(
                    `Minimum weight exceeds maximum weight for ${threshold.className}`,
                );
            }

            if (!["SILVER", "GOLD", "PLATINUM"].includes(threshold.className)) {
                errors.push(`Invalid cattle class: ${threshold.className}`);
            }
        }

        // Check for overlapping thresholds
        const sortedThresholds = [...thresholds].sort((a, b) => {
            const minA = Number(a.minWeightKg) || 0;
            const minB = Number(b.minWeightKg) || 0;
            return minA - minB;
        });

        for (let i = 0; i < sortedThresholds.length - 1; i++) {
            const current = sortedThresholds[i];
            const next = sortedThresholds[i + 1];

            const currentMax = Number(current.maxWeightKg) ||
                Number.MAX_SAFE_INTEGER;
            const nextMin = Number(next.minWeightKg) || 0;

            if (currentMax >= nextMin) {
                errors.push(
                    `Overlapping thresholds between ${current.className} and ${next.className}`,
                );
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Calculates statistics for processed cattle data
     */
    calculateStatistics(data: CattleWithDetails[]): {
        totalCount: number;
        averageWeight: number;
        classCounts: Record<CattleClass, number>;
        healthStatusCounts: Record<string, number>;
    } {
        const classCounts: Record<CattleClass, number> = {
            SILVER: 0,
            GOLD: 0,
            PLATINUM: 0,
        };

        const healthStatusCounts: Record<string, number> = {};
        let totalWeight = 0;
        let validWeightCount = 0;

        for (const cattle of data) {
            // Count cattle classes
            classCounts[cattle.cattleClass]++;

            // Count health statuses
            const healthStatus = cattle.cattle.healthStatus;
            healthStatusCounts[healthStatus] =
                (healthStatusCounts[healthStatus] || 0) + 1;

            // Calculate average weight
            const weight = Number(cattle.latestWeight.weightKg);
            if (!Number.isNaN(weight) && weight > 0) {
                totalWeight += weight;
                validWeightCount++;
            }
        }

        return {
            totalCount: data.length,
            averageWeight: validWeightCount > 0
                ? totalWeight / validWeightCount
                : 0,
            classCounts,
            healthStatusCounts,
        };
    }

    /**
     * Filters cattle data by weight range
     */
    filterByWeightRange(
        data: CattleWithDetails[],
        minWeight?: number,
        maxWeight?: number,
    ): CattleWithDetails[] {
        return data.filter((cattle) => {
            const weight = Number(cattle.latestWeight.weightKg);

            if (Number.isNaN(weight)) return false;

            if (minWeight !== undefined && weight < minWeight) return false;
            if (maxWeight !== undefined && weight > maxWeight) return false;

            return true;
        });
    }

    /**
     * Groups cattle data by a specified field
     */
    groupBy<K extends keyof CattleWithDetails>(
        data: CattleWithDetails[],
        field: K,
    ): Record<string, CattleWithDetails[]> {
        const groups: Record<string, CattleWithDetails[]> = {};

        for (const cattle of data) {
            const value = String(cattle[field]);
            if (!groups[value]) {
                groups[value] = [];
            }
            groups[value].push(cattle);
        }

        return groups;
    }
}
