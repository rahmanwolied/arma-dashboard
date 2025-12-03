"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { SaleService } from "@/services/SaleService";
import { saleSchema } from "../validations/sale-schema";
import { getErrorMessage } from "@/lib/handle-error";
import type { ActionResult, SaleServiceResult } from "../types";

/**
 * Server action to update an existing sale
 * Note: Customer information cannot be changed
 *
 * @param id - Sale ID to update
 * @param data - Sale form data (unvalidated)
 * @returns ActionResult with updated sale data or error
 */
export async function updateSaleAction(
	id: string,
	data: unknown,
): Promise<ActionResult<SaleServiceResult>> {
	try {
		// 1. Authentication
		const { userId } = await auth();
		if (!userId) {
			return {
				success: false,
				message: "You must be logged in to update a sale",
			};
		}

		// 2. Validation
		const validated = saleSchema.parse(data);

		// 3. Delegate to service (exclude customer from update)
		const service = new SaleService();
		const result = await service.updateSale(id, {
			animals: validated.animals,
			pricePerKg: validated.pricePerKg,
			saleDate: validated.saleDate,
			discountType: validated.discountType,
			discountInput: validated.discountInput,
			payments: validated.payments,
			paymentTerms: validated.paymentTerms,
			remarks: validated.remarks,
		});

		if (!result) {
			return {
				success: false,
				message: `Sale with ID ${id} not found`,
			};
		}

		// 4. Cache invalidation
		revalidateTag("sales");
		revalidatePath("/dashboard/transactions");
		revalidatePath(`/dashboard/transactions/${id}`);

		return {
			success: true,
			message: "Sale updated successfully",
			data: result,
		};
	} catch (error) {
		console.error("Error updating sale:", error);

		return {
			success: false,
			message: getErrorMessage(error),
			error,
		};
	}
}


