"use client";

import { SelectTrigger } from "@radix-ui/react-select";
import type { Table } from "@tanstack/react-table";
import { Heart, CheckCircle2, Download, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import {
	DataTableActionBar,
	DataTableActionBarAction,
	DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { healthStatusEnum, genderEnum } from "@/db/schema";
import type { FlattenedCattle } from "@/features/cattle/actions";
import { exportTableToCSV } from "@/lib/export";
import { deleteCattles, updateCattles } from "@/app/_lib/actions/cattle";
import type { CattleWithDetails } from "@/app/_lib/queries/cattle";

const actions = [
	"update-health-status",
	"update-gender",
	"export",
	"delete",
] as const;

type Action = (typeof actions)[number];

interface CattleTableActionBarProps {
	table: Table<CattleWithDetails>;
}

export function CattleTableActionBar({ table }: CattleTableActionBarProps) {
	const rows = table.getFilteredSelectedRowModel().rows;
	const [isPending, startTransition] = React.useTransition();
	const [currentAction, setCurrentAction] = React.useState<Action | null>(null);

	const getIsActionPending = React.useCallback(
		(action: Action) => isPending && currentAction === action,
		[isPending, currentAction],
	);

	const onCattleUpdate = React.useCallback(
		({
			field,
			value,
		}: {
			field: "healthStatus" | "gender";
			value: FlattenedCattle["healthStatus"] | FlattenedCattle["gender"];
		}) => {
			setCurrentAction(
				field === "healthStatus" ? "update-health-status" : "update-gender",
			);
			startTransition(async () => {
				const { error } = await updateCattles({
					ids: rows.map((row) => row.original.animal.id),
					[field]: value,
				});

				if (error) {
					toast.error(error);
					return;
				}
				toast.success("Cattle updated");
				table.toggleAllRowsSelected(false);
			});
		},
		[rows, table],
	);

	const onCattleExport = React.useCallback(() => {
		setCurrentAction("export");
		startTransition(() => {
			exportTableToCSV(table, {
				excludeColumns: ["select", "actions"],
				onlySelected: true,
			});
		});
	}, [table]);

	const onCattleDelete = React.useCallback(() => {
		setCurrentAction("delete");
		startTransition(async () => {
			const { error } = await deleteCattles({
				ids: rows.map((row) => row.original.animal.id),
			});

			if (error) {
				toast.error(error);
				return;
			}
			toast.success("Cattle deleted");
			table.toggleAllRowsSelected(false);
		});
	}, [rows, table]);

	return (
		<DataTableActionBar table={table} visible={rows.length > 0}>
			<DataTableActionBarSelection table={table} />
			<Separator
				orientation="vertical"
				className="hidden data-[orientation=vertical]:h-5 sm:block"
			/>
			<div className="flex items-center gap-1.5">
				<Select
					onValueChange={(value: FlattenedCattle["healthStatus"]) =>
						onCattleUpdate({ field: "healthStatus", value })
					}
				>
					<SelectTrigger asChild>
						<DataTableActionBarAction
							size="icon"
							tooltip="Update health status"
							isPending={getIsActionPending("update-health-status")}
						>
							<Heart />
						</DataTableActionBarAction>
					</SelectTrigger>
					<SelectContent align="center">
						<SelectGroup>
							{healthStatusEnum.enumValues.map((status) => (
								<SelectItem key={status} value={status} className="capitalize">
									{status.replace("_", " ").toLowerCase()}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<Select
					onValueChange={(value: FlattenedCattle["gender"]) =>
						onCattleUpdate({ field: "gender", value })
					}
				>
					<SelectTrigger asChild>
						<DataTableActionBarAction
							size="icon"
							tooltip="Update gender"
							isPending={getIsActionPending("update-gender")}
						>
							<CheckCircle2 />
						</DataTableActionBarAction>
					</SelectTrigger>
					<SelectContent align="center">
						<SelectGroup>
							{genderEnum.enumValues.map((gender) => (
								<SelectItem key={gender} value={gender} className="capitalize">
									{gender.toLowerCase()}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<DataTableActionBarAction
					size="icon"
					tooltip="Export cattle"
					isPending={getIsActionPending("export")}
					onClick={onCattleExport}
				>
					<Download />
				</DataTableActionBarAction>
				<DataTableActionBarAction
					size="icon"
					tooltip="Delete cattle"
					isPending={getIsActionPending("delete")}
					onClick={onCattleDelete}
				>
					<Trash2 />
				</DataTableActionBarAction>
			</div>
		</DataTableActionBar>
	);
}
