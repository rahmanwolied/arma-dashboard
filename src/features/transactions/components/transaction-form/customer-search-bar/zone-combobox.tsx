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
import type { Zone } from "./use-location-data";

// ============================================================================
// Zone Combobox Component
// ============================================================================

interface ZoneComboboxProps {
	value?: string;
	onChange: (value: string) => void;
	zones: Zone[];
	disabled?: boolean;
}

export function ZoneCombobox({
	value,
	onChange,
	zones,
	disabled = false,
}: ZoneComboboxProps) {
	const [open, setOpen] = React.useState(false);

	const selectedZone = React.useMemo(
		() => zones.find((zone) => zone.id === value),
		[zones, value],
	);

	return (
		<div className="space-y-1.5">
			<Label htmlFor="zone" className="text-xs">
				<MapPin className="h-3 w-3" />
				Zone/Upazila *
			</Label>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						id="zone"
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
						disabled={disabled}
					>
						{selectedZone ? selectedZone.name : "Select zone/upazila..."}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
					<Command>
						<CommandInput placeholder="Search zone/upazila..." className="h-9" />
						<CommandList>
							<CommandEmpty>No zone/upazila found.</CommandEmpty>
							<CommandGroup>
								{zones.map((zone) => (
									<CommandItem
										key={zone.id}
										value={zone.name}
										onSelect={() => {
											onChange(zone.id);
											setOpen(false);
										}}
									>
										{zone.name}
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												value === zone.id ? "opacity-100" : "opacity-0",
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

