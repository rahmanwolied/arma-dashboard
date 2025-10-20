import { notFound } from "next/navigation";
import SaleForm from "./sale-form";
import { getSaleById } from "../actions";
import type { SaleFormData } from "../schemas/sale-schema";

type TSaleViewPageProps = {
	transactionId: string;
};

export default async function TransactionViewPage({
	transactionId,
}: TSaleViewPageProps) {
	let sale = null;
	let pageTitle = "Add New Sale";

	if (transactionId !== "new") {
		const result = await getSaleById(transactionId);

		if (!result.success || !result.sale) {
			notFound();
		}

		sale = result.sale;
		pageTitle = "Edit Sale";
	}

	return <SaleForm initialData={sale} pageTitle={pageTitle} />;
}
