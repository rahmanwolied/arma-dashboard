"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { UseFormReturn } from "react-hook-form";
import type { CompleteBatchPurchaseFormValues } from "../validations/batch-purchase-schema";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGetTags } from "../hooks/use-get-tags";
import { Skeleton } from "@/components/ui/skeleton";
import { useHandleInput } from "../hooks/use-handle-input";
import { Badge } from "@/components/ui/badge";
import { useCattleInitialization } from "../hooks/use-cattle-initialization";

interface CattleDetailsFormProps {
	form: UseFormReturn<CompleteBatchPurchaseFormValues>;
	onNext: () => void;
	onBack: () => void;
	onClose: () => void;
}

const formatIndianCurrency = (value: string): string => {
	if (!value) return "";
	const num = Number(value);
	if (Number.isNaN(num)) return "";
	return new Intl.NumberFormat("en-IN").format(num);
};

export function CattleDetailsForm({
	form,
	onNext,
	onBack,
	onClose,
}: CattleDetailsFormProps) {
	const [error, setError] = useState("");
	const { inputRefs, handleKeyDown } = useHandleInput(form);
	const { nextTagNumber, isTagNumberLoading } = useGetTags();
	const { handleAddRow } = useCattleInitialization({
		form,
		nextTagNumber: nextTagNumber ?? null,
	});

	const isPriceOutOfRange = (priceStr: string): boolean => {
		if (!priceStr) return false;
		const price = Number.parseFloat(priceStr);
		return price < 10000 || price > 200000;
	};

	return (
		<div className="mx-auto max-w-[1200px] p-4 md:p-8">
			<Card>
				<CardHeader className="border-b">
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center">
							CATTLE PURCHASE - {form.getValues("purchaseDate")} at{" "}
							{form.getValues("marketValue.name")},{" "}
							{form.getValues("marketValue.location")}
							{form.getValues("marketValue.isNew") && (
								<Badge className="ml-2" variant="outline">
									New
								</Badge>
							)}
						</CardTitle>
						<div className="flex items-center gap-3">
							<Button variant="ghost" onClick={onBack}>
								← Back
							</Button>
							<Button variant="ghost" size="icon" onClick={onClose}>
								<X className="h-5 w-5" />
							</Button>
						</div>
					</div>
					<div className="flex items-center justify-between pt-4">
						<p className="text-sm text-muted-foreground">
							📋 Enter details for {form.getValues("numberOfCattle")} cattle
						</p>
					</div>
				</CardHeader>

				<CardContent>
					<div className="overflow-x-auto">
						<Form {...form}>
							<form onSubmit={(e) => e.preventDefault()}>
								<table className="w-full min-w-[480px] border-collapse">
									<thead>
										<tr className="border-b-2 bg-accent">
											<th className="w-[120px] px-3 py-3 text-left text-sm font-semibold">
												🏷️ Tag No.
											</th>
											<th className="w-[160px] px-3 py-3 text-left text-sm font-semibold">
												⚖️ Weight (kg)
											</th>
											<th className="w-[200px] px-3 py-3 text-left text-sm font-semibold">
												💰 Purchase Price (৳)
											</th>
										</tr>
									</thead>
									<tbody>
										{form.watch().cattle.map((cattle, index) => (
											<tr key={cattle.id} className="border-x border-b">
												<td
													className={`p-2  transition-colors ${
														isPriceOutOfRange(cattle.purchasePrice)
															? "border-l-yellow-500 border-l-4"
															: "hover:bg-accent/50"
													}`}
												>
													{isTagNumberLoading ? (
														<Skeleton className="w-full h-8" />
													) : (
														<FormField
															control={form.control}
															name={`cattle.${index}.tagNo`}
															render={({ field }) => (
																<Input
																	type="text"
																	value={field.value}
																	onChange={field.onChange}
																/>
															)}
														/>
													)}
												</td>
												<td className="p-2">
													<FormField
														control={form.control}
														name={`cattle.${index}.weight`}
														render={({ field }) => (
															<Input
																type="number"
																value={field.value}
																onChange={field.onChange}
																onKeyDown={(e) => handleKeyDown(e, index, 0)}
																ref={(el) => {
																	if (inputRefs.current[index])
																		inputRefs.current[index][0] = el;
																}}
																className="w-full rounded border bg-background px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
																placeholder="____"
															/>
														)}
													/>
												</td>
												<td className="p-2">
													<FormField
														control={form.control}
														name={`cattle.${index}.purchasePrice`}
														render={({ field }) => (
															<Input
																type="text"
																value={formatIndianCurrency(field.value || "0")}
																onChange={(e) => {
																	// Remove all non-numeric characters before updating
																	const numericValue = e.target.value.replace(
																		/[^0-9]/g,
																		"",
																	);
																	field.onChange(numericValue);
																}}
																onKeyDown={(e) => handleKeyDown(e, index, 1)}
																ref={(el) => {
																	if (inputRefs.current[index])
																		inputRefs.current[index][1] = el;
																}}
																className="w-full rounded border bg-background px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
																placeholder="____"
															/>
														)}
													/>
												</td>
											</tr>
										))}
										<tr>
											<td colSpan={3} className="p-2">
												<Button variant="outline" onClick={handleAddRow}>
													Add Cattle
												</Button>
											</td>
										</tr>
									</tbody>
								</table>
							</form>
						</Form>
					</div>
				</CardContent>

				{error && (
					<CardFooter>
						<div className="flex items-center rounded-md border border-destructive/50 border-l-4 border-l-destructive bg-destructive/10 p-3 w-full">
							<span className="text-destructive">⚠️</span>
							<p className="ml-2 text-sm text-destructive">{error}</p>
						</div>
					</CardFooter>
				)}

				<CardFooter className="border-t justify-between">
					<Button variant="outline" onClick={onBack}>
						Save Draft
					</Button>
					<div className="flex items-center gap-3">
						<Button variant="outline" onClick={onBack}>
							Cancel
						</Button>
						<Button type="button" onClick={onNext}>
							Next: Batch Costs →
						</Button>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
