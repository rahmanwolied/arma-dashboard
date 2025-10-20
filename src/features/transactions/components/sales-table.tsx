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
import { getSalesTableColumns } from "./sales-table-columns";
import type { getSalesData } from "@/app/_lib/queries/sales";
import { revalidateSalesCache } from "@/app/_lib/actions/cache";

interface SalesTableProps {
	promises: Promise<[Awaited<ReturnType<typeof getSalesData>>]>;
}

export function SalesTable({ promises }: SalesTableProps) {
	const [{ data, pageCount }] = React.use(promises);
	const { enableAdvancedFilter, filterFlag } = useFeatureFlags();

	const columns = React.useMemo(() => getSalesTableColumns(), []);

	const { table, shallow, debounceMs, throttleMs } = useDataTable({
		data,
		columns,
		pageCount,
		enableAdvancedFilter,
		initialState: {
			columnPinning: { right: ["actions"] },
		},
		getRowId: (originalRow) => originalRow.id,
		shallow: false,
		clearOnDefault: true,
	});

	return (
		<>
			<DataTable table={table}>
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
						<DataTableRefreshButton onRefresh={revalidateSalesCache} />
					</DataTableAdvancedToolbar>
				) : (
					<DataTableToolbar table={table}>
						<DataTableSortList table={table} align="end" />
						<DataTableRefreshButton onRefresh={revalidateSalesCache} />
					</DataTableToolbar>
				)}
			</DataTable>
		</>
	);
}
