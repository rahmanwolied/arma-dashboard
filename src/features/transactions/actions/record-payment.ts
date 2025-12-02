"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { SaleService } from "@/services/SaleService";
import { getErrorMessage } from "@/lib/handle-error";
import type { ActionResult, PaymentMethod } from "../types";

export interface RecordPaymentInput {
    saleId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    transactionReference?: string;
}

export interface RecordPaymentResult {
    paymentId: string;
    newAmountPaid: number;
    newAmountDue: number;
}

/**
 * Server action to record a payment against a sale
 *
 * @param input - Payment details
 * @returns ActionResult with payment info or error
 */
export async function recordPaymentAction(
    input: RecordPaymentInput
): Promise<ActionResult<RecordPaymentResult>> {
    try {
        // 1. Authentication
        const { userId } = await auth();
        if (!userId) {
            return {
                success: false,
                message: "You must be logged in to record payments",
            };
        }

        // 2. Validate input
        if (input.amount <= 0) {
            return {
                success: false,
                message: "Payment amount must be greater than 0",
            };
        }

        // 3. Delegate to service
        const service = new SaleService();
        const result = await service.recordPayment(input);

        if (!result) {
            return {
                success: false,
                message: "Failed to record payment. Sale may not exist.",
            };
        }

        // 4. Cache invalidation
        revalidateTag("sales");
        revalidatePath("/dashboard/transactions");
        revalidatePath(`/dashboard/transactions/${input.saleId}`);

        return {
            success: true,
            message: "Payment recorded successfully",
            data: result,
        };
    } catch (error) {
        console.error("Error recording payment:", error);

        return {
            success: false,
            message: getErrorMessage(error),
            error,
        };
    }
}

