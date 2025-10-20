"use server";

import { db } from "@/db";
import { addresses, customers, payments, saleAnimalLinks, sales } from "@/db/schema";
import type { SaleFormData } from "./schemas/sale-schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

/**
 * Calculate discount amount based on discount type
 */
function calculateDiscount(
  totalWeight: number,
  pricePerKg: number,
  discountType: "FLAT" | "PERCENT" | "WEIGHT_BASED" | undefined,
  discountInput: number | undefined,
): { discountAmount: number; actualDiscountedWeight?: number } {
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

export async function createSale(formData: SaleFormData) {
  try {
    const result = await db.transaction(async (tx) => {
      // 1. Create or get customer
      let customerId: string;

      if (formData.customer.id) {
        customerId = formData.customer.id;
      } else {
        // Create new customer
        const [newCustomer] = await tx
          .insert(customers)
          .values({
            name: formData.customer.name,
            primaryPhone: formData.customer.phone,
            email: formData.customer.email || null,
          })
          .returning();
        customerId = newCustomer.id;

        // Create address for new customer if provided
        if (formData.customer.address &&
          formData.customer.address.divisionId &&
          formData.customer.address.districtId &&
          formData.customer.address.zoneId) {
          await tx.insert(addresses).values({
            customerId: newCustomer.id,
            divisionId: formData.customer.address.divisionId,
            districtId: formData.customer.address.districtId,
            zoneId: formData.customer.address.zoneId,
            addressLine: formData.customer.address.addressLine,
          });
        }
      }

      // 2. Calculate totals
      const totalWeight = formData.animals.reduce(
        (sum, animal) => sum + animal.liveWeight,
        0,
      );
      const totalAmount = totalWeight * formData.pricePerKg;

      // 3. Calculate discount
      const { discountAmount, actualDiscountedWeight } = calculateDiscount(
        totalWeight,
        formData.pricePerKg,
        formData.discountType,
        formData.discountInput,
      );

      const finalAmount = totalAmount - discountAmount;
      const amountDue = finalAmount - formData.amountPaid;

      // 4. Generate invoice number
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()
        }`;

      // 5. Create sale
      const [sale] = await tx
        .insert(sales)
        .values({
          farmId: "default-farm-id", // TODO: Get from auth context
          customerId,
          invoiceNumber,
          totalAmount: totalAmount.toFixed(2),
          discountAmount: discountAmount > 0 ? discountAmount.toFixed(2) : null,
          discountType: formData.discountType || null,
          amountPaid: formData.amountPaid.toFixed(2),
          amountDue: amountDue.toFixed(2),
          isCredit: amountDue > 0,
          paymentTerms: formData.paymentTerms || null,
          saleDate: new Date(formData.saleDate),
        })
        .returning();

      // 6. Link animals to sale
      for (const animal of formData.animals) {
        await tx.insert(saleAnimalLinks).values({
          saleId: sale.id,
          animalId: animal.id,
        });
      }

      // 7. Create payment record if amount paid > 0
      if (formData.amountPaid > 0) {
        await tx.insert(payments).values({
          saleId: sale.id,
          paidAmount: formData.amountPaid.toFixed(2),
          paidAt: new Date(),
          paymentMethod: formData.paymentMethod,
        });
      }

      return {
        sale,
        totalWeight,
        actualDiscountedWeight,
        discountAmount,
      };
    });

    return {
      success: true,
      message: "Sale created successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error creating sale:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create sale",
      error: error,
    };
  }
}

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
                weightRecords: {
                  orderBy: (weightRecords, { desc }) => [desc(weightRecords.recordedAt)],
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
      return {
        success: false,
        message: `Sale with ID ${id} not found`,
      };
    }

    // Transform to SaleFormData format
    const formData: SaleFormData = {
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
      pricePerKg: 0, // Need to calculate from totalAmount and weights
      amountPaid: Number(sale.amountPaid),
      saleDate: sale.saleDate,
      paymentMethod: sale.payments[0]?.paymentMethod || "CASH",
      discountType: sale.discountType || undefined,
      discountInput: sale.discountAmount ? Number(sale.discountAmount) : undefined,
      paymentTerms: sale.paymentTerms || undefined,
      remarks: undefined,
    };

    return {
      success: true,
      message: `Sale with ID ${id} found`,
      sale: formData,
    };
  } catch (error) {
    console.error("Error fetching sale:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch sale",
    };
  }
}

export async function deleteSale(id: string) {
  try {
    const result = await db.transaction(async (tx) => {
      // Delete related sale-animal links first
      await tx.delete(saleAnimalLinks).where(eq(saleAnimalLinks.saleId, id));

      // Delete related payments
      await tx.delete(payments).where(eq(payments.saleId, id));

      // Delete the sale
      const [sale] = await tx
        .delete(sales)
        .where(eq(sales.id, id))
        .returning();

      return sale;
    });

    if (!result) {
      return {
        success: false,
        message: `Sale with ID ${id} not found`,
      };
    }

    // Revalidate cache
    revalidateTag("sales");

    return {
      success: true,
      message: "Sale deleted successfully",
      sale: result,
    };
  } catch (error) {
    console.error("Error deleting sale:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete sale",
    };
  }
}
