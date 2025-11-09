/**
 * Market Search Field Component
 * A clean, reusable component for searching and selecting markets
 */

"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, Store } from "lucide-react";
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
import { ExistingMarketDetails } from "./ExistingMarketDetails";
import { NewMarketForm } from "./NewMarketForm";
import { useMarketsQuery } from "./use-markets-query";
import type { MarketSearchFieldProps, MarketValue } from "./types";
import type { Market } from "@/db/schema";

export function MarketSearchField({
	value,
	onChange,
	placeholder = "Search or create market...",
	disabled = false,
}: MarketSearchFieldProps) {
	const [open, setOpen] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState("");
	const { data: marketsData } = useMarketsQuery();

	// Update search value when value prop changes
	React.useEffect(() => {
		if (value?.name) {
			setSearchValue(value.name);
		}
	}, [value]);

	// Filter markets based on search input
	const filteredMarkets = React.useMemo(() => {
		if (!marketsData?.markets) return [];
		return marketsData.markets.filter(
			(market) =>
				market.name.toLowerCase().includes(searchValue.toLowerCase()) ||
				market.location?.toLowerCase().includes(searchValue.toLowerCase()) ||
				market.phone?.toLowerCase().includes(searchValue.toLowerCase()),
		);
	}, [marketsData?.markets, searchValue]);

	const handleSelectMarket = React.useCallback(
		(market: Market) => {
			const marketValue: MarketValue = {
				id: market.id,
				name: market.name,
				location: market.location,
				phone: market.phone,
				isNew: false,
			};
			setSearchValue(market.name);
			setOpen(false);
			onChange?.(marketValue);
		},
		[onChange],
	);

	const handleCreateNewMarket = React.useCallback(() => {
		const newMarketValue: MarketValue = {
			name: searchValue,
			location: null,
			phone: null,
			isNew: true,
		};
		setOpen(false);
		onChange(newMarketValue);
	}, [searchValue, onChange]);

	const handleInputChange = React.useCallback(
		(search: string) => {
			setSearchValue(search);

			// If the search exactly matches an existing market, select it
			const exactMatch = marketsData?.markets?.find(
				(market) => market.name.toLowerCase() === search.toLowerCase(),
			);

			if (exactMatch) {
				handleSelectMarket(exactMatch);
			} else if (search) {
				// Update with new market data
				const newMarketValue: MarketValue = {
					name: search,
					location: null,
					phone: null,
					isNew: true,
				};
				onChange(newMarketValue);
			}
		},
		[marketsData?.markets, onChange, handleSelectMarket],
	);

	const displayValue = value?.name || "";
	const isExistingMarket = value?.id && !value?.isNew;

	return (
		<div className="w-full space-y-3">
			{/* Market Search Combobox */}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
						disabled={disabled}
					>
						<div className="flex items-center gap-2 flex-1 min-w-0">
							<Store className="h-4 w-4 shrink-0" />
							<span className="truncate">{displayValue || placeholder}</span>
						</div>
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
					<Command shouldFilter={false}>
						<CommandInput
							placeholder="Search market name..."
							value={searchValue}
							onValueChange={handleInputChange}
						/>
						<CommandList>
							{filteredMarkets.length > 0 && (
								<CommandGroup heading="Existing Markets">
									{filteredMarkets.map((market) => (
										<CommandItem
											key={market.id}
											value={market.name}
											onSelect={() => handleSelectMarket(market)}
											className="flex items-center justify-between"
										>
											<div className="flex flex-col">
												<span className="font-medium">{market.name}</span>
												{market.location && (
													<span className="text-muted-foreground text-sm">
														{market.location}
													</span>
												)}
											</div>
											<Check
												className={`ml-2 h-4 w-4 ${
													value?.id === market.id ? "opacity-100" : "opacity-0"
												}`}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							)}
							{searchValue && filteredMarkets.length === 0 && (
								<CommandEmpty className="px-2 py-2">
									<div className="flex flex-col items-center gap-2 pb-2">
										<p className="text-muted-foreground text-sm">
											No existing markets found
										</p>
										<Button
											variant="outline"
											size="sm"
											onClick={handleCreateNewMarket}
											className="flex items-center gap-2"
										>
											<Plus className="h-4 w-4" />
											Create &quot;{searchValue}&quot; as new market
										</Button>
									</div>
								</CommandEmpty>
							)}
							{searchValue && filteredMarkets.length > 0 && (
								<CommandGroup>
									<CommandItem onSelect={handleCreateNewMarket}>
										<Plus className="mr-2 h-4 w-4" />
										Create &quot;{searchValue}&quot; as a new market
									</CommandItem>
								</CommandGroup>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			{/* Market Details Section */}
			{value?.name &&
				(isExistingMarket ? (
					<ExistingMarketDetails market={value} />
				) : (
					<NewMarketForm market={value} onChange={onChange} />
				))}
		</div>
	);
}
