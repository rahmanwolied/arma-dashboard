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

			// 6. Create payment record if amount paid > 0
			if (data.amountPaid > 0) {
				await this.createPaymentRecord(tx, sale.id, data);
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
	async getSaleById(id: string): Promise<SaleFormData | null> {
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

		// Transform to SaleFormData format
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
			pricePerKg: 0, // TODO: Calculate from totalAmount and weights
			amountPaid: Number(sale.amountPaid),
			saleDate: sale.saleDate,
			paymentMethod: sale.payments[0]?.paymentMethod || "CASH",
			discountType: sale.discountType || undefined,
			discountInput: sale.discountAmount
				? Number(sale.discountAmount)
				: undefined,
			paymentTerms: sale.paymentTerms || undefined,
			remarks: undefined,
		};
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
	 * Calculates all sale totals including discount
	 */
	private calculateSaleTotals(data: SaleFormData) {
		const totalWeight = data.animals.reduce(
			(sum, animal) => sum + animal.liveWeight,
			0,
		);
		const totalAmount = totalWeight * data.pricePerKg;

		// Calculate discount
		const { discountAmount, actualDiscountedWeight } = this.calculateDiscount(
			totalWeight,
			data.pricePerKg,
			data.discountType,
			data.discountInput,
		);

		const finalAmount = totalAmount - discountAmount;
		const amountDue = finalAmount - data.amountPaid;

		return {
			totalWeight,
			totalAmount,
			discountAmount,
			actualDiscountedWeight,
			finalAmount,
			amountDue,
		};
	}

	/**
	 * Calculate discount amount based on discount type
	 */
	private calculateDiscount(
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
	 * Generates a unique invoice number
	 */
	private generateInvoiceNumber(): string {
		return `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
	}

	/**
	 * Creates the sale record in database
	 */
	private async createSaleRecord(
		tx: unknown,
		params: {
			customerId: string;
			invoiceNumber: string;
			calculations: ReturnType<typeof this.calculateSaleTotals>;
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
				amountPaid: data.amountPaid.toFixed(2),
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
	 * Creates a payment record
	 */
	private async createPaymentRecord(
		tx: unknown,
		saleId: string,
		data: SaleFormData,
	) {
		const t = tx as typeof db;

		await t.insert(payments).values({
			saleId,
			paidAmount: data.amountPaid.toFixed(2),
			paidAt: new Date(),
			paymentMethod: data.paymentMethod,
		});
	}
}
