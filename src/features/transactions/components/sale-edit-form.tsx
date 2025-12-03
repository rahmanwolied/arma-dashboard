"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { saleSchema, type SaleFormData } from "../validations/sale-schema";
import { updateSaleAction } from "../actions/update-sale";
import { calculateSalePreview } from "../helpers/calculations";
import { Pencil, Loader2, User, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
	AnimalsSelectionSection,
	SaleDetailsSection,
	DiscountSection,
	PaymentSection,
} from "./sale-form-sections";
import type { SaleDetailData } from "../types";

interface SaleEditFormProps {
	saleId: string;
	initialData: SaleDetailData;
}

export default function SaleEditForm({
	saleId,
	initialData,
}: SaleEditFormProps) {
	const router = useRouter();

	// For edit page, always use FLAT discount with the stored discount amount
	// This converts any original discount type (PERCENT, WEIGHT_BASED) to a flat amount
	const storedDiscountAmount = initialData.storedAmounts?.discountAmount || 0;

	const defaultValues: Partial<SaleFormData> = {
		customer: {
			name: initialData.customer.name,
			phone: initialData.customer.phone,
			email: initialData.customer.email || "",
			id: initialData.customer.id,
			address: initialData.customer.address,
			isNew: false,
		},
		animals: initialData.animals || [],
		// Pricing mode fields
		pricingMode: initialData.pricingMode || "PER_KG",
		perKgMode: initialData.perKgMode || "SAME_RATE",
		pricePerKg: initialData.pricePerKg,
		fixedPriceMode: initialData.fixedPriceMode,
		totalFixedPrice: initialData.totalFixedPrice,
		// Other fields
		saleDate: initialData.saleDate || new Date(),
		// Always use FLAT discount type on edit page
		discountType: storedDiscountAmount > 0 ? "FLAT" : undefined,
		// Use the stored discount amount (already calculated flat amount)
		discountInput: storedDiscountAmount > 0 ? storedDiscountAmount : undefined,
		payments: initialData.payments || [],
		paymentTerms: initialData.paymentTerms || "",
		remarks: initialData.remarks || "",
	};

	const form = useForm<SaleFormData>({
		resolver: zodResolver(saleSchema),
		defaultValues,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	// Watch form values for real-time calculations
	const animalsWatch = form.watch("animals");
	const discountType = form.watch("discountType");
	const discountInput = form.watch("discountInput") || 0;

	// Watch pricing mode fields
	const pricingMode = form.watch("pricingMode");
	const perKgMode = form.watch("perKgMode");
	const pricePerKg = form.watch("pricePerKg");
	const fixedPriceMode = form.watch("fixedPriceMode");
	const totalFixedPrice = form.watch("totalFixedPrice");

	// Use useWatch for payments to ensure real-time updates when typing
	const paymentsWatch = useWatch({
		control: form.control,
		name: "payments",
		defaultValue: [],
	});

	// Calculate total amount paid from all payments
	const amountPaid = useMemo(() => {
		const payments = paymentsWatch || [];
		return payments.reduce(
			(sum, payment) => sum + (Number(payment.paidAmount) || 0),
			0,
		);
	}, [paymentsWatch]);

	// Calculate discount preview in real-time with the new pricing system
	const discountPreview = useMemo(
		() =>
			calculateSalePreview(
				animalsWatch,
				{
					pricingMode: pricingMode || "PER_KG",
					perKgMode: perKgMode || "SAME_RATE",
					pricePerKg,
					fixedPriceMode,
					totalFixedPrice,
				},
				discountType,
				discountInput,
				amountPaid,
			),
		[
			animalsWatch,
			pricingMode,
			perKgMode,
			pricePerKg,
			fixedPriceMode,
			totalFixedPrice,
			discountType,
			discountInput,
			amountPaid,
		],
	);

	async function onSubmit(values: SaleFormData) {
		setIsSubmitting(true);
		try {
			const result = await updateSaleAction(saleId, values);
			if (result.success) {
				toast.success("Sale updated successfully!");
				router.push(`/dashboard/transactions/${saleId}`);
			} else {
				console.error("Failed to update sale:", result.message);
				toast.error(result.message || "Failed to update sale");
			}
		} catch (error) {
			console.error("Unexpected error:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Card className="mx-auto w-full max-w-4xl">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-left text-2xl font-bold">
					<Pencil className="h-6 w-6" />
					Edit Sale
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						{/* Read-only Customer Information */}
						<CustomerInfoReadOnly customer={initialData.customer} />

						<AnimalsSelectionSection form={form} />
						<SaleDetailsSection form={form} />
						<DiscountSection form={form} discountPreview={discountPreview} />
						<PaymentSection
							form={form}
							discountPreview={discountPreview}
							amountPaid={amountPaid}
						/>

						<Separator />

						<div className="flex items-center justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => router.back()}
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="min-w-[150px]"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Updating Sale...
									</>
								) : (
									"Update Sale"
								)}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

/**
 * Read-only display of customer information
 */
function CustomerInfoReadOnly({
	customer,
}: { customer: SaleDetailData["customer"] }) {
	return (
		<div className="space-y-4 rounded-lg border bg-muted/50 p-4">
			<div className="flex items-center justify-between">
				<h3 className="flex items-center gap-2 font-semibold text-lg">
					<User className="h-5 w-5" />
					Customer Information
				</h3>
				<span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
					Read-only
				</span>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="flex items-center gap-3">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
						<User className="h-4 w-4 text-primary" />
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Name</p>
						<p className="font-medium">{customer.name}</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
						<Phone className="h-4 w-4 text-blue-500" />
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Phone</p>
						<p className="font-medium">{customer.phone}</p>
					</div>
				</div>

				{customer.email && (
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/10">
							<Mail className="h-4 w-4 text-violet-500" />
						</div>
						<div>
							<p className="text-xs text-muted-foreground">Email</p>
							<p className="font-medium">{customer.email}</p>
						</div>
					</div>
				)}

				{customer.address && (
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
							<MapPin className="h-4 w-4 text-emerald-500" />
						</div>
						<div>
							<p className="text-xs text-muted-foreground">Address</p>
							<p className="font-medium text-sm">
								{[
									customer.address.addressLine,
									customer.address.zoneName,
									customer.address.districtName,
									customer.address.divisionName,
								]
									.filter(Boolean)
									.join(", ")}
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
