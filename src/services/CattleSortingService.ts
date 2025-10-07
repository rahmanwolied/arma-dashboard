/**
 * CattleSortingService - Handles all sorting logic for cattle queries
 * Uses Drizzle ORM methods exclusively
 */

import { asc, desc, type SQL } from "drizzle-orm";
import { animals, cattle } from "@/db/schema";
import { CATTLE_QUERY_CONFIG } from "@/config/cattle-query";
import type {
    CattleWithDetails,
    ICattleSortingService,
    SortConfig,
} from "@/types/cattle-query";

export class CattleSortingService implements ICattleSortingService {
    /**
     * Determines if sorting requires post-processing (computed fields)
     */
    needsComputedSort(sortConfig: SortConfig[]): boolean {
        if (sortConfig.length === 0) return false;
        const computed = CATTLE_QUERY_CONFIG.SORTABLE_FIELDS
            .COMPUTED as readonly (
                | keyof CattleWithDetails
                | "purchasePrice"
                | "totalPrice"
                | "purchaseDate"
                | "cattleClass"
            )[];
        return (computed as readonly string[]).includes(sortConfig[0].id);
    }

    /**
     * Gets SQL ORDER BY clauses for simple fields that can be sorted at database level
     */
    getSQLOrderBy(sortConfig: SortConfig[]): SQL[] {
        if (sortConfig.length === 0) {
            return [asc(cattle.tagNumber)]; // Default sort
        }

        return sortConfig.map((sort) => {
            switch (sort.id) {
                case "tagNumber":
                    return sort.desc
                        ? desc(cattle.tagNumber)
                        : asc(cattle.tagNumber);

                case "gender":
                    return sort.desc ? desc(cattle.gender) : asc(cattle.gender);

                case "healthStatus":
                    return sort.desc
                        ? desc(cattle.healthStatus)
                        : asc(cattle.healthStatus);

                case "createdAt":
                    return sort.desc
                        ? desc(cattle.createdAt)
                        : asc(cattle.createdAt);

                case "animalStatus":
                    return sort.desc
                        ? desc(animals.status)
                        : asc(animals.status);

                // For computed fields, fall back to createdAt
                default:
                    return sort.desc
                        ? desc(cattle.createdAt)
                        : asc(cattle.createdAt);
            }
        });
    }

    /**
     * Applies post-processing sorting for computed fields
     */
    applySorting(
        data: CattleWithDetails[],
        sortConfig: SortConfig[],
    ): CattleWithDetails[] {
        if (sortConfig.length === 0 || !this.needsComputedSort(sortConfig)) {
            return data;
        }

        const primarySort = sortConfig[0];

        switch (primarySort.id) {
            case "cattleClass":
                return this.sortByCattleClass(data, primarySort.desc);

            case "purchasePrice":
                return this.sortByPurchasePrice(data, primarySort.desc);

            case "totalPrice":
                return this.sortByTotalPrice(data, primarySort.desc);

            case "purchaseDate":
                return this.sortByPurchaseDate(data, primarySort.desc);

            default:
                return data;
        }
    }

    /**
     * Sorts by cattle class (based on weight)
     */
    sortByCattleClass(
        data: CattleWithDetails[],
        desc: boolean,
    ): CattleWithDetails[] {
        return [...data].sort((a, b) => {
            const weightA = Number(a.latestWeight.weightKg) || 0;
            const weightB = Number(b.latestWeight.weightKg) || 0;

            return desc ? weightB - weightA : weightA - weightB;
        });
    }

    /**
     * Sorts by purchase price per kg
     */
    sortByPurchasePrice(
        data: CattleWithDetails[],
        desc: boolean,
    ): CattleWithDetails[] {
        return [...data].sort((a, b) => {
            const priceA = this.calculatePurchasePricePerKg(a);
            const priceB = this.calculatePurchasePricePerKg(b);

            return desc ? priceB - priceA : priceA - priceB;
        });
    }

    /**
     * Sorts by total purchase price
     */
    sortByTotalPrice(
        data: CattleWithDetails[],
        desc: boolean,
    ): CattleWithDetails[] {
        return [...data].sort((a, b) => {
            const totalA = a.animalPurchase
                ? Number(a.animalPurchase.purchasePrice)
                : 0;
            const totalB = b.animalPurchase
                ? Number(b.animalPurchase.purchasePrice)
                : 0;

            return desc ? totalB - totalA : totalA - totalB;
        });
    }

    /**
     * Sorts by purchase date
     */
    sortByPurchaseDate(
        data: CattleWithDetails[],
        desc: boolean,
    ): CattleWithDetails[] {
        return [...data].sort((a, b) => {
            const dateA = a.purchase?.purchaseDate
                ? new Date(a.purchase.purchaseDate).getTime()
                : 0;
            const dateB = b.purchase?.purchaseDate
                ? new Date(b.purchase.purchaseDate).getTime()
                : 0;

            return desc ? dateB - dateA : dateA - dateB;
        });
    }

    /**
     * Calculates purchase price per kg for a cattle record
     */
    private calculatePurchasePricePerKg(cattle: CattleWithDetails): number {
        if (!cattle.animalPurchase || !cattle.purchaseWeight) {
            return 0;
        }

        const totalPrice = Number(cattle.animalPurchase.purchasePrice);
        const weight = Number(cattle.purchaseWeight.weightKg);

        if (weight === 0) return 0;

        return totalPrice / weight;
    }

    /**
     * Validates sort configuration
     */
    validateSortConfig(
        sortConfig: SortConfig[],
    ): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        const allSortableFields = [
            ...(
                CATTLE_QUERY_CONFIG.SORTABLE_FIELDS.SIMPLE as readonly (
                    | "tagNumber"
                    | "gender"
                    | "healthStatus"
                    | "createdAt"
                    | "animalStatus"
                )[]
            ),
            ...(
                CATTLE_QUERY_CONFIG.SORTABLE_FIELDS.COMPUTED as readonly (
                    | "cattleClass"
                    | "purchasePrice"
                    | "totalPrice"
                    | "purchaseDate"
                )[]
            ),
        ] as readonly string[];

        for (const sort of sortConfig) {
            if (!allSortableFields.includes(sort.id)) {
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
        return [{ id: "tagNumber", desc: false }];
    }

    /**
     * Checks if a field can be sorted at SQL level
     */
    canSortAtSQLLevel(fieldId: string): boolean {
        const simple = CATTLE_QUERY_CONFIG.SORTABLE_FIELDS
            .SIMPLE as readonly (
                | "tagNumber"
                | "gender"
                | "healthStatus"
                | "createdAt"
                | "animalStatus"
            )[];
        return (simple as readonly string[]).includes(fieldId);
    }

    /**
     * Checks if a field requires post-processing sort
     */
    requiresPostProcessingSort(fieldId: string): boolean {
        const computed = CATTLE_QUERY_CONFIG.SORTABLE_FIELDS
            .COMPUTED as readonly (
                | "cattleClass"
                | "purchasePrice"
                | "totalPrice"
                | "purchaseDate"
            )[];
        return (computed as readonly string[]).includes(fieldId);
    }
}
