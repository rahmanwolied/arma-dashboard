import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import type { CattleWithDetails } from "@/app/_lib/queries/cattle";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { DollarSign } from "lucide-react";

export const totalPriceColumn: ColumnDef<CattleWithDetails> = {
	id: "totalPrice",
	accessorKey: "animalPurchase",
	header: ({ column }: { column: Column<CattleWithDetails, unknown> }) => (
		<DataTableColumnHeader column={column} title="Total Price" />
	),
	cell: ({ cell }) => {
		const price = Number(
			cell.getValue<CattleWithDetails["animalPurchase"]>()?.purchasePrice,
		);

		if (!price) {
			return <div className="text-muted-foreground">No purchase data</div>;
		}

		return (
			<div className="mr-7 text-right font-medium">
				{price.toLocaleString("en-US", {
					style: "currency",
					currency: "BDT",
					currencyDisplay: "narrowSymbol",
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
					currencySign: "accounting",
				})}
			</div>
		);
	},
	meta: {
		label: "Total Price",
		placeholder: "Search total price...",
		variant: "text",
		icon: DollarSign,
	},
};
