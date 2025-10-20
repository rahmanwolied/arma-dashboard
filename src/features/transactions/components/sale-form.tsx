"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { saleSchema, type SaleFormData } from "../schemas/sale-schema";
import { createSale } from "../actions";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import CustomerSearchField from "./transaction-form/customer-search-bar";
import CattleSearchField from "./transaction-form/cattle-search-field";
import {
	ShoppingCart,
	DollarSign,
	Percent,
	CreditCard,
	Calendar,
	Receipt,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMemo } from "react";

export default function SaleForm({
	initialData,
	pageTitle,
}: {
	initialData: SaleFormData | null;
	pageTitle: string;
}) {
	const defaultValues: Partial<SaleFormData> = {
		customer: {
			name: initialData?.customer?.name || "",
			phone: initialData?.customer?.phone || "",
			email: initialData?.customer?.email || "",
			id: initialData?.customer?.id,
		},
		animals: initialData?.animals || [],
		pricePerKg: initialData?.pricePerKg || 0,
		saleDate: initialData?.saleDate || new Date(),
		discountType: initialData?.discountType,
		discountInput: initialData?.discountInput,
		paymentMethod: initialData?.paymentMethod || "CASH",
		amountPaid: initialData?.amountPaid || 0,
		paymentTerms: initialData?.paymentTerms || "",
		remarks: initialData?.remarks || "",
	};

	const form = useForm<SaleFormData>({
		resolver: zodResolver(saleSchema),
		defaultValues,
	});

	// Watch form values for discount calculation
	const animals = form.watch("animals") || [];
	const pricePerKg = form.watch("pricePerKg") || 0;
	const discountType = form.watch("discountType");
	const discountInput = form.watch("discountInput") || 0;

	// Calculate discount preview in real-time
	const discountPreview = useMemo(() => {
		const totalWeight = animals.reduce((sum, a) => sum + a.liveWeight, 0);
		const totalAmount = totalWeight * pricePerKg;
		let discountAmount = 0;

		if (discountType === "FLAT") {
			discountAmount = discountInput;
		} else if (discountType === "PERCENT") {
			discountAmount = Math.round((totalAmount * discountInput) / 100);
		} else if (discountType === "WEIGHT_BASED") {
			discountAmount = Math.round(pricePerKg * discountInput);
		}

		return {
			totalWeight,
			totalAmount,
			discountAmount,
			finalAmount: totalAmount - discountAmount,
		};
	}, [animals, pricePerKg, discountType, discountInput]);

	async function onSubmit(values: SaleFormData) {
		const result = await createSale(values);
		if (result.success) {
			console.log("Sale created successfully", result.data);
			// TODO: Redirect to sales list or show success toast
		} else {
			console.error("Failed to create sale:", result.message);
			// TODO: Show error toast
		}
	}

	return (
		<Card className="mx-auto w-full max-w-4xl">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-left text-2xl font-bold">
					<ShoppingCart className="h-6 w-6" />
					{pageTitle}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						{/* Customer Info Section */}
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
										<FormLabel>Customer</FormLabel>
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

						{/* Animals Selection Section */}
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
											Search and select one or more animals to include in this
											sale
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Sale Details Section */}
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

						{/* Discount Section */}
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
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select discount type" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="FLAT">Flat Amount (৳)</SelectItem>
													<SelectItem value="PERCENT">
														Percentage (%)
													</SelectItem>
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
														form.watch("discountType") === "FLAT"
															? "Enter amount in ৳"
															: form.watch("discountType") === "PERCENT"
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

							{/* Dynamic Discount Display */}
							{discountPreview.totalWeight > 0 && (
								<div className="rounded-lg border bg-background p-4 shadow-sm">
									<h4 className="mb-3 font-medium text-sm">Sale Summary</h4>
									<div className="grid grid-cols-2 gap-3 text-sm">
										<div className="text-muted-foreground">Total Weight:</div>
										<div className="font-medium text-right">
											{discountPreview.totalWeight.toFixed(2)} kg
										</div>
										<div className="text-muted-foreground">Price per KG:</div>
										<div className="font-medium text-right">
											৳{form.watch("pricePerKg")?.toLocaleString() || 0}
										</div>
										<div className="text-muted-foreground">Subtotal:</div>
										<div className="font-medium text-right">
											৳{discountPreview.totalAmount.toLocaleString()}
										</div>
										{discountPreview.discountAmount > 0 && (
											<>
												<div className="text-muted-foreground">Discount:</div>
												<div className="font-medium text-red-600 text-right">
													-৳{discountPreview.discountAmount.toLocaleString()}
												</div>
											</>
										)}
										<Separator className="col-span-2" />
										<div className="font-semibold">Final Amount:</div>
										<div className="font-bold text-green-600 text-right text-lg">
											৳{discountPreview.finalAmount.toLocaleString()}
										</div>
									</div>
								</div>
							)}

							{discountPreview.totalWeight === 0 && (
								<Alert>
									<AlertDescription>
										Select animals to see the sale summary
									</AlertDescription>
								</Alert>
							)}
						</div>

						{/* Payment Section */}
						<div className="space-y-4 rounded-lg border bg-accent p-4">
							<h3 className="flex items-center gap-2 text-lg font-semibold">
								<CreditCard className="h-5 w-5" />
								Payment
							</h3>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2">
								<FormField
									control={form.control}
									name="paymentMethod"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Payment Method</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select payment method" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="CASH">Cash</SelectItem>
													<SelectItem value="CREDIT_CARD">
														Credit Card
													</SelectItem>
													<SelectItem value="BANK_TRANSFER">
														Bank Transfer
													</SelectItem>
													<SelectItem value="MOBILE_MONEY">
														Mobile Money
													</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="amountPaid"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Amount Paid (৳)</FormLabel>
											<FormControl>
												<Input
													type="number"
													step="0.01"
													placeholder="Enter amount paid"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Amount received from customer
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="paymentTerms"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Payment Terms (Optional)</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g., Net 30, Due on delivery"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="remarks"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Remarks (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="Any additional notes" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Separator />

						<div className="flex items-center justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => form.reset()}
							>
								Reset
							</Button>
							<Button
								type="submit"
								disabled={form.formState.isSubmitting}
								className="min-w-[150px]"
							>
								{form.formState.isSubmitting
									? "Creating Sale..."
									: "Create Sale"}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
