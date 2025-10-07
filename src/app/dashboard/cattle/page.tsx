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
