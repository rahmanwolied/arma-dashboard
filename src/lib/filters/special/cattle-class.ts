/**
 * Cattle Class Filter Handler
 * Handles filtering by cattle class which is computed from weight thresholds
 */

import { and, or, type SQL, sql } from "drizzle-orm";
import type { AdditionalTables } from "../column-map";
import { validateStringArray } from "../utils";

/**
 * Cattle class threshold definition
 * Note: minWeightKg can be null in the database type but we provide a default of "0"
 */
export interface CattleClassThreshold {
    className: string;
    minWeightKg: string | null;
    maxWeightKg: string | null;
}

/**
 * Default cattle class thresholds (fallback if none provided)
 * These match the historical hardcoded values
 */
export const DEFAULT_CATTLE_CLASS_THRESHOLDS: CattleClassThreshold[] = [
    { className: "SILVER", minWeightKg: "0", maxWeightKg: "299" },
    { className: "GOLD", minWeightKg: "300", maxWeightKg: "399" },
    { className: "PLATINUM", minWeightKg: "400", maxWeightKg: null },
];

/**
 * Finds a threshold for a given class name
 */
function getThresholdForClass(
    className: string,
    thresholds: CattleClassThreshold[],
): CattleClassThreshold | null {
    return thresholds.find((t) => t.className === className) ?? null;
}

/**
 * Builds a weight range condition for a single threshold
 */
function buildWeightRangeCondition(
    weightColumn: unknown,
    threshold: CattleClassThreshold,
): SQL {
    // Use "0" as default if minWeightKg is null
    const minWeight = threshold.minWeightKg ?? "0";

    if (threshold.maxWeightKg !== null) {
        // Has both min and max weight: min <= weight <= max
        return sql`${weightColumn} >= ${minWeight} AND ${weightColumn} <= ${threshold.maxWeightKg}`;
    }
    // Only has min weight (open-ended range): weight >= min
    return sql`${weightColumn} >= ${minWeight}`;
}

/**
 * Builds a negated weight range condition for a single threshold
 */
function buildNegatedWeightRangeCondition(
    weightColumn: unknown,
    threshold: CattleClassThreshold,
): SQL {
    // Use "0" as default if minWeightKg is null
    const minWeight = threshold.minWeightKg ?? "0";

    if (threshold.maxWeightKg !== null) {
        // NOT (min <= weight <= max)
        return sql`NOT (${weightColumn} >= ${minWeight} AND ${weightColumn} <= ${threshold.maxWeightKg})`;
    }
    // NOT (weight >= min) = weight < min
    return sql`NOT (${weightColumn} >= ${minWeight})`;
}

/**
 * Builds SQL conditions for cattle class filter (include mode)
 * Matches cattle whose weight falls into any of the selected class ranges
 */
export function buildCattleClassIncludeFilter(
    values: unknown[],
    additionalTables?: AdditionalTables,
    thresholds?: CattleClassThreshold[],
): SQL | undefined {
    if (!additionalTables?.weightRecords) {
        throw new Error(
            "Cattle class filtering requires 'weightRecords' table in additionalTables",
        );
    }

    const weightRecords = additionalTables.weightRecords;
    const validValues = validateStringArray(values);

    if (validValues.length === 0) {
        return undefined;
    }

    // Use provided thresholds or fall back to defaults
    const effectiveThresholds = thresholds ?? DEFAULT_CATTLE_CLASS_THRESHOLDS;

    // Build weight range conditions for each selected class
    const weightConditions: SQL[] = [];

    for (const className of validValues) {
        const threshold = getThresholdForClass(className, effectiveThresholds);
        if (threshold) {
            weightConditions.push(
                buildWeightRangeCondition(weightRecords.weightKg, threshold),
            );
        }
    }

    // Combine with OR: cattle matches if weight is in ANY of the selected ranges
    return weightConditions.length > 0 ? or(...weightConditions) : undefined;
}

/**
 * Builds SQL conditions for cattle class filter (exclude mode)
 * Matches cattle whose weight does NOT fall into any of the selected class ranges
 */
export function buildCattleClassExcludeFilter(
    values: unknown[],
    additionalTables?: AdditionalTables,
    thresholds?: CattleClassThreshold[],
): SQL | undefined {
    if (!additionalTables?.weightRecords) {
        throw new Error(
            "Cattle class filtering requires 'weightRecords' table in additionalTables",
        );
    }

    const weightRecords = additionalTables.weightRecords;
    const validValues = validateStringArray(values);

    if (validValues.length === 0) {
        return undefined;
    }

    // Use provided thresholds or fall back to defaults
    const effectiveThresholds = thresholds ?? DEFAULT_CATTLE_CLASS_THRESHOLDS;

    // Build negated weight range conditions for each selected class
    const weightConditions: SQL[] = [];

    for (const className of validValues) {
        const threshold = getThresholdForClass(className, effectiveThresholds);
        if (threshold) {
            weightConditions.push(
                buildNegatedWeightRangeCondition(
                    weightRecords.weightKg,
                    threshold,
                ),
            );
        }
    }

    // Combine with AND: cattle matches if weight is NOT in ALL of the selected ranges
    return weightConditions.length > 0 ? and(...weightConditions) : undefined;
}
