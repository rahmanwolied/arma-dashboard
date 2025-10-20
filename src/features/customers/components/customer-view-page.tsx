import { notFound } from "next/navigation";
import CustomerForm from "./customer-form";
import { getCustomerById } from "../actions";
import type { CustomerFormSchema } from "./customer-form";

type TCustomerViewPageProps = {
	customerId: string;
};

export default async function CustomerViewPage({
	customerId,
}: TCustomerViewPageProps) {
	let customer = null;
	let pageTitle = "Add New Customer";

	if (customerId !== "new") {
		const result = await getCustomerById(customerId);

		if (!result.success || !result.customer) {
			notFound();
		}

		customer = result.customer;
		pageTitle = "Edit Customer";
	}

	return (
		<CustomerForm
			initialData={customer as CustomerFormSchema}
			pageTitle={pageTitle}
			id={customerId}
		/>
	);
}
