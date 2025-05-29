'use server';

import prisma from '@/prisma';
import { matchSorter } from 'match-sorter'; // For filtering
import {
  Cattle,
  Customer,
  Transaction,
  TransactionItem
} from '@/prisma/generated/prisma';
import { TTransactionSchema } from './components/transaction-schema';

export async function createTransaction(formData: TTransactionSchema) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: {
          id: formData.customer.id || ''
        },
        update: {},
        create: {
          name: formData.customer.name,
          phone: formData.customer.phone,
          address: formData.customer.address || ''
        }
      });

      const cattle = await tx.cattle.findFirst({
        where: {
          AND: [
            {
              cattleNumber: Number(formData.cattleNumber)
            },
            {
              isSold: false
            }
          ]
        },
        select: {
          id: true,
          cattleNumber: true,
          isSold: true,
          liveWeight: true,
          purchasePricePerKg: true
        }
      });

      if (!cattle) {
        throw new Error('Cattle not found');
      }

      const maxSerialNumber = await tx.transaction.findFirst({
        orderBy: {
          serialNumber: 'desc'
        }
      });

      const serialNumber = maxSerialNumber?.serialNumber
        ? maxSerialNumber.serialNumber + 1
        : 1;

      const transaction = await tx.transaction.create({
        data: {
          customerId: customer.id,
          remarks: formData.remarks,
          serialNumber
        }
      });

      const totalPrice = cattle.liveWeight * formData.salePriceKg;

      const paymentStatus =
        formData.paidAmount === totalPrice
          ? 'PAID'
          : formData.paidAmount && formData.paidAmount > totalPrice
            ? 'PARTIALLY_PAID'
            : 'PENDING';

      const transactionItem = await tx.transactionItem.create({
        data: {
          transactionId: transaction.id,
          cattleId: cattle.id,
          estimatedSalePriceKg: cattle.purchasePricePerKg,
          actualSalePriceKg: formData.salePriceKg,
          paymentStatus,
          paymentMethod: formData.paymentMethod,
          paidAmount: formData.paidAmount || 0,
          totalPrice
        }
      });

      await tx.cattle.update({
        where: { id: cattle.id },
        data: { isSold: true }
      });

      return transaction;
    });

    return {
      success: true,
      message: 'Transaction created successfully',
      transaction: result
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Failed to create transaction',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

const transactionActions = {
  records: [] as (Transaction & {
    customer: Customer;
    transactionItem: TransactionItem;
    cattle: Cattle;
  })[], // Holds the list of product objects

  // Initialize with sample data
  async initialize() {
    const records = await prisma.transaction.findMany({
      include: {
        customer: true,
        transactionItems: {
          include: {
            cattle: true
          }
        }
      }
    });
    this.records = records.map((transaction) => ({
      id: transaction.id,
      customerId: transaction.customerId,
      serialNumber: transaction.serialNumber,
      remarks: transaction.remarks,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      customer: transaction.customer,
      transactionItem: transaction.transactionItems[0],
      cattle: transaction.transactionItems[0].cattle
    }));
  },

  // Get all cattle with optional category filtering and search
  async getAll({ search, status }: { search?: string; status?: string }) {
    let transactions = [...this.records];

    // Search functionality across multiple fields
    if (search) {
      transactions = matchSorter(transactions, search, {
        keys: ['customer.name']
      });
    }
    if (status) {
      transactions = transactions.filter((transaction) => {
        const statusMatch =
          !status ||
          (status === 'old'
            ? transaction.customer.name.length % 2 === 0
            : transaction.customer.name.length % 2 !== 0) ||
          status === 'old,new' ||
          status === 'new,old';
        return statusMatch;
      });
    }

    return transactions;
  },

  // Get paginated results with optional category filtering and search
  async getTransactions({
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
    const allTransactions = await this.getAll({
      search,
      status
    });
    const totalTransactions = allTransactions.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedTransactions = allTransactions.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();
    console.log(paginatedTransactions);
    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_transactions: totalTransactions,
      offset,
      limit,
      transactions: paginatedTransactions
    };
  },

  // Get a specific product by its ID
  async getTransactionById(id: string) {
    // Find the cattle by its ID
    const transaction = this.records.find(
      (transaction) => transaction.id === id
    );

    if (!transaction) {
      return {
        success: false,
        message: `Transaction with ID ${id} not found`
      };
    }

    return {
      success: true,
      message: `Transaction with ID ${id} found`,
      transaction
    };
  }
};

export async function initializeTransactionActions() {
  await transactionActions.initialize();
  return transactionActions;
}
