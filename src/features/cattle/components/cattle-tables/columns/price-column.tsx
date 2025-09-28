"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { DollarSign } from "lucide-react";
import type { CattleWithDetails } from "@/app/_lib/queries/cattle";

export const priceColumn: ColumnDef<CattleWithDetails> = {
	id: "purchasePrice",
	accessorKey: "animalPurchase",
	header: ({ column }: { column: Column<CattleWithDetails, unknown> }) => (
		<DataTableColumnHeader column={column} title="Purchase Price (KG)" />
	),
	cell: ({ cell, row }) => {
		const purchase = cell.getValue<CattleWithDetails["animalPurchase"]>();
		const weight = Number(row.original.purchaseWeight?.weightKg);
		const price = Number(purchase?.purchasePrice) / weight;

		if (!price) {
			return <div className="text-muted-foreground">No purchase data</div>;
		}

		return (
			<div className="font-medium">
				{Number(price).toLocaleString("en-US", {
					style: "currency",
					currency: "BDT",
					currencyDisplay: "narrowSymbol",
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
					currencySign: "accounting",
					notation: "compact",
				})}
			</div>
		);
	},
	enableSorting: true,
	enableColumnFilter: true,
	meta: {
		label: "Purchase Price (KG)",
		variant: "range",
		range: [0, 1000],
		icon: DollarSign,
	},
};
