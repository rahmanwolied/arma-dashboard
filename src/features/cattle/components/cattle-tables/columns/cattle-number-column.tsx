"use client";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { Text } from "lucide-react";
import type { CattleWithDetails } from "@/app/_lib/queries/cattle";

export const cattleNumberColumn: ColumnDef<CattleWithDetails> = {
	id: "tagNumber",
	accessorKey: "cattle.tagNumber",
	header: ({ column }: { column: Column<CattleWithDetails, unknown> }) => (
		<DataTableColumnHeader column={column} title="Tag Number" />
	),
	cell: ({ cell }) => {
		return (
			<div># {cell.getValue<CattleWithDetails["cattle"]["tagNumber"]>()}</div>
		);
	},
	meta: {
		label: "Tag Number",
		placeholder: "Search tag number...",
		variant: "text",
		icon: Text,
	},
	enableColumnFilter: true,
};
