import type { Address, Customer } from "@/db/schema";

// ============================================================================
// Types
// ============================================================================

// Type for addresses with related location data
export type AddressWithRelations = Address & {
	division?: { id: string; name: string } | null;
	district?: { id: string; name: string } | null;
	zone?: { id: string; name: string } | null;
};

// Type for customers with addresses
export type CustomerWithAddresses = Customer & {
	addresses?: AddressWithRelations[];
};

export interface CustomerAddress {
	addressLine: string;
	divisionId?: string;
	districtId?: string;
	zoneId?: string;
	divisionName?: string;
	districtName?: string;
	zoneName?: string;
}

export interface CustomerValue {
	name: string;
	phone: string;
	id?: string;
	address?: CustomerAddress;
	isNew?: boolean;
}

export interface CustomerSearchFieldProps {
	value?: CustomerValue;
	onChange?: (value: CustomerValue) => void;
	placeholder?: string;
	disabled?: boolean;
}

