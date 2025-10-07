import { getCustomersData } from "@/app/_lib/queries/customers";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getValidFilters } from "@/lib/data-table";
import { customersSearchParamsCache } from "@/app/_lib/validations";
import { serialize } from "@/lib/searchparams";
import type { SearchParams } from "@/types";
import { Suspense } from "react";
import { Shell } from "@/components/shell";
import { FeatureFlagsProvider } from "@/app/_components/feature-flags-provider";
import { CustomersTable } from "@/features/customers/components/customers-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export const metadata = {
	title: "Dashboard: Customers",
};

type pageProps = {
	searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
	const searchParams = await props.searchParams;
	const search = customersSearchParamsCache.parse(searchParams);

	const validFilters = getValidFilters(search.filters);

	// Allow nested RSCs to access the search params (in a type-safe way)
	customersSearchParamsCache.parse(searchParams);

	// This key is used for invoke suspense if any of the search params changed (used for filters).
	const key = serialize({ ...searchParams });

	const promises = Promise.all([
		getCustomersData({
			...search,
			filters: validFilters,
		}),
	]);

	return (
		<Shell className="gap-2 px-6">
			<div className="flex items-start justify-between">
				<Heading title="Customers" description="Manage customers" />
			</div>
			<Separator />
			<FeatureFlagsProvider>
				<Suspense
					key={key}
					fallback={
						<DataTableSkeleton
							columnCount={6}
							filterCount={2}
							cellWidths={["12rem", "12rem", "25rem", "10rem", "8rem", "6rem"]}
							shrinkZero
						/>
					}
				>
					<CustomersTable promises={promises} />
				</Suspense>
			</FeatureFlagsProvider>
		</Shell>
	);
}
