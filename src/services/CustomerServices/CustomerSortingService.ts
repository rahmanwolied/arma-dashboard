/**
 * CustomerSortingService - Handles all sorting logic for customer queries
 * Uses Drizzle ORM methods exclusively
 */

import { asc, desc, type SQL } from "drizzle-orm";
import { customers } from "@/db/schema";
import type { GetCustomersSchema } from "@/app/_lib/validations";

export interface SortConfig {
    id: string;
    desc: boolean;
}

export interface ICustomerSortingService {
    needsComputedSort(sortConfig: SortConfig[]): boolean;
    getSQLOrderBy(sortConfig: SortConfig[]): SQL[];
    validateSortConfig(
        sortConfig: SortConfig[],
    ): { isValid: boolean; errors: string[] };
}

const SIMPLE_SORTABLE_FIELDS = [
    "name",
    "primaryPhone",
    "email",
    "createdAt",
    "updatedAt",
] as const;

export class CustomerSortingService implements ICustomerSortingService {
    /**
     * Determines if sorting requires post-processing (computed fields)
     * For customers, all sorting can be done at SQL level
     */
    needsComputedSort(_sortConfig: SortConfig[]): boolean {
        return false; // All customer fields can be sorted at SQL level
    }

    /**
     * Gets SQL ORDER BY clauses for customer fields
     */
    getSQLOrderBy(sortConfig: SortConfig[]): SQL[] {
        if (sortConfig.length === 0) {
            return [desc(customers.createdAt)]; // Default sort by creation date
        }

        return sortConfig.map((sort) => {
            switch (sort.id) {
                case "name":
                    return sort.desc
                        ? desc(customers.name)
                        : asc(customers.name);

                case "primaryPhone":
                    return sort.desc
                        ? desc(customers.primaryPhone)
                        : asc(customers.primaryPhone);

                case "email":
                    return sort.desc
                        ? desc(customers.email)
                        : asc(customers.email);

                case "createdAt":
                    return sort.desc
                        ? desc(customers.createdAt)
                        : asc(customers.createdAt);

                case "updatedAt":
                    return sort.desc
                        ? desc(customers.updatedAt)
                        : asc(customers.updatedAt);

                // Default to createdAt for unknown fields
                default:
                    return sort.desc
                        ? desc(customers.createdAt)
                        : asc(customers.createdAt);
            }
        });
    }

    /**
     * Validates sort configuration
     */
    validateSortConfig(
        sortConfig: SortConfig[],
    ): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        for (const sort of sortConfig) {
            if (
                !(SIMPLE_SORTABLE_FIELDS as readonly string[]).includes(sort.id)
            ) {
                errors.push(`Invalid sort field: ${sort.id}`);
            }

            if (typeof sort.desc !== "boolean") {
                errors.push(
                    `Sort direction must be boolean for field: ${sort.id}`,
                );
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Gets default sort configuration
     */
    getDefaultSort(): SortConfig[] {
        return [{ id: "createdAt", desc: true }];
    }

    /**
     * Checks if a field can be sorted at SQL level
     */
    canSortAtSQLLevel(fieldId: string): boolean {
        return (SIMPLE_SORTABLE_FIELDS as readonly string[]).includes(fieldId);
    }
}



