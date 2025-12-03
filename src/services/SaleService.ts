/**
 * SaleService - Service for sale operations
 * Handles database transactions and business logic for creating, retrieving, and managing sales
 */

import { db } from "@/db";
import {
	addresses,
	customers,
	payments,
	saleAnimalLinks,
	sales,
} from "@/db/schema";
import type {
	SaleFormData,
	SaleDetailData,
	CreateSaleInput,
	SaleServiceResult,
	DiscountCalculationResult,
	DiscountType,
} from "@/features/transactions/types";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

export class SaleService {
	/**
	 * Creates a sale with all associated records
	 */
	async createSale(input: CreateSaleInput): Promise<SaleServiceResult> {
		const { data } = input;

		return await db.transaction(async (tx) => {
			// 1. Create or get customer
			const customerId = await this.ensureCustomer(tx, data.customer);

			// 2. Calculate totals
			const calculations = this.calculateSaleTotals(data);

			// 3. Generate invoice number
			const invoiceNumber = this.generateInvoiceNumber();

			// 4. Create sale record
			const sale = await this.createSaleRecord(tx, {
				customerId,
				invoiceNumber,
				calculations,
				data,
			});

			// 5. Link animals to sale
			await this.linkAnimalsToSale(tx, sale.id, data.animals);

			// 6. Create payment records if any payments exist
			if (data.payments && data.payments.length > 0) {
				await this.createPaymentRecords(tx, sale.id, data.payments);
			}

			return {
				sale,
				totalWeight: calculations.totalWeight,
				actualDiscountedWeight: calculations.actualDiscountedWeight,
				discountAmount: calculations.discountAmount,
			};
		});
	}

	/**
	 * Retrieves a sale by ID with all related data
	 */
	async getSaleById(id: string): Promise<SaleDetailData | null> {
		const sale = await db.query.sales.findFirst({
			where: eq(sales.id, id),
			with: {
				customer: true,
				saleAnimalLinks: {
					with: {
						animal: {
							with: {
								cattle: true,
								weightRecords: {
									orderBy: (weightRecords, { desc }) => [
										desc(weightRecords.recordedAt),
									],
									limit: 1,
								},
							},
						},
					},
				},
				payments: true,
			},
		});

		if (!sale) {
			return null;
		}

		// Calculate total weight from animals
		const totalWeight = sale.saleAnimalLinks.reduce(
			(sum, link) => sum + Number(link.animal.weightRecords[0]?.weightKg || 0),
			0
		);

		// Calculate pricePerKg from stored totalAmount and totalWeight
		const totalAmount = Number(sale.totalAmount || 0);
		const pricePerKg = totalWeight > 0 ? totalAmount / totalWeight : 0;

		// Transform to SaleDetailData format
		return {
			customer: {
				id: sale.customer?.id || "",
				name: sale.customer?.name || "",
				phone: sale.customer?.primaryPhone || "",
				email: sale.customer?.email || undefined,
			},
			animals: sale.saleAnimalLinks.map((link) => ({
				id: link.animal.id,
				tagNumber: link.animal.cattle?.tagNumber || "",
				liveWeight: Number(link.animal.weightRecords[0]?.weightKg || 0),
			})),
			// Default to PER_KG mode for backward compatibility
			pricingMode: "PER_KG",
			pricePerKg,
			saleDate: sale.saleDate,
			payments: sale.payments.map((payment) => ({
				paymentMethod: payment.paymentMethod,
				paidAmount: Number(payment.paidAmount),
			})),
			discountType: sale.discountType || undefined,
			discountInput: sale.discountAmount
				? Number(sale.discountAmount)
				: undefined,
			paymentTerms: sale.paymentTerms || undefined,
			remarks: undefined,
			// Include stored amounts from database for accurate display
			storedAmounts: {
				totalAmount: Number(sale.totalAmount || 0),
				discountAmount: Number(sale.discountAmount || 0),
				amountPaid: Number(sale.amountPaid || 0),
				amountDue: Number(sale.amountDue || 0),
				invoiceNumber: sale.invoiceNumber,
			},
		};
	}

	/**
	 * Updates an existing sale with new data
	 * Note: Customer cannot be changed, only sale details, animals, discount, and payments
	 */
	async updateSale(
		id: string,
		data: Omit<SaleFormData, "customer">,
	): Promise<SaleServiceResult | null> {
		return await db.transaction(async (tx) => {
			// 1. Verify sale exists and get current data
			const [existingSale] = await tx
				.select()
				.from(sales)
				.where(eq(sales.id, id))
				.limit(1);

			if (!existingSale) {
				return null;
			}

			// 2. Calculate new totals
			const calculations = this.calculateSaleTotals({
				...data,
				customer: { name: "", phone: "" }, // Dummy customer for calculation
			});

			// 3. Delete existing animal links
			await tx.delete(saleAnimalLinks).where(eq(saleAnimalLinks.saleId, id));

			// 4. Delete existing payments (we'll recreate them)
			await tx.delete(payments).where(eq(payments.saleId, id));

			// 5. Update sale record
			const [updatedSale] = await tx
				.update(sales)
				.set({
					totalAmount: calculations.totalAmount.toFixed(2),
					discountAmount:
						calculations.discountAmount > 0
							? calculations.discountAmount.toFixed(2)
							: null,
					discountType: data.discountType || null,
					amountPaid: calculations.amountPaid.toFixed(2),
					amountDue: calculations.amountDue.toFixed(2),
					isCredit: calculations.amountDue > 0,
					paymentTerms: data.paymentTerms?.trim() || null,
					saleDate: new Date(data.saleDate),
				})
				.where(eq(sales.id, id))
				.returning();

			// 6. Link new animals to sale
			await this.linkAnimalsToSale(tx, id, data.animals);

			// 7. Create new payment records if any payments exist
			if (data.payments && data.payments.length > 0) {
				await this.createPaymentRecords(tx, id, data.payments);
			}

			return {
				sale: updatedSale,
				totalWeight: calculations.totalWeight,
				actualDiscountedWeight: calculations.actualDiscountedWeight,
				discountAmount: calculations.discountAmount,
			};
		});
	}

	/**
	 * Deletes a sale and all related records
	 */
	async deleteSale(id: string): Promise<boolean> {
		return await db.transaction(async (tx) => {
			// Delete related sale-animal links first
			await tx.delete(saleAnimalLinks).where(eq(saleAnimalLinks.saleId, id));

			// Delete related payments
			await tx.delete(payments).where(eq(payments.saleId, id));

			// Delete the sale
			const [sale] = await tx
				.delete(sales)
				.where(eq(sales.id, id))
				.returning();

			return !!sale;
		});
	}

	/**
	 * Records a payment against a sale and updates the sale's amounts
	 */
	async recordPayment(input: {
		saleId: string;
		amount: number;
		paymentMethod: "CASH" | "CREDIT_CARD" | "BANK_TRANSFER" | "MOBILE_MONEY";
		transactionReference?: string;
	}): Promise<{ paymentId: string; newAmountPaid: number; newAmountDue: number } | null> {
		return await db.transaction(async (tx) => {
			// 1. Get the current sale
			const [sale] = await tx
				.select()
				.from(sales)
				.where(eq(sales.id, input.saleId))
				.limit(1);

			if (!sale) {
				return null;
			}

			// 2. Calculate new amounts
			const currentAmountPaid = Number(sale.amountPaid || 0);
			const currentAmountDue = Number(sale.amountDue || 0);
			const newAmountPaid = currentAmountPaid + input.amount;
			const newAmountDue = Math.max(0, currentAmountDue - input.amount);

			// 3. Create the payment record
			const [payment] = await tx
				.insert(payments)
				.values({
					saleId: input.saleId,
					paidAmount: input.amount.toFixed(2),
					paidAt: new Date(),
					paymentMethod: input.paymentMethod,
					transactionReference: input.transactionReference || null,
					// Note: createdBy expects UUID but Clerk provides string IDs, so we skip it
				})
				.returning();

			// 4. Update the sale's amounts
			await tx
				.update(sales)
				.set({
					amountPaid: newAmountPaid.toFixed(2),
					amountDue: newAmountDue.toFixed(2),
					isCredit: newAmountDue > 0,
				})
				.where(eq(sales.id, input.saleId));

			return {
				paymentId: payment.id,
				newAmountPaid,
				newAmountDue,
			};
		});
	}

	/**
	 * Ensures customer exists, creates if needed
	 */
	private async ensureCustomer(
		tx: unknown,
		customer: SaleFormData["customer"],
	): Promise<string> {
		const t = tx as typeof db;

		// If customer ID is provided, use existing customer
		if (customer.id) {
			return customer.id;
		}

		// Create new customer
		const [newCustomer] = await t
			.insert(customers)
			.values({
				name: customer.name,
				primaryPhone: customer.phone,
				email: customer.email || null,
			})
			.returning();

		// Create address for new customer if provided
		if (
			customer.address?.divisionId &&
			customer.address?.districtId &&
			customer.address?.zoneId &&
			customer.address?.addressLine
		) {
			await t.insert(addresses).values({
				customerId: newCustomer.id,
				divisionId: customer.address.divisionId,
				districtId: customer.address.districtId,
				zoneId: customer.address.zoneId,
				addressLine: customer.address.addressLine,
			});
		}

		return newCustomer.id;
	}

	/**
	 * Calculates total amount based on pricing mode
	 * Supports:
	 * - PER_KG with SAME_RATE: totalWeight * pricePerKg
	 * - PER_KG with PER_ANIMAL: sum of (animal.liveWeight * animal.individualPricePerKg)
	 * - FIXED with TOTAL: totalFixedPrice
	 * - FIXED with PER_ANIMAL: sum of animal.fixedSalePrice
	 */
	private calculateTotalAmount(data: SaleFormData): number {
		const totalWeight = data.animals.reduce(
			(sum, animal) => sum + animal.liveWeight,
			0,
		);

		const pricingMode = data.pricingMode || "PER_KG";

		switch (pricingMode) {
			case "PER_KG": {
				const perKgMode = data.perKgMode || "SAME_RATE";

				if (perKgMode === "SAME_RATE") {
					return totalWeight * (data.pricePerKg || 0);
				}

				if (perKgMode === "PER_ANIMAL") {
					// Sum of individual price per kg * weight for each animal
					return data.animals.reduce(
						(sum, animal) => sum + (animal.individualPricePerKg || 0) * animal.liveWeight,
						0,
					);
				}

				return 0;
			}

			case "FIXED":
				if (data.fixedPriceMode === "TOTAL") {
					return data.totalFixedPrice || 0;
				}
				if (data.fixedPriceMode === "PER_ANIMAL") {
					return data.animals.reduce(
						(sum, animal) => sum + (animal.fixedSalePrice || 0),
						0,
					);
				}
				return 0;

			default:
				return totalWeight * (data.pricePerKg || 0);
		}
	}

	/**
	 * Calculates all sale totals including discount
	 * Supports all pricing modes: PER_KG, FIXED (TOTAL or PER_ANIMAL)
	 */
	private calculateSaleTotals(data: SaleFormData) {
		const totalWeight = data.animals.reduce(
			(sum, animal) => sum + animal.liveWeight,
			0,
		);

		// Calculate total amount based on pricing mode
		const totalAmount = this.calculateTotalAmount(data);

		// Calculate discount
		const { discountAmount, actualDiscountedWeight } = this.calculateDiscount(
			totalAmount,
			totalWeight,
			data.pricePerKg,
			data.discountType,
			data.discountInput,
		);

		const finalAmount = Math.max(0, totalAmount - discountAmount);

		// Calculate total paid from all payments
		const amountPaid = (data.payments || []).reduce(
			(sum, payment) => sum + Number(payment.paidAmount),
			0,
		);

		const amountDue = finalAmount - amountPaid;

		return {
			totalWeight,
			totalAmount,
			discountAmount,
			actualDiscountedWeight,
			finalAmount,
			amountPaid,
			amountDue,
		};
	}

	/**
	 * Calculate discount amount based on discount type
	 * Updated to work with all pricing modes
	 */
	private calculateDiscount(
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
				// Only works properly with PER_KG pricing mode
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
	 * Generates a unique invoice number
	 */
	private generateInvoiceNumber(): string {
		return `INV-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
	}

	/**
	 * Creates the sale record in database
	 */
	private async createSaleRecord(
		tx: unknown,
		params: {
			customerId: string;
			invoiceNumber: string;
			calculations: ReturnType<SaleService["calculateSaleTotals"]>;
			data: SaleFormData;
		},
	) {
		const t = tx as typeof db;
		const { customerId, invoiceNumber, calculations, data } = params;

		const [sale] = await t
			.insert(sales)
			.values({
				farmId: randomUUID(), // TODO: Get from auth context when multi-farm support is added
				customerId,
				invoiceNumber,
				totalAmount: calculations.totalAmount.toFixed(2),
				discountAmount:
					calculations.discountAmount > 0
						? calculations.discountAmount.toFixed(2)
						: null,
				discountType: data.discountType || null,
				amountPaid: calculations.amountPaid.toFixed(2),
				amountDue: calculations.amountDue.toFixed(2),
				isCredit: calculations.amountDue > 0,
				paymentTerms: data.paymentTerms?.trim() || null,
				saleDate: new Date(data.saleDate),
			})
			.returning();

		return sale;
	}

	/**
	 * Links animals to the sale
	 */
	private async linkAnimalsToSale(
		tx: unknown,
		saleId: string,
		animals: SaleFormData["animals"],
	) {
		const t = tx as typeof db;

		for (const animal of animals) {
			await t.insert(saleAnimalLinks).values({
				saleId,
				animalId: animal.id,
			});
		}
	}

	/**
	 * Creates multiple payment records
	 */
	private async createPaymentRecords(
		tx: unknown,
		saleId: string,
		paymentEntries: SaleFormData["payments"],
	) {
		const t = tx as typeof db;

		if (!paymentEntries || paymentEntries.length === 0) {
			return;
		}

		for (const payment of paymentEntries) {
			await t.insert(payments).values({
				saleId,
				paidAmount: Number(payment.paidAmount).toFixed(2),
				paidAt: new Date(),
				paymentMethod: payment.paymentMethod,
			});
		}
	}
}
