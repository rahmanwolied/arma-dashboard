"use client";

import * as React from "react";
import { 
	Check, 
	ChevronsUpDown, 
	Plus, 
	User, 
	Phone, 
	MapPin,
	Home,
	Map
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Address, Customer } from "@/db/schema";
import useCustomersQuery from "./use-customers-query";
import { useDivisions, useDistricts, useZones } from "./use-location-data";
import type { Division, District, Zone } from "./use-location-data";

// ============================================================================
// Types
// ============================================================================

interface CustomerValue {
	name: string;
	phone: string;
	id?: string;
	address?: {
		addressLine: string;
		divisionId?: string;
		districtId?: string;
		zoneId?: string;
		divisionName?: string;
		districtName?: string;
		zoneName?: string;
	};
	isNew?: boolean;
}

interface CustomerSearchFieldProps {
	value?: CustomerValue;
	onChange?: (value: CustomerValue) => void;
	placeholder?: string;
	disabled?: boolean;
}

// ============================================================================
// Sub-Components
// ============================================================================

interface ExistingCustomerDetailsProps {
	customer: CustomerValue;
}

function ExistingCustomerDetails({ customer }: ExistingCustomerDetailsProps) {
	return (
		<div className="space-y-3 rounded-md border border-border bg-muted/30 p-4">
			<div className="flex items-center gap-2">
				<Badge variant="secondary" className="flex items-center gap-1">
					<User className="h-3 w-3" />
					Existing Customer
				</Badge>
			</div>

			<div className="grid gap-3">
				{/* Phone Number */}
				<div className="space-y-1.5">
					<Label className="text-xs text-muted-foreground">
						<Phone className="h-3 w-3" />
						Phone Number
					</Label>
					<Input
						value={customer.phone}
						disabled
						className="bg-background/50"
					/>
				</div>

				{/* Division */}
				{customer.address?.divisionName && (
					<div className="space-y-1.5">
						<Label className="text-xs text-muted-foreground">
							<Map className="h-3 w-3" />
							Division
						</Label>
						<Input
							value={customer.address.divisionName}
							disabled
							className="bg-background/50"
						/>
					</div>
				)}

				{/* District */}
				{customer.address?.districtName && (
					<div className="space-y-1.5">
						<Label className="text-xs text-muted-foreground">
							<MapPin className="h-3 w-3" />
							District
						</Label>
						<Input
							value={customer.address.districtName}
							disabled
							className="bg-background/50"
						/>
					</div>
				)}

				{/* Zone */}
				{customer.address?.zoneName && (
					<div className="space-y-1.5">
						<Label className="text-xs text-muted-foreground">
							<MapPin className="h-3 w-3" />
							Zone/Upazila
						</Label>
						<Input
							value={customer.address.zoneName}
							disabled
							className="bg-background/50"
						/>
					</div>
				)}

				{/* Address Line */}
				{customer.address?.addressLine && (
					<div className="space-y-1.5">
						<Label className="text-xs text-muted-foreground">
							<Home className="h-3 w-3" />
							Address
						</Label>
						<Input
							value={customer.address.addressLine}
							disabled
							className="bg-background/50"
						/>
					</div>
				)}
			</div>
		</div>
	);
}

interface NewCustomerFormProps {
	customer: CustomerValue;
	onChange: (value: CustomerValue) => void;
}

function NewCustomerForm({ customer, onChange }: NewCustomerFormProps) {
	const { data: divisions = [] } = useDivisions();
	const { data: districts = [] } = useDistricts();
	const { data: zones = [] } = useZones();

	// Filter districts based on selected division
	const filteredDistricts = React.useMemo(() => {
		if (!customer.address?.divisionId) return [];
		return districts.filter(
			(district) => district.divisionId === customer.address?.divisionId
		);
	}, [districts, customer.address?.divisionId]);

	// Filter zones based on selected district
	const filteredZones = React.useMemo(() => {
		if (!customer.address?.districtId) return [];
		return zones.filter(
			(zone) => zone.districtId === customer.address?.districtId
		);
	}, [zones, customer.address?.districtId]);

	const updateField = (field: string, value: string) => {
		onChange({
			...customer,
			[field]: value,
		});
	};

	const updateAddress = (field: string, value: string) => {
		onChange({
			...customer,
			address: {
				...customer.address,
				addressLine: customer.address?.addressLine || "",
				[field]: value,
			},
		});
	};

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

				{/* Division */}
				<div className="space-y-1.5">
					<Label htmlFor="division" className="text-xs">
						<Map className="h-3 w-3" />
						Division *
					</Label>
					<Select
						value={customer.address?.divisionId}
						onValueChange={(value) => {
							// Reset district and zone when division changes
							onChange({
								...customer,
								address: {
									addressLine: customer.address?.addressLine || "",
									divisionId: value,
									districtId: undefined,
									zoneId: undefined,
								},
							});
						}}
					>
						<SelectTrigger id="division" className="w-full">
							<SelectValue placeholder="Select division" />
						</SelectTrigger>
						<SelectContent>
							{divisions.map((division) => (
								<SelectItem key={division.id} value={division.id}>
									{division.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* District */}
				<div className="space-y-1.5">
					<Label htmlFor="district" className="text-xs">
						<MapPin className="h-3 w-3" />
						District *
					</Label>
					<Select
						value={customer.address?.districtId}
						onValueChange={(value) => {
							// Reset zone when district changes
							onChange({
								...customer,
								address: {
									...customer.address,
									addressLine: customer.address?.addressLine || "",
									districtId: value,
									zoneId: undefined,
								},
							});
						}}
						disabled={!customer.address?.divisionId}
					>
						<SelectTrigger id="district" className="w-full">
							<SelectValue placeholder="Select district" />
						</SelectTrigger>
						<SelectContent>
							{filteredDistricts.map((district) => (
								<SelectItem key={district.id} value={district.id}>
									{district.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Zone/Upazila */}
				<div className="space-y-1.5">
					<Label htmlFor="zone" className="text-xs">
						<MapPin className="h-3 w-3" />
						Zone/Upazila *
					</Label>
					<Select
						value={customer.address?.zoneId}
						onValueChange={(value) => updateAddress("zoneId", value)}
						disabled={!customer.address?.districtId}
					>
						<SelectTrigger id="zone" className="w-full">
							<SelectValue placeholder="Select zone/upazila" />
						</SelectTrigger>
						<SelectContent>
							{filteredZones.map((zone) => (
								<SelectItem key={zone.id} value={zone.id}>
									{zone.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

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

// ============================================================================
// Main Component
// ============================================================================

export default function CustomerSearchField({
	value,
	onChange,
	placeholder = "Search by name or phone...",
	disabled = false,
}: CustomerSearchFieldProps) {
	const [open, setOpen] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState("");
	const { data: existingCustomers } = useCustomersQuery();

	// Update search value when value prop changes
	React.useEffect(() => {
		if (value?.name) {
			setSearchValue(value.name);
		}
	}, [value]);

	// Filter customers based on search input
	const filteredCustomers = React.useMemo(() => {
		if (!existingCustomers?.customers) return [];
		const filtered = existingCustomers.customers.filter(
			(customer) =>
				customer.name.toLowerCase().includes(searchValue.toLowerCase()) ||
				customer.primaryPhone.replace('-','').toLowerCase().includes(searchValue.toLowerCase())
		);
		return filtered;
	}, [existingCustomers?.customers, searchValue]);

	const handleSelectCustomer = React.useCallback(
		(customer: any) => {
			const address = customer.addresses?.[0];
			const customerValue: CustomerValue = {
				id: customer.id,
				name: customer.name,
				phone: customer.primaryPhone,
				address: address
					? {
							addressLine: address.addressLine,
							divisionId: address.divisionId,
							districtId: address.districtId,
							zoneId: address.zoneId,
							divisionName: address.division?.name,
							districtName: address.district?.name,
							zoneName: address.zone?.name,
					  }
					: undefined,
				isNew: false,
			};
			setSearchValue(customer.name);
			setOpen(false);
			onChange?.(customerValue);
		},
		[onChange]
	);

	const handleCreateNewCustomer = React.useCallback(() => {
		const newCustomerValue: CustomerValue = {
			name: searchValue,
			phone: "",
			address: {
				addressLine: "",
			},
			isNew: true,
		};
		setOpen(false);
		onChange?.(newCustomerValue);
	}, [searchValue, onChange]);

	const handleInputChange = React.useCallback(
		(search: string) => {
			setSearchValue(search);

			// If the search exactly matches an existing customer, select it
			const exactMatch = existingCustomers?.customers?.find(
				(customer) => customer.name.toLowerCase() === search.toLowerCase() 
				|| customer.primaryPhone.replace('-','').toLowerCase() === search.toLowerCase()
			);
			
			if (exactMatch) {
				handleSelectCustomer(exactMatch);
			} else if (search) {
				// Update with new customer data
				const newCustomerValue: CustomerValue = {
					name: search,
					phone: "",
					address: {
						addressLine: "",
					},
					isNew: true,
				};
				onChange?.(newCustomerValue);
			}
		},
		[existingCustomers?.customers, onChange, handleSelectCustomer]
	);

	const displayValue = value?.name || "";
	const isExistingCustomer = value?.id && !value?.isNew;

	return (
		<div className="w-full space-y-3">
			{/* Customer Search Combobox */}
			<div className="space-y-1.5">
				{/* <Label htmlFor="customer-search">
					<User className="h-3.5 w-3.5" />
					Customer Name *
				</Label> */}
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							id="customer-search"
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className="w-full justify-between"
							disabled={disabled}
						>
							<div className="flex items-center gap-2 flex-1 min-w-0">
								<User className="h-4 w-4 shrink-0" />
								<span className="truncate">
									{displayValue || placeholder}
								</span>
							</div>
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
					<Command shouldFilter={false}>
						<CommandInput
							placeholder="Search by name or phone number..."
							value={searchValue}
							onValueChange={handleInputChange}
						/>
							<CommandList>
								{filteredCustomers.length > 0 && (
									<CommandGroup heading="Existing Customers">
										{filteredCustomers.map((customer) => (
											<CommandItem
												key={customer.id}
												value={customer.name}
												onSelect={() => handleSelectCustomer(customer)}
												className="flex items-center justify-between"
											>
												<div className="flex flex-col">
													<span className="font-medium">{customer.name}</span>
													<span className="text-muted-foreground text-sm">
														{customer.primaryPhone}
													</span>
												</div>
												<Check
													className={`ml-2 h-4 w-4 ${
														value?.id === customer.id
															? "opacity-100"
															: "opacity-0"
													}`}
												/>
											</CommandItem>
										))}
									</CommandGroup>
								)}
								{searchValue && filteredCustomers.length === 0 && (
									<CommandEmpty className="px-2 py-2">
										<div className="flex flex-col items-center gap-2 pb-2">
											<p className="text-muted-foreground text-sm">
												No existing customers found
											</p>
											<Button
												variant="outline"
												size="sm"
												onClick={handleCreateNewCustomer}
												className="flex items-center gap-2"
											>
												<Plus className="h-4 w-4" />
												Create &quot;{searchValue}&quot; as new customer
											</Button>
										</div>
									</CommandEmpty>
								)}
								{searchValue && filteredCustomers.length > 0 && (
									<CommandGroup>
										<CommandItem onSelect={handleCreateNewCustomer}>
											<Plus className="mr-2 h-4 w-4" />
											Create &quot;{searchValue}&quot; as a new customer
										</CommandItem>
									</CommandGroup>
								)}
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>

			{/* Customer Details Section */}
			{value?.name && (
				<>
					{isExistingCustomer ? (
						<ExistingCustomerDetails customer={value} />
					) : (
						<NewCustomerForm customer={value} onChange={onChange!} />
					)}
				</>
			)}
		</div>
	);
}
