import { notFound } from "next/navigation";
import SaleForm from "./sale-form";
import { getSaleByIdAction } from "../actions/get-sale";
import type { SaleFormData } from "../validations/sale-schema";

type TSaleViewPageProps = {
	transactionId: string;
};

export default async function TransactionViewPage({
	transactionId,
}: TSaleViewPageProps) {
	let sale = null;
	let pageTitle = "Add New Sale";

	if (transactionId !== "new") {
		const result = await getSaleByIdAction(transactionId);

		if (!result.success || !result.data) {
			notFound();
		}

		sale = result.data;
		pageTitle = "Edit Sale";
	}

	return <SaleForm initialData={sale} pageTitle={pageTitle} />;
}
