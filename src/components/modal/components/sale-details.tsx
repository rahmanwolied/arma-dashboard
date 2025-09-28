import type { CattleWithDetails } from "@/app/_lib/queries/cattle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface SaleDetailsProps {
	data: CattleWithDetails;
}

export const SaleDetails: React.FC<SaleDetailsProps> = ({ data }) => {
	if (!data.sales.length) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Sale Details</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-2 text-sm">
				<div className="flex justify-between">
					<span className="font-medium">Sale Date:</span>
					<span>
						{new Date(
							data.sales[0].sale.saleDate ?? new Date(0),
						).toDateString()}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium">Sale Price/Kg:</span>
					<span>
						{formatCurrency(
							Number(data.sales[0].sale.totalAmount ?? 0) /
								Number(data.latestWeight.weightKg ?? 1),
						)}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium">Weight at Sale:</span>
					<span>{data.latestWeight.weightKg} kg</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium">Meat Percentage:</span>
					<span>{"N/A"}%</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium">Fat Percentage:</span>
					<span>{12}%</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium">Customer Name:</span>
					<span>{"N/A"}</span>
				</div>
			</CardContent>
		</Card>
	);
};
