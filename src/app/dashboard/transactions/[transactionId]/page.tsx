import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import { Suspense } from "react";
import SaleViewPage from "@/features/transactions/components/sale-view-page";

export const metadata = {
	title: "Dashboard : Product View",
};

type PageProps = { params: Promise<{ transactionId: string }> };

export default async function Page(props: PageProps) {
	const params = await props.params;
	return (
		<PageContainer scrollable>
			<div className="flex-1 space-y-4">
				<Suspense fallback={<FormCardSkeleton />}>
					<SaleViewPage transactionId={params.transactionId} />
				</Suspense>
			</div>
		</PageContainer>
	);
}
