/**
 * Filter Columns - Backwards Compatibility Layer
 *
 * This module re-exports the refactored filter functionality while maintaining
 * backwards compatibility with existing code that imports from this location.
 *
 * The actual implementation has been moved to src/lib/filters/ for better organization.
 */

import type { Table } from "drizzle-orm";
import type { ExtendedColumnFilter, JoinOperator } from "@/types/data-table";
import {
  type AdditionalTables,
  type CattleClassThreshold,
  filterColumns as filterColumnsNew,
  getColumn as getColumnNew,
  getColumnFromTables as getColumnFromTablesNew,
} from "./filters";

/**
 * Legacy interface for backwards compatibility
 * Converts old additionalTables format to new typed format
 */
function convertAdditionalTables(
  tables?: Record<string, Table>,
): AdditionalTables | undefined {
  if (!tables) return undefined;

  // Pass through as-is - the new implementation handles both formats
  return tables as unknown as AdditionalTables;
}

/**
 * Builds SQL WHERE conditions from an array of column filters
 *
 * @deprecated Import from '@/lib/filters' instead
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
  additionalTables?: Record<string, Table>;
  cattleClassThresholds?: Array<{
    className: string;
    minWeightKg: string;
    maxWeightKg: string | null;
  }>;
}) {
  return filterColumnsNew({
    table,
    filters,
    joinOperator,
    additionalTables: convertAdditionalTables(additionalTables),
    cattleClassThresholds: cattleClassThresholds as CattleClassThreshold[],
  });
}

/**
 * Gets a column from a table by key
 *
 * @deprecated Import from '@/lib/filters' instead
 */
export const getColumn = getColumnNew;

/**
 * Gets a column from multiple tables with fallback logic
 *
 * @deprecated Import from '@/lib/filters' instead
 */
export function getColumnFromTables<T extends Table>(
  primaryTable: T,
  columnKey: string,
  additionalTables?: Record<string, Table>,
) {
  return getColumnFromTablesNew(
    primaryTable,
    columnKey,
    convertAdditionalTables(additionalTables),
  );
}

// Re-export types for convenience
export type { AdditionalTables, CattleClassThreshold };
