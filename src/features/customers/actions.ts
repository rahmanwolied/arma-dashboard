"use server";

import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { CustomerFormSchema } from "./components/customer-form";

export async function createCustomer(
  formData: CustomerFormSchema,
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

export async function getCustomers() {
  try {
    const customers = await db.query.customers.findMany({
      with: {
        addresses: true,
      },
    });
    return {
      success: true,
      message: "Customers fetched successfully",
      customers,
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return {
      success: false,
      message: error instanceof Error
        ? error.message
        : "Failed to fetch customers",
    };
  }
}
