/**
 * Review Purchase - Step 4
 * Final review before submission with loading state
 */

"use client";

import { Loader2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { CompleteBatchPurchaseFormValues } from "../validations/batch-purchase-schema";
import type { UseFormReturn } from "react-hook-form";

interface ReviewPurchaseProps {
	form: UseFormReturn<CompleteBatchPurchaseFormValues>;
	onConfirm: () => void;
	onBack: () => void;
	onEditDetails: () => void;
	onCancel: () => void;
	isSubmitting?: boolean;
}

const currencyFormatter = new Intl.NumberFormat("en-IN");

const dateFormatter = (dateStr: string) => {
	const [day, month, year] = dateStr.split("/");
	const date = new Date(`${year}-${month}-${day}`);
	return date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

export function ReviewPurchase({
	form,
	onConfirm,
	onBack,
	onEditDetails,
	onCancel,
	isSubmitting = false,
}: ReviewPurchaseProps) {
	const {
		cattle,
		purchaseDate,
		numberOfCattle,
		transportCost,
		hasilFee,
		miscCost,
		marketValue: { name: marketName, location: marketLocation },
	} = form.watch();

	const totalBasePrice = cattle.reduce(
		(sum, c) => sum + (Number.parseFloat(c.purchasePrice) || 0),
		0,
	);
	const sharedCosts =
		(Number.parseFloat(transportCost) || 0) +
		(Number.parseFloat(hasilFee) || 0) +
		(Number.parseFloat(miscCost) || 0);

	const totalWeight = cattle.reduce(
		(sum, c) => sum + (Number.parseFloat(c.weight || "0") || 0),
		0,
	);
	const perHeadShare = sharedCosts / (Number.parseInt(numberOfCattle, 10) || 1);
	const grandTotal = totalBasePrice + sharedCosts;
	const avgCostPerHead =
		grandTotal / (Number.parseInt(numberOfCattle, 10) || 1);
	const avgCostPerKg = grandTotal / totalWeight;
	return (
		<div className="p-4 md:p-8 mx-auto">
			<Card>
				<CardHeader className="border-b">
					<div className="flex items-center justify-between">
						<CardTitle>REVIEW PURCHASE - {purchaseDate}</CardTitle>
						<div className="flex items-center gap-3">
							<Button variant="ghost" onClick={onBack} disabled={isSubmitting}>
								← Back
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={onCancel}
								disabled={isSubmitting}
							>
								<X className="w-5 h-5" />
							</Button>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					<div className="flex flex-wrap md:flex-nowrap gap-6">
						{/* Purchase Summary */}
						<Card className="w-full md:w-1/2">
							<CardHeader>
								<CardTitle className="text-base">📋 Purchase Summary</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-3 text-sm">
									<SummaryItem
										label="Date:"
										value={dateFormatter(purchaseDate)}
									/>
									<SummaryItem
										label="Market:"
										value={`${marketName}, ${marketLocation}`}
									/>
									<SummaryItem
										label="Total Cattle:"
										value={`${numberOfCattle} cattle`}
									/>
									<SummaryItem
										label="Total Weight:"
										value={`${totalWeight} kg`}
									/>
								</ul>
							</CardContent>
						</Card>

						{/* Financial Summary */}
						<Card className="w-full md:w-1/2">
							<CardHeader>
								<CardTitle className="text-base">
									💰 Financial Summary
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="bg-accent/50 rounded p-4 text-sm space-y-2">
									<FinancialItem
										label="Total Purchase Value:"
										value={totalBasePrice}
										helper="← Sum of base prices"
									/>
									<FinancialItem
										label="+ Transport:"
										value={Number.parseFloat(transportCost) || 0}
									/>
									<FinancialItem
										label="+ Hasil:"
										value={Number.parseFloat(hasilFee) || 0}
									/>
									<FinancialItem
										label="+ Miscellaneous:"
										value={Number.parseFloat(miscCost) || 0}
									/>
									<div className="my-2 h-px w-full border-t border-dashed" />
									<div className="!mt-3 bg-green-50 border border-green-200 rounded -mx-2 px-3 py-2.5 flex justify-between items-center">
										<span className="text-base font-bold text-green-900">
											Grand Total Investment:
										</span>
										<span className="text-base font-bold text-green-900">
											{currencyFormatter.format(grandTotal)} ৳
										</span>
									</div>
									<div className="!mt-3 pt-2 flex justify-between items-center text-sm font-medium text-muted-foreground">
										<span>Average Cost per cattle:</span>
										<span>
											{currencyFormatter.format(Math.round(avgCostPerHead))} ৳
										</span>
									</div>
									<div className="!mt-3 pt-2 flex justify-between items-center text-sm font-medium text-muted-foreground">
										<span>Average Cost per kg:</span>
										<span>
											{currencyFormatter.format(Math.round(avgCostPerKg))} ৳
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Individual Cattle Table */}
					<Card className="mt-6">
						<CardHeader>
							<div className="flex justify-between items-center">
								<CardTitle className="text-base">
									📊 Individual Cattle (showing 5 of {numberOfCattle})
								</CardTitle>
								<button className="text-sm font-medium text-blue-600 hover:underline">
									[View All ▼]
								</button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="overflow-x-auto">
								<table className="w-full border-collapse">
									<thead>
										<tr className="bg-accent border-b-2 text-xs font-semibold uppercase tracking-wider">
											<th className="p-2.5 text-left">Tag</th>
											<th className="p-2.5 text-left">Weight</th>
											<th className="p-2.5 text-left">Actual Price</th>
											<th className="p-2.5 text-left">Adjusted Price</th>
											<th className="p-2.5 text-left">Adjusted Price / kg</th>
											<th className="p-2.5 text-center">✓</th>
										</tr>
									</thead>
									<tbody>
										{cattle.slice(0, 5).map((c) => (
											<tr
												key={c.id}
												className="border-b text-sm hover:bg-accent/50"
											>
												<td className="p-3">{c.tagNo}</td>
												<td className="p-3">
													{c.weight ? `${c.weight}kg` : "-"}
												</td>
												<td className="p-3">
													{currencyFormatter.format(
														Number.parseFloat(c.purchasePrice) || 0,
													)}{" "}
													৳
												</td>
												{/* <td className="p-3 text-muted-foreground">
													{currencyFormatter.format(Math.round(perHeadShare))} ৳
												</td> */}
												<td className="p-3 font-semibold">
													{currencyFormatter.format(
														Math.round(
															(Number.parseFloat(c.purchasePrice) || 0) +
																perHeadShare,
														),
													)}{" "}
													৳
												</td>
												<td className="p-3 font-semibold">
													{(
														((Number.parseInt(c.purchasePrice) || 0) +
															perHeadShare) /
														(Number.parseInt(c.weight || "0") || 0)
													).toFixed(0)}{" "}
													{" ৳"}
												</td>
												<td className="p-3 text-center text-green-600">
													<Check className="w-5 h-5 inline-block" />
												</td>
											</tr>
										))}
										{cattle.length > 5 && (
											<tr className="text-muted-foreground">
												<td className="p-3 text-center" colSpan={6}>
													...
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>

					<div className="mt-6 bg-green-900 border border-l-4 border-l-green-500 rounded-md p-3 flex items-center">
						<span className="text-amber-500">⚠️</span>
						<p className="ml-2 text-sm">
							Per cattle share: {currencyFormatter.format(perHeadShare)} ৳
						</p>
					</div>
				</CardContent>

				<CardFooter className="border-t justify-between">
					<Button
						variant="outline"
						onClick={onEditDetails}
						disabled={isSubmitting}
					>
						← Edit Details
					</Button>
					<div className="flex items-center gap-3">
						<Button
							variant="outline"
							onClick={onCancel}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button onClick={onConfirm} disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="w-5 h-5 mr-2 animate-spin" />
									Saving Purchase...
								</>
							) : (
								<>
									<Check className="w-5 h-5 mr-2" />
									Confirm & Save Purchase
								</>
							)}
						</Button>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}

const SummaryItem = ({ label, value }: { label: string; value: string }) => (
	<li className="flex items-center">
		<span className="text-muted-foreground mr-2">•</span>
		<span className="text-muted-foreground w-28">{label}</span>
		<span className="font-medium">{value}</span>
	</li>
);

const FinancialItem = ({
	label,
	value,
	helper,
}: {
	label: string;
	value: number;
	helper?: string;
}) => (
	<div className="flex justify-between items-center">
		<div className="flex items-center">
			<span>{label}</span>
			{helper && (
				<span className="ml-3 text-xs italic text-[#9CA3AF]">{helper}</span>
			)}
		</div>
		<span>{currencyFormatter.format(value)} ৳</span>
	</div>
);
