/**
 * Sale Details Section
 * Handles price per kg and sale date inputs
 */

import { DollarSign, Calendar } from "lucide-react";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FormSectionProps } from "./types";

export function SaleDetailsSection({ form }: FormSectionProps) {
	return (
		<div className="space-y-4 rounded-lg border bg-accent p-4">
			<h3 className="flex items-center gap-2 text-lg font-semibold">
				<DollarSign className="h-5 w-5" />
				Sale Details
			</h3>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2">
				<FormField
					control={form.control}
					name="pricePerKg"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Price per KG (৳)</FormLabel>
							<FormControl>
								<Input
									type="number"
									step="0.01"
									placeholder="Enter price per kg"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="saleDate"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								Sale Date
							</FormLabel>
							<FormControl>
								<Input
									type="date"
									{...field}
									value={
										field.value instanceof Date
											? field.value.toISOString().split("T")[0]
											: field.value
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
