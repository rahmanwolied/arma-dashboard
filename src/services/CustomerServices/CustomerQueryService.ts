/**
 * CustomerQueryService - Main service for customer data queries
 * Orchestrates all customer query operations using specialized services
 */

import { and, count, eq, type SQL, sql } from "drizzle-orm";
import { db } from "@/db";
import {
    addresses,
    customers,
    districts,
    divisions,
    zones,
} from "@/db/schema";
import { CustomerFilterService } from "./CustomerFilterService";
import { CustomerSortingService } from "./CustomerSortingService";
import {
    CustomerDataProcessor,
    type CustomerWithDetails,
    type RawCustomerData,
} from "./CustomerDataProcessor";
import { CustomerCacheService } from "./CustomerCacheService";
import type { GetCustomersSchema } from "@/app/_lib/validations";

export interface CustomerQueryResult {
    data: CustomerWithDetails[];
    total: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ICustomerQueryService {
    getCustomersData(input: GetCustomersSchema): Promise<CustomerQueryResult>;
    getCustomersByIds(ids: string[]): Promise<CustomerQueryResult>;
}

export class CustomerQueryService implements ICustomerQueryService {
    private filterService: CustomerFilterService;
    private sortingService: CustomerSortingService;
    private dataProcessor: CustomerDataProcessor;

    constructor() {
        this.filterService = new CustomerFilterService();
        this.sortingService = new CustomerSortingService();
        this.dataProcessor = new CustomerDataProcessor();
    }

    /**
     * Main method to get customer data with all processing
     */
    async getCustomersData(input: GetCustomersSchema): Promise<CustomerQueryResult> {
        const cacheKey = CustomerCacheService.generateCacheKey(input);
        const ttl = CustomerCacheService.getCacheTTL(input);

        return await CustomerCacheService.getCachedBaseQuery(
            cacheKey,
            async () => {
                try {
                    // Validate input
                    const filterValidation = this.filterService
                        .validateFilterInput(input);
                    if (!filterValidation.isValid) {
                        throw new Error(
                            `Invalid filter input: ${filterValidation.errors.join(", ")
                            }`,
                        );
                    }

                    const sortValidation = this.sortingService
                        .validateSortConfig(input.sort);
                    if (!sortValidation.isValid) {
                        throw new Error(
                            `Invalid sort configuration: ${sortValidation.errors.join(", ")
                            }`,
                        );
                    }

                    const offset = (input.page - 1) * input.perPage;

                    return await db.transaction(async (tx) => {
                        // Build where clause
                        const whereClause = this.buildWhereClause(input);

                        // Get base customer data
                        const rawData = await this.getBaseCustomerData(
                            tx,
                            whereClause,
                            input,
                            offset,
                        );

                        if (rawData.length === 0) {
                            return {
                                data: [],
                                total: 0,
                                pageCount: 0,
                                hasNextPage: false,
                                hasPreviousPage: false,
                            };
                        }

                        // Process and map data
                        const processedData = this.dataProcessor
                            .mapRawDataToCustomerWithDetails(rawData);

                        // Get total count
                        const total = await this.getTotalCount(tx, whereClause);

                        const pageCount = Math.ceil(total / input.perPage);

                        return {
                            data: processedData,
                            total,
                            pageCount,
                            hasNextPage: input.page < pageCount,
                            hasPreviousPage: input.page > 1,
                        };
                    });
                } catch (_error) {
                    return {
                        data: [],
                        total: 0,
                        pageCount: 0,
                        hasNextPage: false,
                        hasPreviousPage: false,
                    };
                }
            },
            ttl,
        );
    }

    /**
     * Builds the complete WHERE clause
     */
    private buildWhereClause(input: GetCustomersSchema) {
        return this.filterService.buildWhereClause(input);
    }

    /**
     * Gets base customer data with joins to address tables
     */
    private async getBaseCustomerData(
        tx: unknown,
        whereClause: SQL | undefined,
        input: GetCustomersSchema,
        offset: number,
    ): Promise<RawCustomerData[]> {
        const orderBy = this.sortingService.getSQLOrderBy(input.sort);
        const t = tx as typeof db;

        const query = t
            .select({
                id: customers.id,
                name: customers.name,
                primaryPhone: customers.primaryPhone,
                secondaryPhone: customers.secondaryPhone,
                email: customers.email,
                createdAt: customers.createdAt,
                updatedAt: customers.updatedAt,
                deletedAt: customers.deletedAt,
                // Address info
                addressId: addresses.id,
                addressLine: addresses.addressLine,
                landmark: addresses.landmark,
                divisionName: divisions.name,
                districtName: districts.name,
                zoneName: zones.name,
            })
            .from(customers)
            .leftJoin(
                addresses,
                sql`${addresses.customerId} = ${customers.id}`,
            )
            .leftJoin(
                divisions,
                sql`${divisions.id} = ${addresses.divisionId}`,
            )
            .leftJoin(
                districts,
                sql`${districts.id} = ${addresses.districtId}`,
            )
            .leftJoin(zones, sql`${zones.id} = ${addresses.zoneId}`)
            .where(whereClause)
            .orderBy(...orderBy)
            .limit(input.perPage)
            .offset(offset);

        return await query;
    }

    /**
     * Gets total count for pagination
     */
    private async getTotalCount(
        tx: unknown,
        whereClause: SQL | undefined,
    ): Promise<number> {
        const t = tx as typeof db;
        const result = await t
            .select({ count: count() })
            .from(customers)
            .leftJoin(
                addresses,
                sql`${addresses.customerId} = ${customers.id}`,
            )
            .leftJoin(
                divisions,
                sql`${divisions.id} = ${addresses.divisionId}`,
            )
            .leftJoin(
                districts,
                sql`${districts.id} = ${addresses.districtId}`,
            )
            .leftJoin(zones, sql`${zones.id} = ${addresses.zoneId}`)
            .where(whereClause);

        return result[0]?.count ?? 0;
    }

    /**
     * Gets customer data by IDs
     */
    async getCustomersByIds(ids: string[]): Promise<CustomerQueryResult> {
        if (ids.length === 0) {
            return {
                data: [],
                total: 0,
                pageCount: 0,
                hasNextPage: false,
                hasPreviousPage: false,
            };
        }

        return await db.transaction(async (tx) => {
            const rawData = await tx
                .select({
                    id: customers.id,
                    name: customers.name,
                    primaryPhone: customers.primaryPhone,
                    secondaryPhone: customers.secondaryPhone,
                    email: customers.email,
                    createdAt: customers.createdAt,
                    updatedAt: customers.updatedAt,
                    deletedAt: customers.deletedAt,
                    // Address info
                    addressId: addresses.id,
                    addressLine: addresses.addressLine,
                    landmark: addresses.landmark,
                    divisionName: divisions.name,
                    districtName: districts.name,
                    zoneName: zones.name,
                })
                .from(customers)
                .leftJoin(
                    addresses,
                    sql`${addresses.customerId} = ${customers.id}`,
                )
                .leftJoin(
                    divisions,
                    sql`${divisions.id} = ${addresses.divisionId}`,
                )
                .leftJoin(
                    districts,
                    sql`${districts.id} = ${addresses.districtId}`,
                )
                .leftJoin(zones, sql`${zones.id} = ${addresses.zoneId}`)
                .where(
                    and(
                        // Use inArray for multiple IDs
                        sql`${customers.id} = ANY(${ids})`,
                        sql`${customers.deletedAt} IS NULL`,
                    ),
                );

            const processedData = this.dataProcessor
                .mapRawDataToCustomerWithDetails(rawData);

            return {
                data: processedData,
                total: processedData.length,
                pageCount: 1,
                hasNextPage: false,
                hasPreviousPage: false,
            };
        });
    }
}

