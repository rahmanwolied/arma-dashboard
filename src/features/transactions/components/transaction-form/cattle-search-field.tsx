"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X, Plus } from "lucide-react";

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
import useCattleQuery from "./use-cattle-query";

interface AnimalValue {
	id: string;
	tagNumber: string;
	liveWeight: number;
	adjustedPrice?: number;
}

interface CattleSearchFieldProps {
	value?: AnimalValue[];
	onChange?: (value: AnimalValue[]) => void;
	placeholder?: string;
	disabled?: boolean;
}

export default function CattleSearchField({
	value = [],
	onChange,
	placeholder = "Search cattle by tag number...",
	disabled = false,
}: CattleSearchFieldProps) {
	const [open, setOpen] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState("");
	const { data: cattleData } = useCattleQuery(searchValue);

	const availableCattle = cattleData?.cattle || [];

	const handleSelectCattle = (cattle: {
		id: string;
		tagNumber: string;
		liveWeight: number;
		adjustedPrice?: number;
	}) => {
		// Check if already selected
		const isAlreadySelected = value.some((item) => item.id === cattle.id);

		if (isAlreadySelected) {
			// Remove from selection
			const newValue = value.filter((item) => item.id !== cattle.id);
			onChange?.(newValue);
		} else {
			// Add to selection
			const newValue = [
				...value,
				{
					id: cattle.id,
					tagNumber: cattle.tagNumber,
					liveWeight: cattle.liveWeight,
					adjustedPrice: cattle.adjustedPrice,
				},
			];
			onChange?.(newValue);
		}
		setSearchValue("");
	};

	const handleRemoveCattle = (id: string) => {
		const newValue = value.filter((item) => item.id !== id);
		onChange?.(newValue);
	};

	const isSelected = (id: string) => value.some((item) => item.id === id);

	return (
		<div className="w-full space-y-3">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
						disabled={disabled}
					>
						<div className="flex items-center gap-2">
							<Plus className="h-4 w-4" />
							{value.length === 0
								? placeholder
								: `${value.length} animal${value.length > 1 ? "s" : ""} selected`}
						</div>
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
					<Command>
						<CommandInput
							placeholder="Type tag number to search..."
							value={searchValue}
							onValueChange={setSearchValue}
						/>
						<CommandList>
							{availableCattle.length > 0 ? (
								<CommandGroup heading="Available Cattle">
									{availableCattle.map((cattle) => (
										<CommandItem
											key={cattle.id}
											value={cattle.tagNumber}
											onSelect={() => handleSelectCattle(cattle)}
											className="flex items-center justify-between"
										>
											<div className="flex flex-col">
												<span className="font-medium">
													Tag: {cattle.tagNumber}
												</span>
												<span className="text-muted-foreground text-sm">
													Weight: {cattle.liveWeight} kg • {cattle.gender}
													{cattle.adjustedPrice && cattle.adjustedPrice > 0 && (
														<> • Cost: ৳{cattle.adjustedPrice.toLocaleString()}</>
													)}
												</span>
											</div>
											<Check
												className={`ml-2 h-4 w-4 ${isSelected(cattle.id) ? "opacity-100" : "opacity-0"}`}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							) : (
								<CommandEmpty>
									<div className="flex flex-col items-center gap-2 py-4">
										<p className="text-muted-foreground text-sm">
											{searchValue
												? "No cattle found with this tag number"
												: "Type to search for available cattle"}
										</p>
									</div>
								</CommandEmpty>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			{/* Selected animals display */}
			{value.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{value.map((animal) => (
						<Badge
							key={animal.id}
							variant="secondary"
							className="flex items-center gap-1 px-3 py-1"
						>
							<span className="font-medium">{animal.tagNumber}</span>
							<span className="text-muted-foreground">
								({animal.liveWeight} kg
								{animal.adjustedPrice && animal.adjustedPrice > 0 && (
									<> • ৳{animal.adjustedPrice.toLocaleString()}</>
								)})
							</span>
							<button
								type="button"
								onClick={() => handleRemoveCattle(animal.id)}
								className="ml-1 hover:text-destructive"
								disabled={disabled}
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					))}
				</div>
			)}

			{/* Summary */}
			{value.length > 0 && (
				<div className="rounded-md border bg-muted/50 p-3">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Total Animals:</span>
						<span className="font-medium">{value.length}</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Total Weight:</span>
						<span className="font-medium">
							{value.reduce((sum, animal) => sum + animal.liveWeight, 0)} kg
						</span>
					</div>
					{value.some(a => a.adjustedPrice && a.adjustedPrice > 0) && (
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Total Cost:</span>
							<span className="font-medium">
								৳{value.reduce((sum, animal) => sum + (animal.adjustedPrice || 0), 0).toLocaleString()}
							</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

