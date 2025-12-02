/**
 * Sale Summary Component
 * Displays cost and revenue breakdown
 */

import { Receipt } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { SaleSummaryProps } from "./types";

export function SaleSummary({ discountPreview, pricePerKg }: SaleSummaryProps) {
	return (
		<div className="rounded-lg border bg-background p-4 shadow-sm">
			<h4 className="mb-3 flex items-center gap-2 font-medium text-sm">
				<Receipt className="h-4 w-4" />
				Cost & Revenue Breakdown
			</h4>
			<div className="grid grid-cols-2 gap-3 text-sm">
				<div className="text-muted-foreground">Total Weight:</div>
				<div className="font-medium text-right">
					{discountPreview.totalWeight.toFixed(2)} kg
				</div>
				<div className="text-muted-foreground">Price per KG:</div>
				<div className="font-medium text-right">
					৳{pricePerKg?.toLocaleString() || 0}
				</div>
				<div className="text-muted-foreground">Subtotal (Revenue):</div>
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
				<div className="font-bold text-right text-lg">
					৳{discountPreview.finalAmount.toLocaleString()}
				</div>
				{discountPreview.totalCost > 0 && (
					<>
						<div className="text-muted-foreground">Total Cost (Adjusted):</div>
						<div className="font-medium text-amber-600 text-right">
							৳{discountPreview.totalCost.toLocaleString()}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
