"use client";

import * as React from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import type { District } from "./use-location-data";

// ============================================================================
// District Combobox Component
// ============================================================================

interface DistrictComboboxProps {
	value?: string;
	onChange: (value: string) => void;
	districts: District[];
	disabled?: boolean;
}

export function DistrictCombobox({
	value,
	onChange,
	districts,
	disabled = false,
}: DistrictComboboxProps) {
	const [open, setOpen] = React.useState(false);

	const selectedDistrict = React.useMemo(
		() => districts.find((district) => district.id === value),
		[districts, value],
	);

	return (
		<div className="space-y-1.5">
			<Label htmlFor="district" className="text-xs">
				<MapPin className="h-3 w-3" />
				District *
			</Label>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						id="district"
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
						disabled={disabled}
					>
						{selectedDistrict ? selectedDistrict.name : "Select district..."}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
					<Command>
						<CommandInput placeholder="Search district..." className="h-9" />
						<CommandList>
							<CommandEmpty>No district found.</CommandEmpty>
							<CommandGroup>
								{districts.map((district) => (
									<CommandItem
										key={district.id}
										value={district.name}
										onSelect={() => {
											onChange(district.id);
											setOpen(false);
										}}
									>
										{district.name}
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												value === district.id ? "opacity-100" : "opacity-0",
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}

