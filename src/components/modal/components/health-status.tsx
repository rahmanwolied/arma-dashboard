import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { HealthStatusIcon, StatusIcon } from "./icons";
import type { CattleWithDetails } from "@/app/_lib/queries/cattle";

type HealthStatusType = "HEALTHY" | "MINOR_ISSUE" | "SICK" | "CRITICAL";
interface HealthStatusProps {
	data: CattleWithDetails;
}

const StatusIndicator: React.FC<{
	label: string;
	condition: boolean;
	type: string;
}> = ({ label, condition, type }) => (
	<div className="flex items-center gap-2">
		<span className="font-medium">{label}:</span>
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div>
						<StatusIcon condition={condition} type={type} />
					</div>
				</TooltipTrigger>
				<TooltipContent>{condition ? "Yes" : "No"}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	</div>
);

export const HealthStatus: React.FC<HealthStatusProps> = ({ data }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Health & Status</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-4">
				<div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
					<StatusIndicator
						label="Quarantined"
						condition={data.cattle.isQuarantined}
						type="quarantined"
					/>
					<StatusIndicator
						label="Pregnant"
						condition={data.cattle.isPregnant}
						type="pregnant"
					/>
					<StatusIndicator
						label="Lactating"
						condition={data.cattle.isLactating}
						type="lactating"
					/>
				</div>
				<Separator />
				<div className="grid gap-2 text-sm">
					<div className="flex items-center gap-2">
						<span className="font-medium">Health Status:</span>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div>
										<HealthStatusIcon
											status={data.cattle.healthStatus as HealthStatusType}
										/>
									</div>
								</TooltipTrigger>
								<TooltipContent>{data.cattle.healthStatus}</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					<div>
						<span className="font-medium">Health Notes:</span>
						<p className="text-muted-foreground mt-1">
							{data.cattle.healthStatus || "No notes."}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
