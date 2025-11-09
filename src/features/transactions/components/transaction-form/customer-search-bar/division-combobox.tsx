"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Map as MapIcon } from "lucide-react";
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
import type { Division } from "./use-location-data";

// ============================================================================
// Division Combobox Component
// ============================================================================

interface DivisionComboboxProps {
	value?: string;
	onChange: (value: string) => void;
	divisions: Division[];
	disabled?: boolean;
}

export function DivisionCombobox({
	value,
	onChange,
	divisions,
	disabled = false,
}: DivisionComboboxProps) {
	const [open, setOpen] = React.useState(false);

	const selectedDivision = React.useMemo(
		() => divisions.find((division) => division.id === value),
		[divisions, value],
	);

	return (
		<div className="space-y-1.5">
			<Label htmlFor="division" className="text-xs">
				<MapIcon className="h-3 w-3" />
				Division *
			</Label>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						id="division"
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
						disabled={disabled}
					>
						{selectedDivision ? selectedDivision.name : "Select division..."}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
					<Command>
						<CommandInput placeholder="Search division..." className="h-9" />
						<CommandList>
							<CommandEmpty>No division found.</CommandEmpty>
							<CommandGroup>
								{divisions.map((division) => (
									<CommandItem
										key={division.id}
										value={division.name}
										onSelect={() => {
											onChange(division.id);
											setOpen(false);
										}}
									>
										{division.name}
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												value === division.id ? "opacity-100" : "opacity-0",
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

