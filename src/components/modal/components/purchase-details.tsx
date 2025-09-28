import type { FlattenedCattle } from "@/features/cattle/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { CattleWithDetails } from "@/app/_lib/queries/cattle";

interface PurchaseDetailsProps {
	data: CattleWithDetails;
}

export const PurchaseDetails: React.FC<PurchaseDetailsProps> = ({ data }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Purchase Details</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-2 text-sm">
				<div className="flex justify-between">
					<span className="font-medium">Purchase Date:</span>
					<span>
						{new Date(
							data.purchase?.purchaseDate ?? new Date(0),
						).toDateString()}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium">Purchase Price/Kg:</span>
					<span>
						{formatCurrency(
							Number(data.animalPurchase?.purchasePrice ?? 0) /
								Number(data.purchaseWeight?.weightKg ?? 1),
						)}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium">Weight at Purchase:</span>
					<span>{data.purchaseWeight?.weightKg} kg</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium">Actual Price:</span>
					<span>
						{formatCurrency(Number(data.animalPurchase?.purchasePrice ?? 0))}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium">Purchase Location:</span>
					<span>{data.market?.name}</span>
				</div>
			</CardContent>
		</Card>
	);
};
