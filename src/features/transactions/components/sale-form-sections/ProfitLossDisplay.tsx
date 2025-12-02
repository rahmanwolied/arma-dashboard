/**
 * Profit/Loss Display Component
 * Shows estimated profit or loss with visual indicators
 */

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfitLossDisplayProps } from "./types";

export function ProfitLossDisplay({
	profitLoss,
	profitMargin,
}: ProfitLossDisplayProps) {
	const isProfit = profitLoss >= 0;

	return (
		<div
			className={cn(
				"rounded-lg border p-4 shadow-sm",
				isProfit
					? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
					: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950",
			)}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{isProfit ? (
						<TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
					) : (
						<TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
					)}
					<div>
						<h4
							className={cn(
								"font-semibold text-sm",
								isProfit
									? "text-green-700 dark:text-green-300"
									: "text-red-700 dark:text-red-300",
							)}
						>
							{isProfit ? "Estimated Profit" : "Estimated Loss"}
						</h4>
						<p className="text-muted-foreground text-xs">
							Based on adjusted cattle costs
						</p>
					</div>
				</div>
				<div className="text-right">
					<div
						className={cn(
							"font-bold text-2xl",
							isProfit
								? "text-green-600 dark:text-green-400"
								: "text-red-600 dark:text-red-400",
						)}
					>
						{isProfit ? "+" : ""}৳{Math.abs(profitLoss).toLocaleString()}
					</div>
					<div
						className={cn(
							"font-medium text-sm",
							isProfit
								? "text-green-600 dark:text-green-400"
								: "text-red-600 dark:text-red-400",
						)}
					>
						{profitMargin >= 0 ? "+" : ""}
						{profitMargin.toFixed(2)}% margin
					</div>
				</div>
			</div>
		</div>
	);
}
