/**
 * Payment Summary Component
 * Shows total amounts, paid, and due with visual feedback
 * Handles overpayments (negative due amount)
 */

import { AlertTriangle, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { PaymentSummaryProps } from "./types";

export function PaymentSummary({
	finalAmount,
	amountPaid,
	dueAmount,
	hasDue,
	hasOverpayment,
}: PaymentSummaryProps) {
	const overpaymentAmount = hasOverpayment ? Math.abs(dueAmount) : 0;
	const isFullyPaid = dueAmount === 0;

	return (
		<div className="rounded-lg border bg-background p-4">
			<h4 className="mb-3 font-medium text-sm">Payment Summary</h4>
			<div className="grid grid-cols-2 gap-2 text-sm">
				<div className="text-muted-foreground">Total Sale Amount:</div>
				<div className="font-semibold text-right">
					৳{finalAmount.toLocaleString()}
				</div>
				<div className="text-muted-foreground">Total Paid:</div>
				<div
					className={cn(
						"font-semibold text-right",
						amountPaid >= finalAmount
							? "text-green-600"
							: amountPaid > 0
								? "text-amber-600"
								: "text-muted-foreground",
					)}
				>
					৳{amountPaid.toLocaleString()}
				</div>
				<Separator className="col-span-2 my-1" />

				{/* Show either Amount Due or Overpayment */}
				{hasOverpayment ? (
					<>
						<div className="font-semibold text-blue-600">Overpayment:</div>
						<div className="font-bold text-right text-blue-600">
							৳{overpaymentAmount.toLocaleString()}
						</div>
					</>
				) : (
					<>
						<div className="font-semibold">Amount Due:</div>
						<div
							className={cn(
								"font-bold text-right",
								dueAmount > 0 ? "text-amber-600" : "text-green-600",
							)}
						>
							৳{dueAmount.toLocaleString()}
							{isFullyPaid && " ✓"}
						</div>
					</>
				)}
			</div>

			{/* Credit sale warning */}
			{hasDue && (
				<div className="mt-3 flex items-center gap-2 rounded-md bg-amber-50 p-2 text-amber-700 text-xs dark:bg-amber-950 dark:text-amber-400">
					<AlertTriangle className="h-4 w-4" />
					<span>
						This is a credit sale. Payment terms can be specified below.
					</span>
				</div>
			)}

			{/* Overpayment notice */}
			{hasOverpayment && (
				<div className="mt-3 flex items-center gap-2 rounded-md bg-blue-50 p-2 text-blue-700 text-xs dark:bg-blue-950 dark:text-blue-400">
					<Info className="h-4 w-4" />
					<span>
						Customer has overpaid by ৳{overpaymentAmount.toLocaleString()}. This will be recorded as credit.
					</span>
				</div>
			)}
		</div>
	);
}
