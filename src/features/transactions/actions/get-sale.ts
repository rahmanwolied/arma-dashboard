"use server";

import { auth } from "@clerk/nextjs/server";
import { SaleService } from "@/services/SaleService";
import { getErrorMessage } from "@/lib/handle-error";
import type { ActionResult, SaleDetailData } from "../types";

/**
 * Server action to get a sale by ID
 *
 * @param id - Sale ID
 * @returns ActionResult with sale data or error
 */
export async function getSaleByIdAction(
	id: string,
): Promise<ActionResult<SaleDetailData>> {
	try {
		// 1. Authentication
		const { userId } = await auth();
		if (!userId) {
			return {
				success: false,
				message: "You must be logged in to view sales",
			};
		}

		// 2. Delegate to service
		const service = new SaleService();
		const sale = await service.getSaleById(id);

		if (!sale) {
			return {
				success: false,
				message: `Sale with ID ${id} not found`,
			};
		}

		return {
			success: true,
			message: `Sale with ID ${id} found`,
			data: sale,
		};
	} catch (error) {
		console.error("Error fetching sale:", error);

		return {
			success: false,
			message: getErrorMessage(error),
			error,
		};
	}
}
