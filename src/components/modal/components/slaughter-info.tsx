import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CattleWithDetails } from "@/app/_lib/queries/cattle";

interface SlaughterInfoProps {
	data: CattleWithDetails;
}

export const SlaughterInfo: React.FC<SlaughterInfoProps> = ({ data }) => {
	const fatWeight = (Number(data.latestWeight.weightKg) * 12) / 100;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Slaughter Info</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-2 text-sm">
				<div className="flex justify-between">
					<span className="font-medium">Slaughter Date:</span>
					<span>No Slaughter Record</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium">Fat weight:</span>
					<span>{fatWeight} kg</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium">Lean Meat Weight:</span>
					<span>{Number(data.latestWeight.weightKg) - fatWeight} kg</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium">Liver weight:</span>
					<span>{Number(data.latestWeight.weightKg) - fatWeight + 5.3} kg</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium">Brain weight:</span>
					<span>{1.3} kg</span>
				</div>
			</CardContent>
		</Card>
	);
};
