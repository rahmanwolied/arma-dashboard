'use server';

import prisma from '@/prisma';

export interface CattleStats {
  totalCows: number;
  totalCost: number;
  locationWithHighestCount: {
    location: string;
    count: number;
  };
  averageWeight: number;
  cowsBoughtThisMonth: number;
}

export async function getCattleStatistics(): Promise<CattleStats> {
  try {
    // Get total number of cows
    const totalCows = await prisma.cattle.count();

    // Get cows bought this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const cowsBoughtThisMonth = await prisma.cattlePurchase.count({
      where: {
        purchaseDate: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    // Get total cost of all cattle purchases
    const totalCostResult = await prisma.cattlePurchase.aggregate({
      _sum: {
        purchasePricePerKg: true,
        liveWeight: true
      }
    });

    // Calculate total cost (price per kg * weight for each cow)
    const cattlePurchases = await prisma.cattlePurchase.findMany({
      select: {
        purchasePricePerKg: true,
        liveWeight: true
      }
    });

    const totalCost = cattlePurchases.reduce((sum, purchase) => {
      return sum + purchase.purchasePricePerKg * purchase.liveWeight;
    }, 0);

    // Get location with highest count
    const locationCounts = await prisma.cattlePurchase.groupBy({
      by: ['purchaseLocation'],
      _count: {
        purchaseLocation: true
      },
      orderBy: {
        _count: {
          purchaseLocation: 'desc'
        }
      },
      take: 1
    });

    const locationWithHighestCount = locationCounts[0]
      ? {
          location: locationCounts[0].purchaseLocation,
          count: locationCounts[0]._count.purchaseLocation
        }
      : {
          location: 'No data',
          count: 0
        };

    // Get average cow weight
    const averageWeightResult = await prisma.cattlePurchase.aggregate({
      _avg: {
        liveWeight: true
      }
    });

    const averageWeight = Math.round(averageWeightResult._avg.liveWeight || 0);

    return {
      totalCows,
      totalCost: Math.round(totalCost),
      locationWithHighestCount,
      averageWeight,
      cowsBoughtThisMonth
    };
  } catch (error) {
    console.error('Error fetching cattle statistics:', error);
    throw new Error('Failed to fetch cattle statistics');
  } finally {
    await prisma.$disconnect();
  }
}

// Alternative action that returns formatted data for display
export async function getCattleStatisticsFormatted(): Promise<{
  totalCows: string;
  totalCost: string;
  locationWithHighestCount: {
    location: string;
    count: string;
  };
  averageWeight: string;
  cowsBoughtThisMonth: string;
}> {
  try {
    const stats = await getCattleStatistics();

    return {
      totalCows: stats.totalCows.toLocaleString(),
      totalCost: `৳${stats.totalCost.toLocaleString()}`,
      locationWithHighestCount: {
        location: `${stats.locationWithHighestCount.location}`,
        count: `${stats.locationWithHighestCount.count}`
      },
      averageWeight: `${stats.averageWeight} kg`,
      cowsBoughtThisMonth: `${stats.cowsBoughtThisMonth}`
    };
  } catch (error) {
    console.error('Error fetching formatted cattle statistics:', error);
    throw new Error('Failed to fetch formatted cattle statistics');
  }
}

// Detailed statistics action with additional breakdown
export async function getDetailedCattleStatistics(): Promise<{
  basic: CattleStats;
  breakdown: {
    healthStatus: { status: string; count: number; percentage: number }[];
    cattleClass: { class: string; count: number; percentage: number }[];
    genderDistribution: { gender: string; count: number; percentage: number }[];
    locationBreakdown: { location: string; count: number; totalCost: number }[];
  };
}> {
  try {
    const basic = await getCattleStatistics();

    // Health status breakdown
    const healthStatusCounts = await prisma.cattle.groupBy({
      by: ['healthStatus'],
      _count: {
        healthStatus: true
      }
    });

    const healthStatus = healthStatusCounts.map((item) => ({
      status: item.healthStatus,
      count: item._count.healthStatus,
      percentage: Math.round((item._count.healthStatus / basic.totalCows) * 100)
    }));

    // Cattle class breakdown
    const cattleClassCounts = await prisma.cattle.groupBy({
      by: ['cattleClass'],
      _count: {
        cattleClass: true
      }
    });

    const cattleClass = cattleClassCounts.map((item) => ({
      class: item.cattleClass,
      count: item._count.cattleClass,
      percentage: Math.round((item._count.cattleClass / basic.totalCows) * 100)
    }));

    // Gender distribution
    const genderCounts = await prisma.cattle.groupBy({
      by: ['gender'],
      _count: {
        gender: true
      }
    });

    const genderDistribution = genderCounts.map((item) => ({
      gender: item.gender,
      count: item._count.gender,
      percentage: Math.round((item._count.gender / basic.totalCows) * 100)
    }));

    // Location breakdown with costs
    const locationData = await prisma.cattlePurchase.groupBy({
      by: ['purchaseLocation'],
      _count: {
        purchaseLocation: true
      },
      _sum: {
        purchasePricePerKg: true,
        liveWeight: true
      }
    });

    const locationBreakdown = locationData
      .map((item) => ({
        location: item.purchaseLocation,
        count: item._count.purchaseLocation,
        totalCost:
          Math.round(
            ((item._sum.purchasePricePerKg || 0) *
              (item._sum.liveWeight || 0)) /
              item._count.purchaseLocation
          ) * item._count.purchaseLocation
      }))
      .sort((a, b) => b.count - a.count);

    return {
      basic,
      breakdown: {
        healthStatus,
        cattleClass,
        genderDistribution,
        locationBreakdown
      }
    };
  } catch (error) {
    console.error('Error fetching detailed cattle statistics:', error);
    throw new Error('Failed to fetch detailed cattle statistics');
  } finally {
    await prisma.$disconnect();
  }
}
