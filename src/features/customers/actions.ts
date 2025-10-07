"use server";

import { db } from "@/db";
import { addresses, customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Customer form schema (if needed for client components)
export const customerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  primaryPhone: z.string().min(1, "Phone is required"),
  secondaryPhone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export async function createCustomer(
  formData: z.infer<typeof customerFormSchema>,
) {
  try {
    const [customer] = await db
      .insert(customers)
      .values({
        name: formData.name,
        primaryPhone: formData.primaryPhone,
        secondaryPhone: formData.secondaryPhone || null,
        email: formData.email || null,
      })
      .returning();

    return {
      success: true,
      message: "Customer created successfully",
      customer,
    };
  } catch (error) {
    console.error("Error creating customer:", error);
    return {
      success: false,
      message: error instanceof Error
        ? error.message
        : "Failed to create customer",
    };
  }
}

export async function getCustomerById(id: string) {
  try {
    const customer = await db.query.customers.findFirst({
      where: eq(customers.id, id),
      with: {
        addresses: true,
      },
    });

    if (!customer) {
      return {
        success: false,
        message: `Customer with ID ${id} not found`,
      };
    }

    return {
      success: true,
      message: `Customer with ID ${id} found`,
      customer,
    };
  } catch (error) {
    console.error("Error fetching customer:", error);
    return {
      success: false,
      message: error instanceof Error
        ? error.message
        : "Failed to fetch customer",
    };
  }
}
