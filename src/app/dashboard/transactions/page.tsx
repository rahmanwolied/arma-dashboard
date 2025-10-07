import { getSalesData } from "@/app/_lib/queries/sales";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getValidFilters } from "@/lib/data-table";
import { salesSearchParamsCache } from "@/app/_lib/validations";
import { serialize } from "@/lib/searchparams";
import type { SearchParams } from "@/types";
import { Suspense } from "react";
import { Shell } from "@/components/shell";
import { FeatureFlagsProvider } from "@/app/_components/feature-flags-provider";
import { SalesTable } from "@/features/transactions/components/sales-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconPlus } from "@tabler/icons-react";

export const metadata = {
	title: "Dashboard: Sales",
};

type pageProps = {
	searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
	const searchParams = await props.searchParams;
	const search = salesSearchParamsCache.parse(searchParams);

	const validFilters = getValidFilters(search.filters);

	// Allow nested RSCs to access the search params (in a type-safe way)
	salesSearchParamsCache.parse(searchParams);

	// This key is used for invoke suspense if any of the search params changed (used for filters).
	const key = serialize({ ...searchParams });

	const promises = Promise.all([
		getSalesData({
			...search,
			filters: validFilters,
		}),
	]);

	return (
		<Shell className="gap-2 px-6">
			<div className="flex items-start justify-between">
				<Heading title="Sales" description="Manage sales" />
				<Link
					href="/dashboard/transactions/new"
					className={cn(buttonVariants(), "text-xs md:text-sm")}
				>
					<IconPlus className="mr-2 h-4 w-4" /> Add Sale
				</Link>
			</div>
			<Separator />
			<FeatureFlagsProvider>
				<Suspense
					key={key}
					fallback={
						<DataTableSkeleton
							columnCount={8}
							filterCount={2}
							cellWidths={[
								"8rem",
								"12rem",
								"10rem",
								"10rem",
								"10rem",
								"10rem",
								"10rem",
								"8rem",
							]}
							shrinkZero
						/>
					}
				>
					<SalesTable promises={promises} />
				</Suspense>
			</FeatureFlagsProvider>
		</Shell>
	);
}
