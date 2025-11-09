/**
 * Transaction calculation helpers
 * Pure functions for calculating discounts, profits, and other sale-related values
 */

import type {
	DiscountType,
	DiscountCalculationResult,
	SaleAnimal,
	SalePreview,
} from "../types";

/**
 * Calculate discount amount based on discount type
 *
 * @param totalWeight - Total weight of all animals in kg
 * @param pricePerKg - Price per kg for the sale
 * @param discountType - Type of discount (FLAT, PERCENT, WEIGHT_BASED)
 * @param discountInput - The discount value (amount, percentage, or weight depending on type)
 * @returns Discount amount and optionally the actual discounted weight
 */
export function calculateDiscount(
	totalWeight: number,
	pricePerKg: number,
	discountType: DiscountType | undefined,
	discountInput: number | undefined,
): DiscountCalculationResult {
	if (!discountType || discountInput === undefined || discountInput === 0) {
		return { discountAmount: 0 };
	}

	const totalAmount = totalWeight * pricePerKg;

	switch (discountType) {
		case "FLAT":
			// Direct discount in currency
			return { discountAmount: discountInput };

		case "PERCENT":
			// Percentage of total amount
			return {
				discountAmount: Math.round((totalAmount * discountInput) / 100),
			};

		case "WEIGHT_BASED":
			// Discount input is weight reduction in kg
			// discountAmount = pricePerKg * reduction
			return {
				discountAmount: Math.round(pricePerKg * discountInput),
				actualDiscountedWeight: totalWeight - discountInput,
			};

		default:
			return { discountAmount: 0 };
	}
}

/**
 * Calculate profit or loss from a sale
 *
 * @param finalAmount - Final sale amount after discounts
 * @param totalCost - Total cost of all animals (sum of adjustedPrice)
 * @returns Profit/loss amount and profit margin percentage
 */
export function calculateProfitLoss(
	finalAmount: number,
	totalCost: number,
): { profitLoss: number; profitMargin: number } {
	const profitLoss = finalAmount - totalCost;
	const profitMargin = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

	return {
		profitLoss,
		profitMargin,
	};
}

/**
 * Calculate comprehensive sale preview with all relevant metrics
 *
 * @param animals - Array of animals in the sale
 * @param pricePerKg - Price per kg for the sale
 * @param discountType - Type of discount applied
 * @param discountInput - Discount value
 * @param amountPaid - Amount paid by customer
 * @returns Complete sale preview with all calculated metrics
 */
export function calculateSalePreview(
	animals: SaleAnimal[] | undefined,
	pricePerKg: number,
	discountType: DiscountType | undefined,
	discountInput: number | undefined,
	amountPaid: number,
): SalePreview {
	// Default values if no animals
	if (!animals || animals.length === 0) {
		return {
			totalWeight: 0,
			totalAmount: 0,
			totalCost: 0,
			discountAmount: 0,
			finalAmount: 0,
			profitLoss: 0,
			profitMargin: 0,
			dueAmount: 0,
			hasDue: false,
		};
	}

	// Calculate totals
	const totalWeight = animals.reduce((sum, a) => sum + a.liveWeight, 0);
	const totalAmount = totalWeight * pricePerKg;
	const totalCost = animals.reduce((sum, a) => sum + (a.adjustedPrice || 0), 0);

	// Calculate discount
	const { discountAmount } = calculateDiscount(
		totalWeight,
		pricePerKg,
		discountType,
		discountInput,
	);

	// Calculate final amount
	const finalAmount = totalAmount - discountAmount;

	// Calculate profit/loss
	const { profitLoss, profitMargin } = calculateProfitLoss(
		finalAmount,
		totalCost,
	);

	// Calculate due amount
	const dueAmount = Math.max(0, finalAmount - amountPaid);
	const hasDue = dueAmount > 0 && amountPaid > 0;

	return {
		totalWeight,
		totalAmount,
		totalCost,
		discountAmount,
		finalAmount,
		profitLoss,
		profitMargin,
		dueAmount,
		hasDue,
	};
}

/**
 * Calculate total weight from animals array
 */
export function calculateTotalWeight(animals: SaleAnimal[]): number {
	return animals.reduce((sum, animal) => sum + animal.liveWeight, 0);
}

/**
 * Calculate total cost from animals array
 */
export function calculateTotalCost(animals: SaleAnimal[]): number {
	return animals.reduce((sum, animal) => sum + (animal.adjustedPrice || 0), 0);
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
	return `৳${amount.toLocaleString()}`;
}

/**
 * Format percentage for display
 */
export function formatPercentage(percentage: number): string {
	return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`;
}
