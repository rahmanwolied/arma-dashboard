"use server";

import { db } from "@/db";
import { customers, sales } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
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

export async function updateCustomer(formData: CustomerFormSchema, id: string) {
  try {
    const [customer] = await db.update(customers).set({
      name: formData.name,
      email: formData.email,
      primaryPhone: formData.primaryPhone,
      secondaryPhone: formData.secondaryPhone
    }).where(eq(customers.id, id)).returning()


    if (!customer) {
      return {
        success: false,
        message: `Customer with ID ${id} not found`,
      };
    }

    return {
      success: true,
      message: `Customer with ID ${id} updated`,
      customer,
    };
  } catch (error) {
    console.error("Error updating customer:", error);
    return {
      success: false,
      message: error instanceof Error
        ? error.message
        : "Failed to update customer",
    };
  }
}

export async function getCustomerById(id: string) {
  try {
    const customer = await db.query.customers.findFirst({
      where: eq(customers.id, id),
      with: {
        addresses: {
          with: {
            division: true,
            district: true,
            zone: true,
          },
        },
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
        addresses: {
          with: {
            division: true,
            district: true,
            zone: true,
          },
        },
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

export async function deleteCustomer(id: string) {
  try {
    // Check if customer has any sales
    const relatedSales = await db.query.sales.findFirst({
      where: eq(sales.customerId, id),
    });

    if (relatedSales) {
      return {
        success: false,
        message: "Cannot delete customer with existing sales records. Please delete or reassign the sales first.",
      };
    }

    const [customer] = await db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning();

    if (!customer) {
      return {
        success: false,
        message: `Customer with ID ${id} not found`,
      };
    }

    // Revalidate cache
    revalidateTag("customers");

    return {
      success: true,
      message: "Customer deleted successfully",
      customer,
    };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return {
      success: false,
      message: error instanceof Error
        ? error.message
        : "Failed to delete customer",
    };
  }
}
