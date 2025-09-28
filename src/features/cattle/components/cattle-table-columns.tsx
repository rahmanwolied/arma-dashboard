"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

// Import individual cattle columns
import { columns as cattleColumns } from "./cattle-tables/columns";
import type { CattleWithDetails } from "@/app/_lib/queries/cattle";

export function getCattleTableColumns(): ColumnDef<CattleWithDetails>[] {
	return [
		// Select checkbox column
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
					className="translate-y-0.5"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
					className="translate-y-0.5"
				/>
			),
			enableSorting: false,
			enableHiding: false,
			size: 40,
		},
		// Spread the cattle columns from the columns directory
		...cattleColumns,
	];
}
