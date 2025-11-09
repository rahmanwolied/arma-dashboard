/**
 * Batch Costs Form - Step 3
 * Collects shared costs: transport, hasil fee, and miscellaneous
 */

"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
	batchCostsSchema,
	type BatchCostsFormValues,
	type CompleteBatchPurchaseFormValues,
} from "../validations/batch-purchase-schema";
import type { BatchPurchaseData } from "../types";

interface BatchCostsFormProps {
	form: UseFormReturn<CompleteBatchPurchaseFormValues>;
	onNext: () => void;
	onBack: () => void;
	onClose: () => void;
}

const currencyFormatter = new Intl.NumberFormat("en-IN");

export function BatchCostsForm({
	form,
	onNext,
	onBack,
	onClose,
}: BatchCostsFormProps) {
	const { transportCost, hasilFee, miscCost, numberOfCattle } = form.watch();

	const totalSharedCost =
		(Number.parseFloat(transportCost) || 0) +
		(Number.parseFloat(hasilFee) || 0) +
		(Number.parseFloat(miscCost) || 0);

	const perHeadShare = totalSharedCost / Number(numberOfCattle);

	const handleSubmit = () => {
		onNext();
	};

	return (
		<div className="mx-auto max-w-[800px] p-4 md:p-8">
			<Card>
				<CardHeader className="border-b">
					<div className="flex items-center justify-between">
						<CardTitle>
							BATCH COSTS - {form.getValues("purchaseDate")} Purchase
						</CardTitle>
						<div className="flex items-center gap-3">
							<Button variant="ghost" onClick={onBack}>
								← Back
							</Button>
							<Button variant="ghost" size="icon" onClick={onClose}>
								<X className="w-5 h-5" />
							</Button>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					<h2 className="text-base font-semibold mb-6">
						📦 Shared Costs for {numberOfCattle} Cattle
					</h2>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-5"
						>
							<FormField
								control={form.control}
								name="transportCost"
								render={({ field }) => (
									<FormItem>
										<FormLabel>🚚 Transport Cost (Total)</FormLabel>
										<FormControl>
											<div className="flex items-center">
												<Input
													type="number"
													min="0"
													step="0.01"
													className="w-[180px] text-right rounded-r-none"
													{...field}
												/>
												<span className="flex h-10 w-[50px] items-center justify-center rounded-r-md border border-l-0 bg-muted text-sm font-medium">
													৳
												</span>
											</div>
										</FormControl>
										<FormDescription>
											Total transportation cost for all cattle
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="hasilFee"
								render={({ field }) => (
									<FormItem>
										<FormLabel>🧾 Hasil (Market Fee)</FormLabel>
										<FormControl>
											<div className="flex items-center">
												<Input
													type="number"
													min="0"
													step="0.01"
													className="w-[180px] text-right rounded-r-none"
													{...field}
												/>
												<span className="flex h-10 w-[50px] items-center justify-center rounded-r-md border border-l-0 bg-muted text-sm font-medium">
													৳
												</span>
											</div>
										</FormControl>
										<FormDescription>
											Market fee charged by the vendor
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="miscCost"
								render={({ field }) => (
									<FormItem>
										<FormLabel>🔧 Miscellaneous Costs</FormLabel>
										<FormControl>
											<div className="flex items-center">
												<Input
													type="number"
													min="0"
													step="0.01"
													className="w-[180px] text-right rounded-r-none"
													{...field}
												/>
												<span className="flex h-10 w-[50px] items-center justify-center rounded-r-md border border-l-0 bg-muted text-sm font-medium">
													৳
												</span>
											</div>
										</FormControl>
										<FormDescription>
											Any other costs associated with purchase
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="my-5 h-px w-full border-t border-dashed" />

							<div className="flex justify-between items-center">
								<span className="text-base font-semibold">
									💰 Total Batch Costs:
								</span>
								<span className="text-lg font-bold">
									{currencyFormatter.format(totalSharedCost)} ৳
								</span>
							</div>
						</form>
					</Form>
				</CardContent>

				<CardContent>
					<div className="rounded-md border border-l-4 border-l-emerald-800 bg-emerald-950 p-6">
						<h3 className="text-sm font-bold tracking-wider mb-5 text-emerald-600">
							📊 COST DISTRIBUTION PREVIEW
						</h3>

						<div className="bg-background border rounded-md px-4 py-3 mb-5 text-gray-800">
							<span className="text-sm text-white">
								Per Cattle Share: ৳{currencyFormatter.format(totalSharedCost)} ÷{" "}
								{numberOfCattle} ={" "}
							</span>
							<span className="text-sm font-bold text-white">
								{currencyFormatter.format(Math.round(perHeadShare))} ৳ per head
							</span>
						</div>
					</div>
				</CardContent>

				<CardFooter className="border-t justify-between">
					<Button variant="outline" onClick={onBack}>
						← Back to Edit Details
					</Button>
					<Button onClick={form.handleSubmit(handleSubmit)}>
						Review & Save →
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
