"use client";

import * as React from "react";
import { Plus, Phone, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDivisions, useDistricts, useZones } from "./use-location-data";
import { DivisionCombobox } from "./division-combobox";
import { DistrictCombobox } from "./district-combobox";
import { ZoneCombobox } from "./zone-combobox";
import type { CustomerValue, CustomerAddress } from "./types";

// ============================================================================
// New Customer Form Component
// ============================================================================

interface NewCustomerFormProps {
	customer: CustomerValue;
	onChange: (value: CustomerValue) => void;
}

export function NewCustomerForm({ customer, onChange }: NewCustomerFormProps) {
	const { data: divisions = [] } = useDivisions();
	const { data: districts = [] } = useDistricts();
	const { data: zones = [] } = useZones();

	// Filter districts based on selected division
	const filteredDistricts = React.useMemo(() => {
		if (!customer.address?.divisionId) return [];
		return districts.filter(
			(district) => district.divisionId === customer.address?.divisionId,
		);
	}, [districts, customer.address?.divisionId]);

	// Filter zones based on selected district
	const filteredZones = React.useMemo(() => {
		if (!customer.address?.districtId) return [];
		return zones.filter(
			(zone) => zone.districtId === customer.address?.districtId,
		);
	}, [zones, customer.address?.districtId]);

	const updateField = React.useCallback(
		(field: keyof CustomerValue, value: string) => {
			onChange({
				...customer,
				[field]: value,
			});
		},
		[customer, onChange],
	);

	const updateAddress = React.useCallback(
		(field: keyof CustomerAddress, value: string) => {
			onChange({
				...customer,
				address: {
					...customer.address,
					addressLine: customer.address?.addressLine || "",
					[field]: value,
				},
			});
		},
		[customer, onChange],
	);

	const handleDivisionChange = React.useCallback(
		(divisionId: string) => {
			// Reset district and zone when division changes
			onChange({
				...customer,
				address: {
					addressLine: customer.address?.addressLine || "",
					divisionId,
					districtId: undefined,
					zoneId: undefined,
				},
			});
		},
		[customer, onChange],
	);

	const handleDistrictChange = React.useCallback(
		(districtId: string) => {
			// Reset zone when district changes
			onChange({
				...customer,
				address: {
					...customer.address,
					addressLine: customer.address?.addressLine || "",
					districtId,
					zoneId: undefined,
				},
			});
		},
		[customer, onChange],
	);

	return (
		<div className="space-y-3 rounded-md border border-dashed border-primary/50 bg-primary/5 p-4">
			<div className="flex items-center gap-2">
				<Badge variant="outline" className="flex items-center gap-1">
					<Plus className="h-3 w-3" />
					New Customer
				</Badge>
			</div>

			<div className="grid gap-3">
				{/* Phone Number */}
				<div className="space-y-1.5">
					<Label htmlFor="phone" className="text-xs">
						<Phone className="h-3 w-3" />
						Phone Number *
					</Label>
					<Input
						id="phone"
						type="tel"
						placeholder="Enter phone number"
						value={customer.phone}
						onChange={(e) => updateField("phone", e.target.value)}
					/>
				</div>

				{/* Division - Using Combobox */}
				<DivisionCombobox
					value={customer.address?.divisionId}
					onChange={handleDivisionChange}
					divisions={divisions}
				/>

				{/* District - Using Combobox */}
				<DistrictCombobox
					value={customer.address?.districtId}
					onChange={handleDistrictChange}
					districts={filteredDistricts}
					disabled={!customer.address?.divisionId}
				/>

				{/* Zone/Upazila - Using Combobox */}
				<ZoneCombobox
					value={customer.address?.zoneId}
					onChange={(value) => updateAddress("zoneId", value)}
					zones={filteredZones}
					disabled={!customer.address?.districtId}
				/>

				{/* Address Line */}
				<div className="space-y-1.5">
					<Label htmlFor="addressLine" className="text-xs">
						<Home className="h-3 w-3" />
						Address Line *
					</Label>
					<Input
						id="addressLine"
						placeholder="House/Road/Area details"
						value={customer.address?.addressLine || ""}
						onChange={(e) => updateAddress("addressLine", e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
}
