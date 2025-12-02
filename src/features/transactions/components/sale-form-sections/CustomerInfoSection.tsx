/**
 * Customer Information Section
 * Handles customer search and selection
 */

import { Receipt } from "lucide-react";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import CustomerSearchField from "../customer-search/customer-search-bar";
import type { FormSectionProps } from "./types";

export function CustomerInfoSection({ form }: FormSectionProps) {
	return (
		<div className="space-y-4 rounded-lg border bg-accent p-4">
			<h3 className="flex items-center gap-2 font-semibold text-lg">
				<Receipt className="h-5 w-5" />
				Customer Information
			</h3>
			<FormField
				control={form.control}
				name="customer"
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<CustomerSearchField
								value={field.value}
								onChange={field.onChange}
								placeholder="Search or create customer..."
							/>
						</FormControl>
						<FormDescription>
							Search for an existing customer or create a new one
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
