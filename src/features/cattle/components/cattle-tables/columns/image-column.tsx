"use client";
import type { Column, ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import type { FlattenedCattle } from "@/features/cattle/actions";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

export const imageColumn: ColumnDef<FlattenedCattle> = {
	accessorKey: "imageUrl",
	header: ({ column }: { column: Column<FlattenedCattle, unknown> }) => (
		<DataTableColumnHeader column={column} title="Image" />
	),
	cell: ({ row }) => {
		return (
			<Image
				src={row.getValue("imageUrl") || "/assets/cow.png"}
				alt={row.original.tagNumber.toString()}
				width={75}
				height={75}
				className="aspect-square rounded-lg object-cover"
			/>
		);
	},
	enableColumnFilter: true,
	enableHiding: true,
	enableSorting: false,
	meta: {
		label: "Image",
	},
};
