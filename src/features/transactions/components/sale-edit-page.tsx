import { notFound } from "next/navigation";
import SaleEditForm from "./sale-edit-form";
import { getSaleByIdAction } from "../actions/get-sale";

type TSaleEditPageProps = {
	transactionId: string;
};

export default async function SaleEditPage({
	transactionId,
}: TSaleEditPageProps) {
	// Fetch existing sale data
	const result = await getSaleByIdAction(transactionId);

	if (!result.success || !result.data) {
		notFound();
	}

	return <SaleEditForm saleId={transactionId} initialData={result.data} />;
}

