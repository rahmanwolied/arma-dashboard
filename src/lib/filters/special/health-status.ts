/**
 * Health Status Filter Handler
 * Handles the special case where healthStatus combines multiple database fields
 */

import { eq, inArray, or, type SQL } from "drizzle-orm";
import type { AdditionalTables } from "../column-map";
import { validateEnumArray } from "../utils";

/**
 * Valid health status values that can be filtered
 */
export const HEALTH_STATUS_VALUES = [
    "HEALTHY",
    "MINOR_ISSUE",
    "SICK",
    "CRITICAL",
    "LACTATING",
    "NOT_LACTATING",
    "PREGNANT",
    "NOT_PREGNANT",
    "QUARANTINED",
    "NOT_QUARANTINED",
] as const;

export type HealthStatusValue = typeof HEALTH_STATUS_VALUES[number];

/**
 * Builds SQL conditions for health status filter
 * Combines healthStatus enum field with boolean fields (isLactating, isPregnant, isQuarantined)
 */
export function buildHealthStatusFilter(
    values: unknown[],
    additionalTables?: AdditionalTables,
): SQL | undefined {
    if (!additionalTables?.cattle) {
        throw new Error(
            "Health status filtering requires 'cattle' table in additionalTables",
        );
    }

    const cattle = additionalTables.cattle;
    const validValues = validateEnumArray(values, HEALTH_STATUS_VALUES);

    if (validValues.length === 0) {
        return undefined;
    }

    const healthStatusValues: string[] = [];
    const booleanConditions: SQL[] = [];

    // Separate enum values from boolean field conditions
    for (const value of validValues) {
        switch (value) {
            case "HEALTHY":
            case "MINOR_ISSUE":
            case "SICK":
            case "CRITICAL":
                healthStatusValues.push(value);
                break;
            case "LACTATING":
                booleanConditions.push(eq(cattle.isLactating, true));
                break;
            case "NOT_LACTATING":
                booleanConditions.push(eq(cattle.isLactating, false));
                break;
            case "PREGNANT":
                booleanConditions.push(eq(cattle.isPregnant, true));
                break;
            case "NOT_PREGNANT":
                booleanConditions.push(eq(cattle.isPregnant, false));
                break;
            case "QUARANTINED":
                booleanConditions.push(eq(cattle.isQuarantined, true));
                break;
            case "NOT_QUARANTINED":
                booleanConditions.push(eq(cattle.isQuarantined, false));
                break;
        }
    }

    const conditions: SQL[] = [];

    // Add health status enum condition if we have any
    if (healthStatusValues.length > 0) {
        conditions.push(inArray(cattle.healthStatus, healthStatusValues));
    }

    // Add boolean conditions
    if (booleanConditions.length > 0) {
        conditions.push(...booleanConditions);
    }

    // Combine with OR since a cattle can match any of the selected statuses
    return conditions.length > 0 ? or(...conditions) : undefined;
}
