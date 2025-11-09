// Export main component as default (for backwards compatibility)
export { default } from "./customer-search-bar";

// Export main component as named export
export { default as CustomerSearchField } from "./customer-search-bar";

// Export sub-components
export { DivisionCombobox } from "./division-combobox";
export { DistrictCombobox } from "./district-combobox";
export { ZoneCombobox } from "./zone-combobox";
export { ExistingCustomerDetails } from "./existing-customer-details";
export { NewCustomerForm } from "./new-customer-form";

// Export types
export type {
	CustomerValue,
	CustomerAddress,
	CustomerSearchFieldProps,
	AddressWithRelations,
	CustomerWithAddresses,
} from "./types";

// Export hooks
export { default as useCustomersQuery } from "./use-customers-query";
export { useDivisions, useDistricts, useZones } from "./use-location-data";
export type { Division, District, Zone } from "./use-location-data";

