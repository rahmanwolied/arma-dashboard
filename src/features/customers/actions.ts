'use server';

import prisma from '@/prisma';
import { formSchema } from './components/customer-form';
import { z } from 'zod';
import { matchSorter } from 'match-sorter'; // For filtering
import { Customer } from '@/prisma/generated/prisma';

export async function getCustomers() {
  return await prisma.customer.findMany();
}

export async function createCustomer(formData: z.infer<typeof formSchema>) {
  const { name, address, phone } = formData;

  await prisma.customer.create({
    data: {
      name,
      address,
      phone
    }
  });
}

const customerActions = {
  records: [] as Customer[], // Holds the list of product objects

  // Initialize with sample data
  async initialize() {
    this.records = await prisma.customer.findMany();
  },

  // Get all cattle with optional category filtering and search
  async getAll({ search, status }: { search?: string; status?: string }) {
    let customers = [...this.records];

    // Search functionality across multiple fields
    if (search) {
      customers = matchSorter(customers, search, {
        keys: ['name']
      });
    }
    if (status) {
      customers = customers.filter((customer) => {
        const statusMatch =
          !status ||
          (status === 'old'
            ? customer.name.length % 2 === 0
            : customer.name.length % 2 !== 0) ||
          status === 'old,new' ||
          status === 'new,old';
        return statusMatch;
      });
    }

    return customers;
  },

  // Get paginated results with optional category filtering and search
  async getCustomers({
    page = 1,
    limit = 10,
    search,
    status
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const allCustomers = await this.getAll({
      search,
      status
    });
    const totalCustomers = allCustomers.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedCustomers = allCustomers.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_customers: totalCustomers,
      offset,
      limit,
      customers: paginatedCustomers
    };
  },

  // Get a specific product by its ID
  async getCustomerById(id: string) {
    // Find the cattle by its ID
    const customer = this.records.find((customer) => customer.id === id);

    if (!customer) {
      return {
        success: false,
        message: `Customer with ID ${id} not found`
      };
    }

    return {
      success: true,
      message: `Customer with ID ${id} found`,
      customer
    };
  }
};

export async function initializeCustomerActions() {
  await customerActions.initialize();
  return customerActions;
}
