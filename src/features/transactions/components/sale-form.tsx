"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { saleSchema, type SaleFormData } from "../validations/sale-schema";
import { createSaleAction } from "../actions/create-sale";
import { calculateSalePreview } from "../helpers/calculations";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useMemo, useState } from "react";
import {
	CustomerInfoSection,
	AnimalsSelectionSection,
	SaleDetailsSection,
	DiscountSection,
	PaymentSection,
} from "./sale-form-sections";

interface SaleFormProps {
	initialData: SaleFormData | null;
	pageTitle: string;
}

export default function SaleForm({ initialData, pageTitle }: SaleFormProps) {
	const defaultValues: Partial<SaleFormData> = {
		customer: {
			name: initialData?.customer?.name || "",
			phone: initialData?.customer?.phone || "",
			email: initialData?.customer?.email || "",
			id: initialData?.customer?.id,
			address: initialData?.customer?.address,
			isNew: initialData?.customer?.isNew,
		},
		animals: initialData?.animals || [],
		// Pricing mode fields
		pricingMode: initialData?.pricingMode || "PER_KG",
		perKgMode: initialData?.perKgMode || "SAME_RATE",
		pricePerKg: initialData?.pricePerKg,
		fixedPriceMode: initialData?.fixedPriceMode,
		totalFixedPrice: initialData?.totalFixedPrice,
		// Other fields
		saleDate: initialData?.saleDate || new Date(),
		discountType: initialData?.discountType,
		discountInput: initialData?.discountInput,
		payments: initialData?.payments || [],
		paymentTerms: initialData?.paymentTerms || "",
		remarks: initialData?.remarks || "",
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
		defaultValue: defaultValues.payments || [],
	});

	// Calculate total amount paid from all payments
	const amountPaid = useMemo(() => {
		const payments = paymentsWatch || [];
		return payments.reduce(
			(sum, payment) => sum + (Number(payment.paidAmount) || 0),
			0,
		);
	}, [paymentsWatch]);

	// Calculate sale preview in real-time with the new pricing system
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
			const result = await createSaleAction(values);
			if (result.success) {
				toast.success("Sale created successfully!");
				form.reset();
				// TODO: Redirect to sales list
			} else {
				console.error("Failed to create sale:", result.message);
				toast.error(result.message || "Failed to create sale");
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
					<ShoppingCart className="h-6 w-6" />
					{pageTitle}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<CustomerInfoSection form={form} />
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
								onClick={() => form.reset()}
								disabled={isSubmitting}
							>
								Reset
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="min-w-[150px]"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating Sale...
									</>
								) : (
									"Create Sale"
								)}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
