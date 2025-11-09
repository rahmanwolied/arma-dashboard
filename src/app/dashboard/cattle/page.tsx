import { getCattleData } from "@/app/_lib/queries/cattle";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { getValidFilters } from "@/lib/data-table";
import { cattleSearchParamsCache } from "@/app/_lib/validations";
import { serialize } from "@/lib/searchparams";
import type { SearchParams } from "@/types";
import { Suspense } from "react";
import { Shell } from "@/components/shell";
import { FeatureFlagsProvider } from "@/app/_components/feature-flags-provider";
import { CattleTable } from "@/features/cattle/components/cattle-table";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
	title: "Dashboard: Cattle",
};

type pageProps = {
	searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
	const searchParams = await props.searchParams;
	const search = cattleSearchParamsCache.parse(searchParams);

	const validFilters = getValidFilters(search.filters);

	// Allow nested RSCs to access the search params (in a type-safe way)
	cattleSearchParamsCache.parse(searchParams);

	// This key is used for invoke suspense if any of the search params changed (used for filters).
	const key = serialize({ ...searchParams });

	const promises = Promise.all([
		getCattleData({
			...search,
			filters: validFilters,
		}),
	]);

	return (
		<Shell className="gap-2 px-6">
			<div className="flex items-start justify-between">
				<Heading title="Cattle" description="Manage cattle" />
				<Link
					href="/dashboard/cattle/new"
					className={cn(buttonVariants(), "text-xs md:text-sm")}
				>
					<IconPlus className="mr-2 h-4 w-4" /> Add Cattle
				</Link>
			</div>
			<Separator />
			<FeatureFlagsProvider>
				<Suspense
					key={key}
					fallback={
						<DataTableSkeleton
							columnCount={7}
							filterCount={2}
							cellWidths={[
								"10rem",
								"30rem",
								"10rem",
								"10rem",
								"6rem",
								"6rem",
								"6rem",
							]}
							shrinkZero
						/>
					}
				>
					<CattleTable promises={promises} />
				</Suspense>
			</FeatureFlagsProvider>
		</Shell>
	);
}
