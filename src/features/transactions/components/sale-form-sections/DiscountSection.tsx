/**
 * Discount Section
 * Handles discount type selection and value input, with sale summary
 */

import { Percent } from "lucide-react";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SaleSummary } from "./SaleSummary";
import { ProfitLossDisplay } from "./ProfitLossDisplay";
import type { DiscountSectionProps } from "./types";

export function DiscountSection({ form, discountPreview }: DiscountSectionProps) {
	const pricePerKg = form.watch("pricePerKg") || 0;
	const discountType = form.watch("discountType");

	return (
		<div className="space-y-4 rounded-lg border bg-accent p-4">
			<h3 className="flex items-center gap-2 text-lg font-semibold">
				<Percent className="h-5 w-5" />
				Discount (Optional)
			</h3>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2">
				<FormField
					control={form.control}
					name="discountType"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Discount Type</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select discount type" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="FLAT">Flat Amount (৳)</SelectItem>
									<SelectItem value="PERCENT">Percentage (%)</SelectItem>
									<SelectItem value="WEIGHT_BASED">
										Weight Based (kg)
									</SelectItem>
								</SelectContent>
							</Select>
							<FormDescription>
								Choose how you want to apply the discount
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="discountInput"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Discount Value</FormLabel>
							<FormControl>
								<Input
									type="number"
									step="0.01"
									placeholder={
										discountType === "FLAT"
											? "Enter amount in ৳"
											: discountType === "PERCENT"
												? "Enter percentage"
												: "Enter weight reduction in kg"
									}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Sale Summary and Profit/Loss Display */}
			{discountPreview.totalWeight > 0 ? (
				<div className="space-y-3">
					<SaleSummary discountPreview={discountPreview} pricePerKg={pricePerKg} />
					{discountPreview.totalCost > 0 && (
						<ProfitLossDisplay
							profitLoss={discountPreview.profitLoss}
							profitMargin={discountPreview.profitMargin}
						/>
					)}
				</div>
			) : (
				<Alert>
					<AlertDescription>
						Select animals to see the sale summary
					</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
