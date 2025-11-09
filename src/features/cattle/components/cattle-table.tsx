"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableFilterMenu } from "@/components/data-table/data-table-filter-menu";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableRefreshButton } from "@/components/data-table/data-table-refresh-button";
import { useDataTable } from "@/hooks/use-data-table";
import { useFeatureFlags } from "@/app/_components/feature-flags-provider";
import { CattleTableActionBar } from "./cattle-table-action-bar";
import { getCattleTableColumns } from "./cattle-table-columns";
import { revalidateCattleCache } from "@/app/_lib/actions/cache";
import type { CattleQueryResult } from "@/types/cattle-query";
interface CattleTableProps {
	promises: Promise<[CattleQueryResult]>;
}

export function CattleTable({ promises }: CattleTableProps) {
	const [{ data, pageCount }] = React.use(promises);
	const { enableAdvancedFilter, filterFlag } = useFeatureFlags();

	// Row actions are now handled internally by the cattle columns

	const columns = React.useMemo(() => getCattleTableColumns(), []);

	const { table, shallow, debounceMs, throttleMs } = useDataTable({
		data,
		columns,
		pageCount,
		enableAdvancedFilter,
		initialState: {
			columnPinning: { right: ["actions"] },
		},
		getRowId: (originalRow) => originalRow.animal.id,
		shallow: false,
		clearOnDefault: true,
	});

	return (
		<DataTable table={table} actionBar={<CattleTableActionBar table={table} />}>
			{enableAdvancedFilter ? (
				<DataTableAdvancedToolbar table={table}>
					<DataTableSortList table={table} align="start" />
					{filterFlag === "advancedFilters" ? (
						<DataTableFilterList
							table={table}
							shallow={shallow}
							debounceMs={debounceMs}
							throttleMs={throttleMs}
							align="start"
						/>
					) : (
						<DataTableFilterMenu
							table={table}
							shallow={shallow}
							debounceMs={debounceMs}
							throttleMs={throttleMs}
						/>
					)}
					<DataTableRefreshButton onRefresh={revalidateCattleCache} />
				</DataTableAdvancedToolbar>
			) : (
				<DataTableToolbar table={table}>
					<DataTableSortList table={table} align="end" />
					<DataTableRefreshButton onRefresh={revalidateCattleCache} />
				</DataTableToolbar>
			)}
		</DataTable>
	);
}
