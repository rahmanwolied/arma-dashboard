"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { SaleService } from "@/services/SaleService";
import { saleSchema } from "../validations/sale-schema";
import { getErrorMessage } from "@/lib/handle-error";
import type { ActionResult, SaleServiceResult } from "../types";

/**
 * Server action to create a new sale
 *
 * @param data - Sale form data (unvalidated)
 * @returns ActionResult with sale data or error
 */
export async function createSaleAction(
	data: unknown,
): Promise<ActionResult<SaleServiceResult>> {
	try {
		// 1. Authentication
		const { userId } = await auth();
		if (!userId) {
			return {
				success: false,
				message: "You must be logged in to create a sale",
			};
		}

		// 2. Validation
		const validated = saleSchema.parse(data);

		// 3. Delegate to service
		const service = new SaleService();
		const result = await service.createSale({
			data: validated,
			userId,
		});

		// 4. Cache invalidation
		revalidateTag("sales");
		revalidatePath("/dashboard/transactions");

		return {
			success: true,
			message: "Sale created successfully",
			data: result,
		};
	} catch (error) {
		console.error("Error creating sale:", error);

		return {
			success: false,
			message: getErrorMessage(error),
			error,
		};
	}
}
