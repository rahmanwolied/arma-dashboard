/**
 * Sale Form Sections - Shared Types
 */

import type { Control, UseFormReturn } from "react-hook-form";
import type { SaleFormData, SalePreview } from "../../types";

/**
 * Common props passed to all form sections
 */
export interface FormSectionProps {
	form: UseFormReturn<SaleFormData>;
}

/**
 * Props for discount section
 */
export interface DiscountSectionProps extends FormSectionProps {
	discountPreview: SalePreview;
}

/**
 * Props for payment section
 */
export interface PaymentSectionProps extends FormSectionProps {
	discountPreview: SalePreview;
	amountPaid: number;
}

/**
 * Props for sale summary component
 */
export interface SaleSummaryProps {
	discountPreview: SalePreview;
	pricePerKg: number;
}

/**
 * Props for profit/loss display component
 */
export interface ProfitLossDisplayProps {
	profitLoss: number;
	profitMargin: number;
}

/**
 * Props for payment row component
 */
export interface PaymentRowProps {
	control: Control<SaleFormData>;
	index: number;
	onRemove: (index: number) => void;
}

/**
 * Props for payment summary component
 */
export interface PaymentSummaryProps {
	finalAmount: number;
	amountPaid: number;
	dueAmount: number;
	hasDue: boolean;
}
