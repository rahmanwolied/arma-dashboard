'use server';

import { matchSorter } from 'match-sorter'; // For filtering
import prisma from '@/prisma';
import type {
  Cattle,
  CattleClass,
  Gender,
  CattlePurchase,
  CattleSale
} from '@/prisma/generated/prisma';
import type { formSchema } from './components/cattle-form';
import type { z } from 'zod';

export type FlattenedCattle = Cattle & CattlePurchase & Partial<CattleSale>;

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
  records: [] as (Cattle & {
    cattlePurchase: CattlePurchase;
    cattleSale: CattleSale | null;
  })[],

  // Initialize with sample data
  async initialize() {
    this.records = await prisma.cattle.findMany({
      orderBy: {
        cattleNumber: 'asc'
      },
      include: {
        cattlePurchase: true,
        cattleSale: true
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
        for (const status of healthStatuses) {
          cattle = cattle.filter((c) => {
            if (status.isBool) return c[status.value as keyof Cattle];

            return c.healthStatus === status.value;
          });
        }
      }
    }

    // Filter by purchase price per kg
    if (purchasePricePerKg) {
      const [min, max] = purchasePricePerKg.split(',').map(Number);
      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        cattle = cattle.filter((cattle) => {
          const pricePerKg = cattle.cattlePurchase.purchasePricePerKg;
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
      if (!Number.isNaN(filterDate.getTime())) {
        cattle = cattle.filter((cattle) => {
          const cattlePurchaseDate = new Date(
            cattle.cattlePurchase.purchaseDate
          );
          return cattlePurchaseDate >= filterDate;
        });
      }
    }

    // Filter by purchase price (calculated from purchasePricePerKg * liveWeight)
    if (purchasePrice) {
      const price = Number.parseFloat(purchasePrice);
      if (!Number.isNaN(price)) {
        cattle = cattle.filter((cattle) => {
          const totalPrice =
            cattle.cattlePurchase.purchasePricePerKg *
            cattle.cattlePurchase.liveWeight;
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
  sortCattle(
    cattle: (Cattle & {
      cattlePurchase: CattlePurchase;
      cattleSale: CattleSale | null;
    })[],
    sort?: string
  ) {
    if (!sort) {
      return cattle;
    }

    let sortCriteria: Array<{ id: string; desc: boolean }>;
    try {
      sortCriteria = JSON.parse(sort);
    } catch (error) {
      console.error('Failed to parse sort criteria:', error);
      return cattle; // Return unsorted if sort is invalid
    }

    if (!Array.isArray(sortCriteria) || sortCriteria.length === 0) {
      return cattle;
    }

    const { id: field, desc } = sortCriteria[0];
    const isAsc = !desc;

    return cattle.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

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
          aValue = a.cattlePurchase.liveWeight || 0;
          bValue = b.cattlePurchase.liveWeight || 0;
          break;
        case 'purchasePricePerKg':
          aValue = a.cattlePurchase.purchasePricePerKg || 0;
          bValue = b.cattlePurchase.purchasePricePerKg || 0;
          break;
        case 'createdAt':
          aValue = new Date(a.cattlePurchase.purchaseDate).getTime();
          bValue = new Date(b.cattlePurchase.purchaseDate).getTime();
          break;
        case 'fatPercentage':
          aValue = a.cattlePurchase.fatPercentage || 0;
          bValue = b.cattlePurchase.fatPercentage || 0;
          break;
        case 'meatPercentage':
          aValue = a.cattlePurchase.meatPercentage || 0;
          bValue = b.cattlePurchase.meatPercentage || 0;
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

  async getCattle({
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

    const sortedCattle = this.sortCattle(allCattle, sort);

    const totalCattle = sortedCattle.length;

    const offset = (page - 1) * limit;
    const paginatedCattle = sortedCattle.slice(offset, offset + limit);
    const currentTime = new Date().toISOString();

    const flattenedCattle: FlattenedCattle[] = paginatedCattle.map(
      (cattle) => ({
        ...cattle,
        ...cattle.cattlePurchase,
        ...cattle.cattleSale
      })
    );

    return {
      success: true,
      time: currentTime,
      message: 'Cattle fetched successfully',
      total_cattle: totalCattle,
      offset,
      limit,
      cattle: flattenedCattle
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

export const createCattle = async (values: z.infer<typeof formSchema>) => {
  const latestCattle = await prisma.cattle.findFirst({
    orderBy: { cattleNumber: 'desc' },
    select: { cattleNumber: true }
  });

  const newCattleNumber = (latestCattle?.cattleNumber || 0) + 1;

  const newCattle = await prisma.cattle.create({
    data: {
      cattleNumber: newCattleNumber,
      gender: values.gender as Gender,
      cattleClass: values.cattleClass as CattleClass,
      name: values.name,
      isVaccinated: values.isVaccinated,
      isPregnant: values.isPregnant,
      isLactating: values.isLactating,
      isQuarantined: values.isQuarantined,
      cattlePurchase: {
        create: {
          purchaseDate: new Date(),
          purchasePricePerKg: Number(values.purchasePricePerKg),
          liveWeight: Number(values.liveWeight),
          fatPercentage: Number(values.fatPercentage),
          meatPercentage: Number(values.meatPercentage),
          purchaseLocation: 'Default Location' // Or get from form
        }
      }
    },
    include: {
      cattlePurchase: true
    }
  });

  return newCattle;
};
