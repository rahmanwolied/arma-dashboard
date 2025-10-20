/**
 * CustomerDataProcessor - Handles data processing and transformation for customer queries
 */

import type {
    addresses,
    customers,
    districts,
    divisions,
    zones,
} from "@/db/schema";

export interface RawCustomerData {
    id: string;
    name: string;
    primaryPhone: string;
    secondaryPhone: string | null;
    email: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    // Address info (can be null if customer has no address)
    addressId: string | null;
    addressLine: string | null;
    landmark: string | null;
    divisionName: string | null;
    districtName: string | null;
    zoneName: string | null;
}

export interface CustomerWithDetails {
    id: string;
    name: string;
    primaryPhone: string;
    secondaryPhone: string | null;
    email: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    // Address info (flattened for easier access)
    addressId: string | null;
    addressLine: string | null;
    landmark: string | null;
    divisionName: string | null;
    districtName: string | null;
    zoneName: string | null;
}

export interface ICustomerDataProcessor {
    mapRawDataToCustomerWithDetails(
        rawData: RawCustomerData[],
    ): CustomerWithDetails[];
    validateCustomerData(
        data: RawCustomerData[],
    ): { isValid: boolean; errors: string[] };
    calculateStatistics(data: CustomerWithDetails[]): {
        totalCount: number;
        withAddresses: number;
        withoutAddresses: number;
        byDivision: Record<string, number>;
        byDistrict: Record<string, number>;
    };
}

export class CustomerDataProcessor implements ICustomerDataProcessor {
    /**
     * Maps raw database data to CustomerWithDetails objects
     */
    mapRawDataToCustomerWithDetails(
        rawData: RawCustomerData[],
    ): CustomerWithDetails[] {
        return rawData.map((item) => {
            return {
                id: item.id,
                name: item.name,
                primaryPhone: item.primaryPhone,
                secondaryPhone: item.secondaryPhone,
                email: item.email,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                deletedAt: item.deletedAt,
                // Address info - kept flat for backward compatibility
                addressId: item.addressId,
                addressLine: item.addressLine,
                landmark: item.landmark,
                divisionName: item.divisionName,
                districtName: item.districtName,
                zoneName: item.zoneName,
            };
        });
    }

    /**
     * Validates customer data consistency
     */
    validateCustomerData(
        data: RawCustomerData[],
    ): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        for (const customer of data) {
            // Validate customer name
            if (!customer.name || customer.name.trim().length === 0) {
                errors.push(
                    `Invalid or empty customer name for ID: ${customer.id}`,
                );
            }

            // Validate primary phone
            if (
                !customer.primaryPhone ||
                customer.primaryPhone.trim().length === 0
            ) {
                errors.push(
                    `Invalid or empty primary phone for customer: ${customer.name}`,
                );
            }

            // Validate created date
            if (
                !customer.createdAt ||
                Number.isNaN(new Date(customer.createdAt).getTime())
            ) {
                errors.push(
                    `Invalid created date for customer: ${customer.name}`,
                );
            }

            // If address exists, validate address fields
            if (customer.addressId) {
                if (!customer.addressLine || customer.addressLine.trim().length === 0) {
                    errors.push(
                        `Customer ${customer.name} has address ID but missing address line`,
                    );
                }
                if (!customer.divisionName) {
                    errors.push(
                        `Customer ${customer.name} has address but missing division`,
                    );
                }
                if (!customer.districtName) {
                    errors.push(
                        `Customer ${customer.name} has address but missing district`,
                    );
                }
                if (!customer.zoneName) {
                    errors.push(
                        `Customer ${customer.name} has address but missing zone`,
                    );
                }
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Calculates statistics for processed customer data
     */
    calculateStatistics(data: CustomerWithDetails[]): {
        totalCount: number;
        withAddresses: number;
        withoutAddresses: number;
        byDivision: Record<string, number>;
        byDistrict: Record<string, number>;
    } {
        const byDivision: Record<string, number> = {};
        const byDistrict: Record<string, number> = {};

        let withAddresses = 0;
        let withoutAddresses = 0;

        for (const customer of data) {
            if (customer.addressId && customer.divisionName && customer.districtName) {
                withAddresses++;

                // Count by division
                const division = customer.divisionName;
                byDivision[division] = (byDivision[division] || 0) + 1;

                // Count by district
                const district = customer.districtName;
                byDistrict[district] = (byDistrict[district] || 0) + 1;
            } else {
                withoutAddresses++;
            }
        }

        return {
            totalCount: data.length,
            withAddresses,
            withoutAddresses,
            byDivision,
            byDistrict,
        };
    }

    /**
     * Groups customer data by a specified field
     */
    groupBy(
        data: CustomerWithDetails[],
        field: "division" | "district",
    ): Record<string, CustomerWithDetails[]> {
        const groups: Record<string, CustomerWithDetails[]> = {};

        for (const customer of data) {
            if (!customer.divisionName || !customer.districtName) {
                // Group customers without addresses under a special key
                const key = "No Address";
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push(customer);
                continue;
            }

            const value = field === "division"
                ? customer.divisionName
                : customer.districtName;

            if (!groups[value]) {
                groups[value] = [];
            }
            groups[value].push(customer);
        }

        return groups;
    }

    /**
     * Filters customers by address availability
     */
    filterByAddressAvailability(
        data: CustomerWithDetails[],
        hasAddress: boolean,
    ): CustomerWithDetails[] {
        return data.filter((customer) =>
            hasAddress
                ? customer.addressId !== null
                : customer.addressId === null
        );
    }
}

