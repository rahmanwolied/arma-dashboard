import { notFound } from "next/navigation";
import SaleForm from "./sale-form";
import SaleDetailView from "./sale-detail-view";
import { getSaleByIdAction } from "../actions/get-sale";

type TSaleViewPageProps = {
	transactionId: string;
};

export default async function SaleViewPage({
	transactionId,
}: TSaleViewPageProps) {
	// Show form for new sale
	if (transactionId === "new") {
		return <SaleForm initialData={null} pageTitle="Add New Sale" />;
	}

	// Fetch and display existing sale details
	const result = await getSaleByIdAction(transactionId);

	if (!result.success || !result.data) {
		notFound();
	}

	return <SaleDetailView sale={result.data} transactionId={transactionId} />;
}
