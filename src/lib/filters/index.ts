/**
 * Filter Columns - Main Entry Point
 * Builds Drizzle SQL conditions from typed table filters with pluggable operator handlers
 */

import { and, or, type SQL, type Table } from "drizzle-orm";
import type { ExtendedColumnFilter, JoinOperator } from "@/types/data-table";
import type { AdditionalTables } from "./column-map";
import { getColumnFromTables } from "./column-map";
import { OPERATOR_REGISTRY } from "./operators";
import type { CattleClassThreshold } from "./special/cattle-class";
import {
    buildCattleClassExcludeFilter,
    buildCattleClassIncludeFilter,
} from "./special/cattle-class";
import { buildHealthStatusFilter } from "./special/health-status";

/**
 * Special case handler type
 */
type SpecialCaseHandler = (
    filter: ExtendedColumnFilter<Table>,
    additionalTables?: AdditionalTables,
    cattleClassThresholds?: CattleClassThreshold[],
) => SQL | undefined;

/**
 * Registry of special case handlers
 * Key format: "fieldId:operator"
 */
const SPECIAL_CASE_REGISTRY: Record<string, SpecialCaseHandler> = {
    "healthStatus:inArray": (filter, additionalTables) => {
        if (!Array.isArray(filter.value)) return undefined;
        return buildHealthStatusFilter(filter.value, additionalTables);
    },

    "cattleClass:inArray": (filter, additionalTables, thresholds) => {
        if (!Array.isArray(filter.value)) return undefined;
        return buildCattleClassIncludeFilter(
            filter.value,
            additionalTables,
            thresholds,
        );
    },

    "cattleClass:notInArray": (filter, additionalTables, thresholds) => {
        if (!Array.isArray(filter.value)) return undefined;
        return buildCattleClassExcludeFilter(
            filter.value,
            additionalTables,
            thresholds,
        );
    },
};

/**
 * Checks if a filter has a special case handler
 */
function hasSpecialCaseHandler<T extends Table>(
    filter: ExtendedColumnFilter<T>,
): boolean {
    const key = `${filter.id}:${filter.operator}`;
    return key in SPECIAL_CASE_REGISTRY;
}

/**
 * Applies a special case handler if one exists
 */
function applySpecialCaseHandler<T extends Table>(
    filter: ExtendedColumnFilter<T>,
    additionalTables?: AdditionalTables,
    cattleClassThresholds?: CattleClassThreshold[],
): SQL | undefined {
    const key = `${filter.id}:${filter.operator}`;
    const handler = SPECIAL_CASE_REGISTRY[key];

    if (!handler) {
        return undefined;
    }

    try {
        return handler(
            filter as ExtendedColumnFilter<Table>,
            additionalTables,
            cattleClassThresholds,
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(
            `Special case handler failed for '${filter.id}' with operator '${filter.operator}': ${message}`,
        );
    }
}

/**
 * Applies a standard operator handler
 */
function applyOperatorHandler<T extends Table>(
    filter: ExtendedColumnFilter<T>,
    table: T,
    additionalTables?: AdditionalTables,
): SQL | undefined {
    const handler = OPERATOR_REGISTRY[filter.operator];

    if (!handler) {
        throw new Error(
            `Unsupported operator '${filter.operator}' for filter '${filter.id}' with variant '${filter.variant}'`,
        );
    }

    try {
        const column = getColumnFromTables(table, filter.id, additionalTables);
        return handler({
            column,
            value: filter.value,
            variant: filter.variant,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(
            `Operator handler failed for '${filter.id}' with operator '${filter.operator}': ${message}`,
        );
    }
}

/**
 * Builds SQL WHERE conditions from an array of column filters
 *
 * @param params - Filter parameters
 * @param params.table - Primary table to filter
 * @param params.filters - Array of column filters to apply
 * @param params.joinOperator - How to combine filters ("and" or "or")
 * @param params.additionalTables - Optional additional tables for cross-table filtering
 * @param params.cattleClassThresholds - Optional cattle class thresholds for weight-based filtering
 * @returns Combined SQL condition or undefined if no valid filters
 */
export function filterColumns<T extends Table>({
    table,
    filters,
    joinOperator,
    additionalTables,
    cattleClassThresholds,
}: {
    table: T;
    filters: ExtendedColumnFilter<T>[];
    joinOperator: JoinOperator;
    additionalTables?: AdditionalTables;
    cattleClassThresholds?: CattleClassThreshold[];
}): SQL | undefined {
    // Determine join function based on operator
    const joinFn = joinOperator === "and" ? and : or;

    // Process each filter
    const conditions = filters.map((filter) => {
        // Check for special case handlers first
        if (hasSpecialCaseHandler(filter)) {
            return applySpecialCaseHandler(
                filter,
                additionalTables,
                cattleClassThresholds,
            );
        }

        // Apply standard operator handler
        return applyOperatorHandler(filter, table, additionalTables);
    });

    // Filter out undefined conditions
    const validConditions = conditions.filter(
        (condition): condition is SQL => condition !== undefined,
    );

    // Return combined condition or undefined
    return validConditions.length > 0 ? joinFn(...validConditions) : undefined;
}

/**
 * Re-export types and utilities for convenience
 */
export type { AdditionalTables, CattleClassThreshold };
export { getColumn, getColumnFromTables } from "./column-map";
export { OPERATOR_REGISTRY } from "./operators";
export {
    buildCattleClassExcludeFilter,
    buildCattleClassIncludeFilter,
    buildHealthStatusFilter,
    DEFAULT_CATTLE_CLASS_THRESHOLDS,
} from "./special";
