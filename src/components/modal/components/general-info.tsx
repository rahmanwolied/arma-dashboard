import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { CattleWithDetails } from "@/app/_lib/queries/cattle";

interface GeneralInfoProps {
	data: CattleWithDetails;
}

export const GeneralInfo: React.FC<GeneralInfoProps> = ({ data }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>General Information</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-4 md:grid-cols-2">
				<div className="bg-muted flex flex-col items-center justify-center rounded-md p-4">
					<Image
						src={"/assets/cow.png"}
						alt={`Image of ${data.cattle.tagNumber}`}
						width={150}
						height={150}
						className="mb-2 aspect-square rounded-full object-cover"
					/>
					<p className="text-lg font-semibold">{data.cattle.tagNumber}</p>
					{!data.cattle.tagNumber ? (
						<p className="text-lg font-semibold">#{data.cattle.tagNumber}</p>
					) : (
						<p className="text-muted-foreground text-sm">
							{data.cattle.tagNumber}
						</p>
					)}
				</div>
				<div className="grid gap-2 text-sm">
					<div className="flex justify-between">
						<span className="font-medium">ID:</span>
						<span>{data.animal.id}</span>
					</div>
					<div className="flex justify-between">
						<span className="font-medium">Gender:</span>
						<span>{data.cattle.gender}</span>
					</div>
					<div className="flex justify-between">
						<span className="font-medium">Class:</span>
						<span>{data.cattleClass}</span>
					</div>
					<div className="flex justify-between">
						<span className="font-medium">Created At:</span>
						<span>{new Date(data.cattle.createdAt).toDateString()}</span>
					</div>
					<div className="flex justify-between">
						<span className="font-medium">Last Updated:</span>
						<span>
							{new Date(data.cattle.updatedAt ?? new Date(0)).toDateString()}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
