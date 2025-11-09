"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";
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
import useCustomersQuery from "./use-customers-query";
import { ExistingCustomerDetails } from "./existing-customer-details";
import { NewCustomerForm } from "./new-customer-form";
import type {
	CustomerValue,
	CustomerSearchFieldProps,
	CustomerWithAddresses,
} from "./types";

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
	}, [value?.name]);

	// Normalize search string for comparison
	const normalizeString = React.useCallback(
		(str: string) => str.toLowerCase().replace(/[-\s]/g, ""),
		[],
	);

	// Filter customers based on search input
	const filteredCustomers = React.useMemo(() => {
		if (!existingCustomers?.customers || !searchValue) return [];

		const normalizedSearch = normalizeString(searchValue);

		return existingCustomers.customers.filter((customer) => {
			const normalizedName = normalizeString(customer.name);
			const normalizedPhone = normalizeString(customer.primaryPhone);

			return (
				normalizedName.includes(normalizedSearch) ||
				normalizedPhone.includes(normalizedSearch)
			);
		});
	}, [existingCustomers?.customers, searchValue, normalizeString]);

	const handleSelectCustomer = React.useCallback(
		(customer: CustomerWithAddresses) => {
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
		[onChange],
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

			if (!search) return;

			// Check for exact match
			const normalizedSearch = normalizeString(search);
			const exactMatch = existingCustomers?.customers?.find((customer) => {
				const normalizedName = normalizeString(customer.name);
				const normalizedPhone = normalizeString(customer.primaryPhone);
				return (
					normalizedName === normalizedSearch ||
					normalizedPhone === normalizedSearch
				);
			});

			if (exactMatch) {
				handleSelectCustomer(exactMatch);
			} else {
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
		[
			existingCustomers?.customers,
			onChange,
			handleSelectCustomer,
			normalizeString,
		],
	);

	const displayValue = value?.name || "";
	const isExistingCustomer = Boolean(value?.id && !value?.isNew);

	return (
		<div className="w-full space-y-3">
			{/* Customer Search Combobox */}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						id="customer-search"
						variant="outline"
						role="combobox"
						aria-expanded={open}
						aria-label="Search for customer"
						className="w-full justify-between"
						disabled={disabled}
					>
						<div className="flex items-center gap-2 flex-1 min-w-0">
							<User className="h-4 w-4 shrink-0" />
							<span className="truncate">{displayValue || placeholder}</span>
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
												className={cn(
													"ml-2 h-4 w-4",
													value?.id === customer.id
														? "opacity-100"
														: "opacity-0",
												)}
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

			{/* Customer Details Section */}
			{value?.name &&
				(isExistingCustomer ? (
					<ExistingCustomerDetails customer={value} />
				) : (
					onChange && <NewCustomerForm customer={value} onChange={onChange} />
				))}
		</div>
	);
}
