"use client";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import type { Column, ColumnDef } from "@tanstack/react-table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { ANIMAL_STATUS_OPTION_GROUPS, HEALTH_STATUS_OPTIONS } from "../options";
import type { CattleWithDetails } from "@/app/_lib/queries/cattle";
import { HeartHandshake } from "lucide-react";

export const healthStatusColumn: ColumnDef<CattleWithDetails> = {
	id: "healthStatus",
	accessorKey: "cattle.healthStatus",
	header: ({ column }: { column: Column<CattleWithDetails, unknown> }) => (
		<DataTableColumnHeader column={column} title="Health Status" />
	),
	enableHiding: true,
	enableSorting: false,
	cell: ({ cell }) => {
		const { isLactating, isPregnant, isQuarantined, healthStatus } =
			cell.row.original.cattle;

		const isSold = cell.row.original.sales.length > 0;

		return (
			<TooltipProvider>
				<div className="flex w-full items-center gap-2">
					<Badge
						className={cn(
							"text-xs font-medium",
							healthStatus === "CRITICAL"
								? "border-red-200 bg-red-100 text-red-800 dark:border-red-700 dark:bg-red-800 dark:text-red-200"
								: healthStatus === "SICK"
									? "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-800 dark:text-yellow-100"
									: "border-green-200 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-800 dark:text-green-200",
						)}
						variant="outline"
					>
						{healthStatus}
					</Badge>

					{isPregnant && (
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="bg-accent rounded-lg p-2">
									<Icons.isPregnant className="h-4 w-4 text-pink-600 dark:text-pink-500" />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>Pregnant</p>
							</TooltipContent>
						</Tooltip>
					)}
					{isLactating && (
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="bg-accent rounded-lg p-2">
									<Icons.isLactating className="h-4 w-4 text-blue-600 dark:text-blue-500" />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>Lactating</p>
							</TooltipContent>
						</Tooltip>
					)}
					{isSold && (
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="bg-accent rounded-lg p-2">
									<Icons.isSold className="h-4 w-4 text-green-600 dark:text-green-500" />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>Sold</p>
							</TooltipContent>
						</Tooltip>
					)}
					{isQuarantined && (
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="bg-accent rounded-lg p-2">
									<Icons.isQuarantined className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>Quarantined</p>
							</TooltipContent>
						</Tooltip>
					)}
				</div>
			</TooltipProvider>
		);
	},
	enableColumnFilter: true,
	meta: {
		label: "Health Status",
		variant: "multiSelect",
		options: ANIMAL_STATUS_OPTION_GROUPS,
		icon: HeartHandshake,
	},
};
