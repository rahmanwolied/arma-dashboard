"use client";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import type { Column, ColumnDef } from "@tanstack/react-table";
import type { CattleWithDetails } from "@/app/_lib/queries/cattle";

export const fatPercentageColumn: ColumnDef<CattleWithDetails> = {
	id: "fatPercentage",
	accessorKey: "cattle.fatPercentage",
	header: ({ column }: { column: Column<CattleWithDetails, unknown> }) => (
		<DataTableColumnHeader column={column} title="Fat %" />
	),
	cell: ({ cell }) => {
		const fatPercentage =
			cell.getValue<CattleWithDetails["cattle"]["fatPercentage"]>();
		return <div className="font-medium">{fatPercentage}%</div>;
	},
	enableColumnFilter: true,
	enableSorting: true,
	meta: {
		label: "Fat %",
	},
};
