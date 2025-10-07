/**
 * Column mapping configuration
 * Maps column keys to their source tables for cross-table filtering
 */

import type { AnyColumn, Table } from "drizzle-orm";

/**
 * Typed structure for additional tables that can be joined in queries
 */
export interface AdditionalTables {
    cattle?: Table & {
        healthStatus: AnyColumn;
        isLactating: AnyColumn;
        isPregnant: AnyColumn;
        isQuarantined: AnyColumn;
    };
    weightRecords?: Table & {
        weightKg: AnyColumn;
        animalId: AnyColumn;
    };
    purchases?: Table;
    animalPurchases?: Table;
    sales?: Table;
    animals?: Table & {
        status: AnyColumn;
    };
    markets?: Table;
    cattleClassThresholds?: Table;
}

/**
 * Maps column keys to the table they belong to
 * This allows cross-table column resolution in filter operations
 */
export const COLUMN_TABLE_MAP: Record<string, string> = {
    // Purchase-related columns
    purchaseDate: "purchases",
    purchasePrice: "animalPurchases",
    totalTransportCost: "purchases",
    vendorId: "purchases",
    marketId: "purchases",

    // Sale-related columns
    saleDate: "sales",
    invoiceNumber: "sales",
    totalAmount: "sales",

    // Cattle boolean fields
    isLactating: "cattle",
    isPregnant: "cattle",
    isQuarantined: "cattle",

    // Animal status
    animalStatus: "animals",
    status: "animals",
} as const;

/**
 * Resolves a column from the primary table or additional tables
 * @throws Error if column is not found in any table
 */
export function getColumnFromTables<T extends Table>(
    primaryTable: T,
    columnKey: string,
    additionalTables?: AdditionalTables,
): AnyColumn {
    // Check if this column should come from a different table
    const targetTableName = COLUMN_TABLE_MAP[columnKey];

    if (targetTableName && additionalTables) {
        const targetTable =
            additionalTables[targetTableName as keyof AdditionalTables];
        if (targetTable && columnKey in targetTable) {
            return targetTable[
                columnKey as keyof typeof targetTable
            ] as AnyColumn;
        }
    }

    // Default to primary table
    if (columnKey in primaryTable) {
        return primaryTable[columnKey as keyof T] as AnyColumn;
    }

    // Column not found - throw descriptive error
    throw new Error(
        `Column '${columnKey}' not found in primary table${
            targetTableName ? ` or additional table '${targetTableName}'` : ""
        }. Available additional tables: ${
            additionalTables ? Object.keys(additionalTables).join(", ") : "none"
        }`,
    );
}

/**
 * Simple column getter for primary table only
 */
export function getColumn<T extends Table>(
    table: T,
    columnKey: keyof T,
): AnyColumn {
    return table[columnKey] as AnyColumn;
}
