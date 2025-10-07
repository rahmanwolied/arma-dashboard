"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
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

export default function SaleForm({
	initialData,
	pageTitle,
}: {
	initialData: any | null;
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
				<CardTitle className="text-left text-2xl font-bold">
					{pageTitle}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Customer Info Section */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Customer Information</h3>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="customer.name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Customer Name</FormLabel>
											<FormControl>
												<Input placeholder="Enter customer name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="customer.phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone</FormLabel>
											<FormControl>
												<Input placeholder="Enter phone" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Sale Details Section */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Sale Details</h3>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="pricePerKg"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price per KG (BDT)</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Enter price"
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
											<FormLabel>Sale Date</FormLabel>
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
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Discount (Optional)</h3>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
													<SelectItem value="FLAT">Flat Amount</SelectItem>
													<SelectItem value="PERCENT">Percentage</SelectItem>
													<SelectItem value="WEIGHT_BASED">
														Weight Based
													</SelectItem>
												</SelectContent>
											</Select>
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
													placeholder="Enter discount value"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Payment Section */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Payment</h3>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
											<FormLabel>Amount Paid (BDT)</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Enter amount paid"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<Button type="submit" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? "Submitting..." : "Create Sale"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
