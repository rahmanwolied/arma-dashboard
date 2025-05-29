'use server';

import { matchSorter } from 'match-sorter'; // For filtering
import prisma from '@/prisma';
import { Cattle, CattleClass } from '@/prisma/generated/prisma';

interface CattleFilters {
  cattleClass?: string;
  search?: string;
  healthStatus?: string;
  purchasePricePerKg?: string;
  fatPercentage?: string;
  cattleNumber?: string;
  purchaseDate?: string;
  purchasePrice?: string;
}

interface PaginatedCattleFilters extends CattleFilters {
  page?: number;
  limit?: number;
  sort?: string;
}

const cattleActions = {
  records: [] as Cattle[], // Holds the list of product objects

  // Initialize with sample data
  async initialize() {
    this.records = await prisma.cattle.findMany({
      orderBy: {
        cattleNumber: 'asc'
      }
    });
  },

  async getAll({
    cattleClass,
    search,
    healthStatus,
    purchasePricePerKg,
    fatPercentage,
    cattleNumber,
    purchaseDate,
    purchasePrice
  }: CattleFilters) {
    let cattle = [...this.records];

    // Filter by cattle class
    if (cattleClass) {
      const cattleClasses = cattleClass
        .split(',')
        .map((c) => c.trim().toLowerCase());
      if (cattleClasses.length > 0) {
        cattle = cattle.filter((c) =>
          c.cattleClass
            ? cattleClasses.includes(c.cattleClass.toLowerCase())
            : false
        );
      }
    }

    // Filter by health status
    if (healthStatus) {
      const healthStatuses = healthStatus.split(',').map((status) => ({
        value: status.trim(),
        isBool: status.startsWith('is')
      }));
      if (healthStatuses.length > 0) {
        healthStatuses.forEach((status) => {
          cattle = cattle.filter((c) => {
            if (status.isBool) return c[status.value as keyof Cattle];

            return c.healthStatus === status.value;
          });
        });
      }
    }

    // Filter by purchase price per kg
    if (purchasePricePerKg) {
      const [min, max] = purchasePricePerKg.split(',').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        cattle = cattle.filter((cattle) => {
          const pricePerKg = cattle.purchasePricePerKg;
          return pricePerKg >= min && pricePerKg <= max;
        });
      }
    }

    // Filter by cattle number
    if (cattleNumber) {
      cattle = cattle.filter((cattle) =>
        cattle.cattleNumber
          .toString()
          .toLowerCase()
          .includes(cattleNumber.toLowerCase())
      );
    }

    // Filter by purchase date (using createdAt as proxy for purchase date)
    if (purchaseDate) {
      const filterDate = new Date(purchaseDate);
      if (!isNaN(filterDate.getTime())) {
        cattle = cattle.filter((cattle) => {
          const cattlePurchaseDate = new Date(cattle.createdAt);
          return cattlePurchaseDate >= filterDate;
        });
      }
    }

    // Filter by purchase price (calculated from purchasePricePerKg * liveWeight)
    if (purchasePrice) {
      const price = parseFloat(purchasePrice);
      if (!isNaN(price)) {
        cattle = cattle.filter((cattle) => {
          const totalPrice = cattle.purchasePricePerKg * cattle.liveWeight;
          return totalPrice >= price;
        });
      }
    }

    // Search functionality across multiple fields
    if (search) {
      cattle = matchSorter(cattle, search, {
        keys: ['cattleNumber', 'name']
      });
    }

    return cattle;
  },

  // Sort cattle based on the sort parameter
  sortCattle(cattle: Cattle[], sort?: string) {
    if (!sort) {
      return cattle;
    }

    let sortCriteria: Array<{ id: string; desc: boolean }>;
    try {
      sortCriteria = JSON.parse(sort);
    } catch (error) {
      console.error('Failed to parse sort parameter JSON:', sort, error);
      return cattle; // Return unsorted if JSON is invalid
    }

    if (
      !Array.isArray(sortCriteria) ||
      sortCriteria.length === 0 ||
      !sortCriteria[0] ||
      typeof sortCriteria[0].id !== 'string' ||
      typeof sortCriteria[0].desc !== 'boolean'
    ) {
      console.warn('Invalid or empty sort criteria:', sortCriteria);
      return cattle; // Return unsorted if criteria are not in the expected format
    }

    // Assuming single sort criterion based on the new format example and previous logic.
    // If multiple sort criteria were to be handled, this would need to iterate
    // or use a more complex comparison logic.
    const { id: field, desc } = sortCriteria[0];
    const isAsc = !desc;

    return cattle.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (field) {
        case 'cattleNumber':
          aValue = a.cattleNumber;
          bValue = b.cattleNumber;
          break;
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'liveWeight':
          aValue = a.liveWeight || 0;
          bValue = b.liveWeight || 0;
          break;
        case 'purchasePricePerKg':
          aValue = a.purchasePricePerKg || 0;
          bValue = b.purchasePricePerKg || 0;
          break;
        case 'createdAt': // Assuming this refers to purchaseDate or a similar timestamp
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'fatPercentage':
          aValue = a.fatPercentage || 0;
          bValue = b.fatPercentage || 0;
          break;
        case 'meatPercentage':
          aValue = a.meatPercentage || 0;
          bValue = b.meatPercentage || 0;
          break;
        case 'healthStatus':
          aValue = a.healthStatus || '';
          bValue = b.healthStatus || '';
          break;
        case 'cattleClass':
          aValue = a.cattleClass;
          bValue = b.cattleClass;
          break;
        case 'gender':
          aValue = a.gender;
          bValue = b.gender;
          break;
        default:
          return 0;
      }

      // Comparison logic
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return isAsc
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return isAsc ? -1 : 1;
      if (aValue > bValue) return isAsc ? 1 : -1;
      return 0;
    });
  },

  // Get paginated results with comprehensive filtering and sorting
  async getProducts({
    page = 1,
    limit = 10,
    cattleClass,
    search,
    sort,
    healthStatus,
    purchasePricePerKg,
    fatPercentage,
    cattleNumber,
    purchaseDate,
    purchasePrice
  }: PaginatedCattleFilters) {
    const allCattle = await this.getAll({
      cattleClass,
      search,
      healthStatus,
      purchasePricePerKg,
      fatPercentage,
      cattleNumber,
      purchaseDate,
      purchasePrice
    });

    // Apply sorting
    const sortedCattle = this.sortCattle(allCattle, sort);

    const totalCattle = sortedCattle.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedCattle = sortedCattle.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Cattle fetched successfully',
      total_cattle: totalCattle,
      offset,
      limit,
      cattle: paginatedCattle
    };
  },

  async getCattleById(id: string) {
    const cattle = this.records.find((cattle) => cattle.id === id);

    if (!cattle) {
      return {
        success: false,
        message: `Cattle with ID ${id} not found`
      };
    }

    return {
      success: true,
      message: `Cattle with ID ${id} found`,
      cattle
    };
  }
};

export async function initializeCattleActions() {
  await cattleActions.initialize();
  return cattleActions;
}
