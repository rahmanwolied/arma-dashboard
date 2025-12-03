/**
 * Transaction calculation helpers
 * Pure functions for calculating discounts, profits, and other sale-related values
 */

import type {
	DiscountType,
	DiscountCalculationResult,
	SaleAnimal,
	SalePreview,
	PricingInput,
} from "../types";

/**
 * Calculate discount amount based on discount type
 *
 * @param totalAmount - Total amount before discount (calculated based on pricing mode)
 * @param totalWeight - Total weight of all animals in kg
 * @param pricePerKg - Price per kg for the sale (used for WEIGHT_BASED discount)
 * @param discountType - Type of discount (FLAT, PERCENT, WEIGHT_BASED)
 * @param discountInput - The discount value (amount, percentage, or weight depending on type)
 * @returns Discount amount and optionally the actual discounted weight
 */
export function calculateDiscount(
	totalAmount: number,
	totalWeight: number,
	pricePerKg: number | undefined,
	discountType: DiscountType | undefined,
	discountInput: number | undefined,
): DiscountCalculationResult {
	if (!discountType || discountInput === undefined || discountInput === 0) {
		return { discountAmount: 0 };
	}

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
			// discountAmount = pricePerKg * reduction (only works with PER_KG pricing mode with SAME_RATE)
			if (!pricePerKg) return { discountAmount: 0 };
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
 * Calculate total amount based on pricing mode
 * Supports:
 * - PER_KG with SAME_RATE: totalWeight * pricePerKg
 * - PER_KG with PER_ANIMAL: sum of (animal.liveWeight * animal.individualPricePerKg)
 * - FIXED with TOTAL: totalFixedPrice
 * - FIXED with PER_ANIMAL: sum of animal.fixedSalePrice
 *
 * @param animals - Array of animals in the sale
 * @param pricing - Pricing configuration
 * @returns Total amount before discount
 */
export function calculateTotalAmount(
	animals: SaleAnimal[],
	pricing: PricingInput,
): number {
	const totalWeight = animals.reduce((sum, a) => sum + a.liveWeight, 0);

	switch (pricing.pricingMode) {
		case "PER_KG": {
			const perKgMode = pricing.perKgMode || "SAME_RATE";

			if (perKgMode === "SAME_RATE") {
				return totalWeight * (pricing.pricePerKg || 0);
			}

			if (perKgMode === "PER_ANIMAL") {
				// Sum of individual price per kg * weight for each animal
				return animals.reduce(
					(sum, a) => sum + (a.individualPricePerKg || 0) * a.liveWeight,
					0
				);
			}

			return 0;
		}

		case "FIXED":
			if (pricing.fixedPriceMode === "TOTAL") {
				return pricing.totalFixedPrice || 0;
			}
			if (pricing.fixedPriceMode === "PER_ANIMAL") {
				return animals.reduce((sum, a) => sum + (a.fixedSalePrice || 0), 0);
			}
			return 0;

		default:
			return 0;
	}
}

/**
 * Calculate comprehensive sale preview with all relevant metrics
 * Supports multiple pricing modes:
 * - PER_KG (SAME_RATE or PER_ANIMAL)
 * - FIXED (TOTAL or PER_ANIMAL)
 *
 * @param animals - Array of animals in the sale
 * @param pricing - Pricing configuration (mode, perKgMode, pricePerKg, fixedPriceMode, totalFixedPrice)
 * @param discountType - Type of discount applied
 * @param discountInput - Discount value
 * @param amountPaid - Amount paid by customer
 * @returns Complete sale preview with all calculated metrics
 */
export function calculateSalePreview(
	animals: SaleAnimal[] | undefined,
	pricing: PricingInput,
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
	const totalAmount = calculateTotalAmount(animals, pricing);
	const totalCost = animals.reduce((sum, a) => sum + (a.adjustedPrice || 0), 0);

	// Calculate discount
	const { discountAmount } = calculateDiscount(
		totalAmount,
		totalWeight,
		pricing.pricePerKg,
		discountType,
		discountInput,
	);

	// Calculate final amount
	const finalAmount = Math.max(0, totalAmount - discountAmount);

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
 * Legacy calculateSalePreview for backward compatibility
 * This calls the new function with PER_KG pricing mode
 *
 * @deprecated Use the new calculateSalePreview with pricing parameter instead
 */
export function calculateSalePreviewLegacy(
	animals: SaleAnimal[] | undefined,
	pricePerKg: number,
	discountType: DiscountType | undefined,
	discountInput: number | undefined,
	amountPaid: number,
): SalePreview {
	return calculateSalePreview(
		animals,
		{ pricingMode: "PER_KG", perKgMode: "SAME_RATE", pricePerKg },
		discountType,
		discountInput,
		amountPaid,
	);
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
 * Calculate total fixed sale price from animals array (for PER_ANIMAL mode)
 */
export function calculateTotalFixedSalePrice(animals: SaleAnimal[]): number {
	return animals.reduce((sum, animal) => sum + (animal.fixedSalePrice || 0), 0);
}

/**
 * Calculate total amount from individual price per kg (for PER_KG + PER_ANIMAL mode)
 */
export function calculateTotalFromIndividualPricePerKg(animals: SaleAnimal[]): number {
	return animals.reduce(
		(sum, animal) => sum + (animal.individualPricePerKg || 0) * animal.liveWeight,
		0
	);
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
