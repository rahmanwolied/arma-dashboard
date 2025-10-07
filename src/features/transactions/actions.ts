"use server";

export { createSale } from "./actions/create-sale";

import { db } from "@/db";
import { sales } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getSaleById(id: string) {
  try {
    const sale = await db.query.sales.findFirst({
      where: eq(sales.id, id),
      with: {
        customer: true,
        saleAnimalLinks: {
          with: {
            animal: {
              with: {
                cattle: true,
              },
            },
          },
        },
        payments: true,
      },
    });

    if (!sale) {
      return {
        success: false,
        message: `Sale with ID ${id} not found`,
      };
    }

    return {
      success: true,
      message: `Sale with ID ${id} found`,
      sale,
    };
  } catch (error) {
    console.error("Error fetching sale:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch sale",
    };
  }
}
