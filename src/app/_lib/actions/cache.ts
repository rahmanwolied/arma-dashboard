"use server";

import { revalidateTag } from "next/cache";

export async function revalidateCustomersCache() {
    try {
        revalidateTag("customers");
        revalidateTag("divisions");
        revalidateTag("districts");
        return {
            success: true,
            message: "Customers data refreshed successfully",
        };
    } catch (error) {
        console.error("Error revalidating customers cache:", error);
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to refresh customers data",
        };
    }
}

export async function revalidateSalesCache() {
    try {
        revalidateTag("sales");
        return {
            success: true,
            message: "Sales data refreshed successfully",
        };
    } catch (error) {
        console.error("Error revalidating sales cache:", error);
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to refresh sales data",
        };
    }
}

export async function revalidateCattleCache() {
    try {
        revalidateTag("cattle");
        revalidateTag("animals");
        revalidateTag("weights");
        revalidateTag("cattle-thresholds");
        return {
            success: true,
            message: "Cattle data refreshed successfully",
        };
    } catch (error) {
        console.error("Error revalidating cattle cache:", error);
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to refresh cattle data",
        };
    }
}

