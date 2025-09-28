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
import { CATTLE_CLASS_OPTIONS } from "../options";
import type { CattleWithDetails } from "@/app/_lib/queries/cattle";
import { Weight } from "lucide-react";

const SILVER_COLOR =
	"dark:bg-slate-500 dark:text-slate-100 bg-slate-200 text-slate-500 dark:fill-slate-500 fill-slate-200";
const GOLD_COLOR =
	"dark:bg-amber-600 dark:text-amber-100 bg-yellow-100 text-amber-600 dark:fill-amber-600 fill-yellow-100";
const PLATINUM_COLOR =
	"dark:bg-purple-600 dark:text-purple-100 bg-purple-200 text-purple-500 dark:fill-purple-500 fill-purple-200";

export const weightClassColumn: ColumnDef<CattleWithDetails> = {
	id: "cattleClass",
	accessorKey: "latestWeight.weightKg",
	header: ({ column }: { column: Column<CattleWithDetails, unknown> }) => (
		<DataTableColumnHeader column={column} title="Live Weight (KG)" />
	),
	cell: ({ cell, row }) => {
		const weight =
			cell.getValue<CattleWithDetails["latestWeight"]["weightKg"]>();
		const cattleClass = row.original.cattleClass;

		const color =
			cattleClass === "GOLD"
				? GOLD_COLOR
				: cattleClass === "SILVER"
					? SILVER_COLOR
					: cattleClass === "PLATINUM"
						? PLATINUM_COLOR
						: undefined;

		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Badge className={cn("flex items-center gap-2", color)}>
							<span className="text-[0.75rem] font-semibold">{weight}</span>
							<span className="text-[0.75rem] font-semibold">KG</span>
						</Badge>
					</TooltipTrigger>
					<TooltipContent className={color} arrowClassName={color}>
						<p>{cattleClass}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	},
	enableColumnFilter: true,
	enableSorting: true,
	sortingFn: (rowA, rowB) => {
		return (
			Number(rowA.original.latestWeight.weightKg) -
			Number(rowB.original.latestWeight.weightKg)
		);
	},
	meta: {
		label: "Cattle Class",
		variant: "multiSelect",
		options: CATTLE_CLASS_OPTIONS,
		icon: Weight,
	},
};
