/**
 * Payment Row Component
 * Individual payment method and amount input row
 */

import { X } from "lucide-react";
import {
	FormControl,
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
import { Button } from "@/components/ui/button";
import type { PaymentRowProps } from "./types";

export function PaymentRow({ control, index, onRemove }: PaymentRowProps) {
	return (
		<div className="flex items-end gap-3 rounded-sm border p-3">
			<div className="flex-1">
				<FormField
					control={control}
					name={`payments.${index}.paymentMethod`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Payment Method</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select method" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="CASH">Cash</SelectItem>
									<SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
									<SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
									<SelectItem value="MOBILE_MONEY">Bkash</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className="flex-1">
				<FormField
					control={control}
					name={`payments.${index}.paidAmount`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Amount (৳)</FormLabel>
							<FormControl>
								<Input
									type="text"
									inputMode="decimal"
									placeholder="0.00"
									value={field.value ? field.value.toLocaleString() : ""}
									onChange={(e) => {
										// Remove commas and parse the number
										const rawValue = e.target.value.replace(/,/g, "");
										const numValue = Number.parseFloat(rawValue);

										// Update the field with the numeric value
										if (!Number.isNaN(numValue)) {
											field.onChange(numValue);
										} else if (rawValue === "" || rawValue === ".") {
											field.onChange(0);
										}
									}}
									onBlur={field.onBlur}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<Button
				type="button"
				variant="outline"
				size="icon"
				onClick={() => onRemove(index)}
				className="text-destructive hover:bg-destructive/10"
			>
				<X className="h-4 w-4" />
			</Button>
		</div>
	);
}
