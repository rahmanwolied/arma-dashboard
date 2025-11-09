/**
 * Purchase Setup Form - Step 1
 * Collects basic purchase information: date, market, and number of cattle
 */

"use client";

import type { UseFormReturn } from "react-hook-form";
import { X } from "lucide-react";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { CompleteBatchPurchaseFormValues } from "../validations/batch-purchase-schema";
import { MarketSearchField, type MarketValue } from "./market-search";

interface PurchaseSetupFormProps {
	// onNext: (data: PurchaseSetupFormValues) => void | Promise<void>;
	form: UseFormReturn<CompleteBatchPurchaseFormValues>;
	onNext: () => void;
}

export function PurchaseSetupForm({ form, onNext }: PurchaseSetupFormProps) {
	const isFormValid = !!(
		form.watch().purchaseDate &&
		form.watch().marketValue?.name &&
		form.watch().numberOfCattle
	);

	const onMarketValueChange = (value: MarketValue) => {
		form.setValue("marketValue", value);
	};
	return (
		<div className="fixed inset-0 not-visited:flex items-center justify-center p-4">
			<Card className="w-[540px]">
				<CardHeader className="border-b">
					<div className="flex items-center justify-between">
						<CardTitle className="text-xl">New Cattle Purchase</CardTitle>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => window.history.back()}
						>
							<X className="w-5 h-5" />
						</Button>
					</div>
				</CardHeader>

				<Form {...form}>
					<form onSubmit={(e) => e.preventDefault()}>
						<CardContent className="space-y-4">
							{/* Purchase Date */}
							<FormField
								control={form.control}
								name="purchaseDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Purchase Date <span className="text-destructive">*</span>
										</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="DD/MM/YYYY"
												onFocus={(e) => (e.target.type = "date")}
												{...field}
												onBlur={(e) => {
													e.target.type = "text";
													// Convert date input to DD/MM/YYYY format
													if (e.target.value.includes("-")) {
														const [year, month, day] =
															e.target.value.split("-");
														field.onChange(`${day}/${month}/${year}`);
													}
												}}
											/>
										</FormControl>
										<FormDescription>Auto-filled with today</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Market Name */}
							<FormField
								control={form.control}
								name="marketValue"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Market Name <span className="text-destructive">*</span>
										</FormLabel>
										<FormControl>
											<MarketSearchField
												value={field.value}
												onChange={onMarketValueChange}
												placeholder="Select or create market"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Number of Cattle */}
							<FormField
								control={form.control}
								name="numberOfCattle"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Number of Cattle{" "}
											<span className="text-destructive">*</span>
										</FormLabel>
										<FormControl>
											<div className="flex items-center gap-3">
												<Input
													type="number"
													min="1"
													placeholder="0"
													className="w-[120px]"
													{...field}
												/>
												<span className="text-sm text-muted-foreground">
													cattle
												</span>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>

						<CardFooter className="border-t justify-between gap-3 mt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => window.history.back()}
							>
								Cancel
							</Button>
							<Button type="button" onClick={onNext} disabled={!isFormValid}>
								Next: Enter Details →
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	);
}
