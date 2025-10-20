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
import { getCustomersTableColumns } from "./customers-table-columns";
import type { getCustomersData } from "@/app/_lib/queries/customers";
import { getAllDistricts, getAllDivisions } from "@/app/_lib/queries/divisions";
import { revalidateCustomersCache } from "@/app/_lib/actions/cache";

interface CustomersTableProps {
	promises: Promise<[Awaited<ReturnType<typeof getCustomersData>>, Awaited<ReturnType<typeof getAllDistricts>>, Awaited<ReturnType<typeof getAllDivisions>>]>;
}

export function CustomersTable({ promises }: CustomersTableProps) {
	const [{ data, pageCount }, districts, divisions] = React.use(promises);
	const { enableAdvancedFilter, filterFlag } = useFeatureFlags();
	const columns = React.useMemo(() => getCustomersTableColumns({ districts, divisions }), [districts, divisions]);

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
			<DataTable table={table} >
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
						<DataTableRefreshButton onRefresh={revalidateCustomersCache} />
					</DataTableAdvancedToolbar>
				) : (
					<DataTableToolbar table={table}>
						<DataTableSortList table={table} align="end" />
						<DataTableRefreshButton onRefresh={revalidateCustomersCache} />
					</DataTableToolbar>
				)}
			</DataTable>
		</>
	);
}
