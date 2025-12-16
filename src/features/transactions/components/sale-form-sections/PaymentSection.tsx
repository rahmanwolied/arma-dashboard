/**
 * Payment Section
 * Handles payment methods, amounts, terms, and remarks
 */

import { CreditCard, Plus } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PaymentRow } from "./PaymentRow";
import { PaymentSummary } from "./PaymentSummary";
import type { PaymentSectionProps } from "./types";

export function PaymentSection({
	form,
	discountPreview,
	amountPaid,
}: PaymentSectionProps) {
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "payments",
	});

	const handleAddPayment = () => {
		const remainingAmount = discountPreview.finalAmount - amountPaid;
		append({
			paymentMethod: "CASH",
			paidAmount: remainingAmount > 0 ? remainingAmount : 0,
		});
	};

	return (
		<div className="space-y-4 rounded-lg border bg-accent p-4">
			<div className="flex items-center justify-between">
				<h3 className="flex items-center gap-2 text-lg font-semibold">
					<CreditCard className="h-5 w-5" />
					Payment Methods
				</h3>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={handleAddPayment}
					className="flex items-center gap-1"
				>
					<Plus className="h-4 w-4" />
					Add Payment
				</Button>
			</div>

			{/* Payment Rows */}
			<div className="space-y-3">
				{fields.length === 0 ? (
					<Alert>
						<AlertDescription>
							No payments added. Click &ldquo;Add Payment&rdquo; to add a
							payment method, or leave empty for full credit sale.
						</AlertDescription>
					</Alert>
				) : (
					fields.map((field, index) => (
						<PaymentRow
							key={field.id}
							control={form.control}
							index={index}
							onRemove={remove}
						/>
					))
				)}
			</div>

			{/* Payment Summary */}
			{discountPreview.totalWeight > 0 && (
				<PaymentSummary
					finalAmount={discountPreview.finalAmount}
					amountPaid={amountPaid}
					dueAmount={discountPreview.dueAmount}
					hasDue={discountPreview.hasDue}
					hasOverpayment={discountPreview.hasOverpayment}
				/>
			)}

			{/* Payment Terms */}
			<FormField
				control={form.control}
				name="paymentTerms"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Payment Terms (Optional)</FormLabel>
						<FormControl>
							<Input placeholder="e.g., Net 30, Due on delivery" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* Remarks */}
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
	);
}
