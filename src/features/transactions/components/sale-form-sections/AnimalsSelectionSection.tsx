/**
 * Animals Selection Section
 * Handles selecting cattle for the sale
 */

import { ShoppingCart } from "lucide-react";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import CattleSearchField from "../cattle-search/cattle-search-field";
import type { FormSectionProps } from "./types";

export function AnimalsSelectionSection({ form }: FormSectionProps) {
	return (
		<div className="space-y-4 rounded-lg border bg-accent p-4">
			<h3 className="flex items-center gap-2 font-semibold text-lg">
				<ShoppingCart className="h-5 w-5" />
				Select Animals
			</h3>
			<FormField
				control={form.control}
				name="animals"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Animals for Sale</FormLabel>
						<FormControl>
							<CattleSearchField
								value={field.value}
								onChange={field.onChange}
								placeholder="Search cattle by tag number..."
							/>
						</FormControl>
						<FormDescription>
							Search and select one or more animals to include in this sale
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
