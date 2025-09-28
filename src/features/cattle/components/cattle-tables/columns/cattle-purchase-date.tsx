"use client";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import type { Column, ColumnDef } from "@tanstack/react-table";
import type { CattleWithDetails } from "@/app/_lib/queries/cattle";
import { Calendar } from "lucide-react";

export const cattlePurchaseDateColumn: ColumnDef<CattleWithDetails> = {
	id: "purchaseDate",
	accessorKey: "purchase",
	header: ({ column }: { column: Column<CattleWithDetails, unknown> }) => (
		<DataTableColumnHeader column={column} title="Cattle Purchase Date" />
	),
	cell: ({ cell }) => {
		const purchaseDate =
			cell.getValue<CattleWithDetails["purchase"]>()?.purchaseDate;

		if (!purchaseDate) {
			return <div className="text-muted-foreground">No purchase data</div>;
		}

		return (
			<div className="font-medium">{new Date(purchaseDate).toDateString()}</div>
		);
	},
	enableColumnFilter: true,
	enableSorting: true,
	meta: {
		label: "Purchase Date",
		variant: "dateRange",
		icon: Calendar,
	},
};
