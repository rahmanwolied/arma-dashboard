/**
 * Transactions Feature - Public Exports
 *
 * This barrel file exports the public API of the transactions feature.
 * External code should import from this file rather than reaching into internal modules.
 */

// Components
export { default as SaleForm } from "./components/sale-form";
export { SalesTable } from "./components/sales-table";

// Hooks
export { useCreateSale } from "./hooks/use-create-sale";
export { useSaleQuery } from "./hooks/use-sale-query";
export { useCattleQuery } from "./hooks/use-cattle-query";

// Actions
export { createSaleAction } from "./actions/create-sale";
export { getSaleByIdAction } from "./actions/get-sale";
export { deleteSaleAction } from "./actions/delete-sale";

// Types
export type {
	SaleFormData,
	DiscountType,
	DiscountCalculationResult,
	PaymentMethod,
	SalePreview,
	SaleAnimal,
	SaleCustomer,
	CreateSaleInput,
	SaleServiceResult,
	ActionSuccess,
	ActionError,
	ActionResult,
	UseCreateSaleOptions,
	UseSaleQueryOptions,
} from "./types";

// Schemas
export { saleSchema } from "./validations/sale-schema";
