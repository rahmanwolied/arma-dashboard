"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { SaleService } from "@/services/SaleService";
import { getErrorMessage } from "@/lib/handle-error";
import type { ActionResult } from "../types";

/**
 * Server action to delete a sale
 *
 * @param id - Sale ID to delete
 * @returns ActionResult indicating success or failure
 */
export async function deleteSaleAction(
	id: string,
): Promise<ActionResult<void>> {
	try {
		// 1. Authentication
		const { userId } = await auth();
		if (!userId) {
			return {
				success: false,
				message: "You must be logged in to delete sales",
			};
		}

		// 2. Delegate to service
		const service = new SaleService();
		const deleted = await service.deleteSale(id);

		if (!deleted) {
			return {
				success: false,
				message: `Sale with ID ${id} not found`,
			};
		}

		// 3. Cache invalidation
		revalidateTag("sales");
		revalidatePath("/dashboard/transactions");

		return {
			success: true,
			message: "Sale deleted successfully",
			data: undefined,
		};
	} catch (error) {
		console.error("Error deleting sale:", error);

		return {
			success: false,
			message: getErrorMessage(error),
			error,
		};
	}
}
