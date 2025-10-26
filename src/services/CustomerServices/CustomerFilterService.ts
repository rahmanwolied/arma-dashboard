/**
 * CustomerFilterService - Handles all filtering logic for customer queries
 * Uses Drizzle ORM methods exclusively, no raw SQL
 */

import {
    and,
    ilike,
    inArray,
    type SQL,
    sql,
    type Table,
} from "drizzle-orm";
import {
    addresses,
    customers,
    districts,
    divisions,
    zones,
} from "@/db/schema";
import { filterColumns } from "@/lib/filters";
import type { ExtendedColumnFilter } from "@/types/data-table";
import type { GetCustomersSchema } from "@/app/_lib/validations";

export interface ICustomerFilterService {
    buildWhereClause(input: GetCustomersSchema): SQL | undefined;
    buildAdvancedFilters(
        filters: ExtendedColumnFilter<typeof customers>[],
        joinOperator: "and" | "or",
        additionalTables: Record<string, Table>,
    ): SQL | undefined;
    validateFilterInput(
        input: GetCustomersSchema,
    ): { isValid: boolean; errors: string[] };
}

export class CustomerFilterService implements ICustomerFilterService {
    /**
     * Builds the main WHERE clause for customer queries
     */
    buildWhereClause(input: GetCustomersSchema): SQL | undefined {
        const isAdvancedTable = input.filterFlag === "advancedFilters" ||
            input.filterFlag === "commandFilters";

        if (isAdvancedTable)
            return this.buildAdvancedFilters(
                input.filters,
                input.joinOperator,
                {
                    customers,
                    addresses,
                    divisions,
                    districts,
                    zones,
                },
            );

        return this.buildBasicFilters(input);
    }

    /**
     * Builds advanced filters using the filterColumns utility
     */
    buildAdvancedFilters(
        filters: ExtendedColumnFilter<typeof customers>[],
        joinOperator: "and" | "or",
        additionalTables: Record<string, Table>,
    ): SQL | undefined {
        return filterColumns({
            table: customers,
            filters,
            joinOperator,
            additionalTables,
        });
    }

    /**
     * Builds basic filters for standard customer queries
     */
    private buildBasicFilters(input: GetCustomersSchema): SQL | undefined {
        const conditions: SQL[] = [];

        // Search filter (customer name)
        const search = this.buildSearchFilter(input.search);
        if (search) conditions.push(search);

        // Division filter
        const division = this.buildDivisionFilter(input.division);
        if (division) conditions.push(division);

        // District filter
        const district = this.buildDistrictFilter(input.district);
        if (district) conditions.push(district);

        // Zone filter
        const zone = this.buildZoneFilter(input.zone);
        if (zone) conditions.push(zone);

        // Exclude soft-deleted records
        conditions.push(sql`${customers.deletedAt} IS NULL`);

        return conditions.length > 0 ? and(...conditions) : undefined;
    }

    /**
     * Builds search filter for customer name
     */
    private buildSearchFilter(search?: string): SQL | undefined {
        if (!search) return undefined;
        return ilike(customers.name, `%${search}%`);
    }

    /**
     * Builds division filter
     * Note: Filters by name since the query returns names, not IDs
     */
    private buildDivisionFilter(divisionNames: string[]): SQL | undefined {
        if (divisionNames.length === 0) return undefined;
        return inArray(divisions.name, divisionNames);
    }

    /**
     * Builds district filter
     * Note: Filters by name since the query returns names, not IDs
     */
    private buildDistrictFilter(districtNames: string[]): SQL | undefined {
        if (districtNames.length === 0) return undefined;
        return inArray(districts.name, districtNames);
    }

    /**
     * Builds zone filter
     * Note: Filters by name since the query returns names, not IDs
     */
    private buildZoneFilter(zoneNames: string[]): SQL | undefined {
        if (zoneNames.length === 0) return undefined;
        return inArray(zones.name, zoneNames);
    }

    /**
     * Validates filter input
     */
    validateFilterInput(
        input: GetCustomersSchema,
    ): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        const MAX_PER_PAGE = 100;

        if (input.page < 1) {
            errors.push("Page number must be greater than 0");
        }

        if (input.perPage > MAX_PER_PAGE) {
            errors.push(
                `Page size cannot exceed ${MAX_PER_PAGE}`,
            );
        }

        if (input.perPage < 1) {
            errors.push("Page size must be greater than 0");
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }
}

