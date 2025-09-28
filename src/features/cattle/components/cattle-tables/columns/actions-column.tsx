"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { CattleWithDetails } from "@/app/_lib/queries/cattle";
import { CellAction } from "../cell-action";

export const actionsColumn: ColumnDef<CattleWithDetails> = {
	id: "actions",
	cell: ({ row }) => <CellAction data={row.original} />,
};
