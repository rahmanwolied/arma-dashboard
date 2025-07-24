// prisma/seed.ts
import prisma from '@/prisma';
import { Gender } from '@/prisma/generated/prisma';

// const prisma = new PrismaClient();

interface CattleData {
  cattleNumber: number | string;
  purchaseLiveWeight: number;
  purchasePricePerKg: number;
  actualPurchaseValue: number;
  averagePurchaseValuePerKg?: number;
  averagePurchaseValuePerCattle?: number;
}

interface PurchaseEvent {
  date: Date;
  location: string;
  totalLiveWeight: number;
  totalActualPurchaseValue: number;
  cattle: CattleData[];
}

const allPurchaseData: PurchaseEvent[] = [
  {
    date: new Date('2025-06-27'),
    location: 'AAL',
    totalLiveWeight: 5992,
    totalActualPurchaseValue: 2540591.0,
    cattle: [
      {
        cattleNumber: 1,
        purchaseLiveWeight: 408,
        purchasePricePerKg: 450.0,
        actualPurchaseValue: 183600.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 172992.0
      },
      {
        cattleNumber: 2,
        purchaseLiveWeight: 432,
        purchasePricePerKg: 450.0,
        actualPurchaseValue: 194400.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 183168.0
      },
      {
        cattleNumber: 3,
        purchaseLiveWeight: 362,
        purchasePricePerKg: 450.0,
        actualPurchaseValue: 162900.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 153488.0
      },
      {
        cattleNumber: 4,
        purchaseLiveWeight: 392,
        purchasePricePerKg: 450.0,
        actualPurchaseValue: 176400.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 166208.0
      },
      {
        cattleNumber: 5,
        purchaseLiveWeight: 359,
        purchasePricePerKg: 450.0,
        actualPurchaseValue: 161550.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 152216.0
      },
      {
        cattleNumber: 6,
        purchaseLiveWeight: 367,
        purchasePricePerKg: 450.0,
        actualPurchaseValue: 165150.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 155608.0
      },
      {
        cattleNumber: 7,
        purchaseLiveWeight: 448,
        purchasePricePerKg: 400.0,
        actualPurchaseValue: 179200.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 189952.0
      },
      {
        cattleNumber: 8,
        purchaseLiveWeight: 323,
        purchasePricePerKg: 450.0,
        actualPurchaseValue: 145350.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 136952.0
      },
      {
        cattleNumber: 9,
        purchaseLiveWeight: 296,
        purchasePricePerKg: 450.0,
        actualPurchaseValue: 133200.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 125504.0
      },
      {
        cattleNumber: 10,
        purchaseLiveWeight: 322,
        purchasePricePerKg: 450.0,
        actualPurchaseValue: 144900.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 136528.0
      },
      {
        cattleNumber: 11,
        purchaseLiveWeight: 133,
        purchasePricePerKg: 400.0,
        actualPurchaseValue: 53200.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 56392.0
      },
      {
        cattleNumber: 12,
        purchaseLiveWeight: 139,
        purchasePricePerKg: 400.0,
        actualPurchaseValue: 55600.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 58936.0
      },
      {
        cattleNumber: 13,
        purchaseLiveWeight: 141,
        purchasePricePerKg: 400.0,
        actualPurchaseValue: 56400.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 59784.0
      },
      {
        cattleNumber: 14,
        purchaseLiveWeight: 317,
        purchasePricePerKg: 408.0,
        actualPurchaseValue: 129336.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 134408.0
      },
      {
        cattleNumber: 15,
        purchaseLiveWeight: 100,
        purchasePricePerKg: 401.0,
        actualPurchaseValue: 40100.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 42400.0
      },
      {
        cattleNumber: 16,
        purchaseLiveWeight: 167,
        purchasePricePerKg: 400.0,
        actualPurchaseValue: 66800.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 70808.0
      },
      {
        cattleNumber: 17,
        purchaseLiveWeight: 147,
        purchasePricePerKg: 345.0,
        actualPurchaseValue: 50715.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 62328.0
      },
      {
        cattleNumber: '18',
        purchaseLiveWeight: 148,
        purchasePricePerKg: 370.0,
        actualPurchaseValue: 54760.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 62752.0
      },
      {
        cattleNumber: '19',
        purchaseLiveWeight: 150,
        purchasePricePerKg: 365.0,
        actualPurchaseValue: 54750.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 63600.0
      },
      {
        cattleNumber: '20',
        purchaseLiveWeight: 220,
        purchasePricePerKg: 405.0,
        actualPurchaseValue: 89100.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 93280.0
      },
      {
        cattleNumber: '21',
        purchaseLiveWeight: 249,
        purchasePricePerKg: 412.0,
        actualPurchaseValue: 102588.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 105576.0
      },
      {
        cattleNumber: '22',
        purchaseLiveWeight: 192,
        purchasePricePerKg: 421.0,
        actualPurchaseValue: 80832.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 81408.0
      },
      {
        cattleNumber: '23',
        purchaseLiveWeight: 180,
        purchasePricePerKg: 332.0,
        actualPurchaseValue: 59760.0,
        averagePurchaseValuePerKg: 424.0,
        averagePurchaseValuePerCattle: 76320.0
      }
    ]
  },
  {
    date: new Date('2025-06-27'),
    location: 'AAL,Beef Breeding',
    totalLiveWeight: 302,
    totalActualPurchaseValue: 120800.0,
    cattle: [
      {
        cattleNumber: '24',
        purchaseLiveWeight: 164,
        purchasePricePerKg: 400.0,
        actualPurchaseValue: 65600.0,
        averagePurchaseValuePerKg: 400.0,
        averagePurchaseValuePerCattle: 65600.0
      },
      {
        cattleNumber: '25',
        purchaseLiveWeight: 138,
        purchasePricePerKg: 400.0,
        actualPurchaseValue: 55200.0,
        averagePurchaseValuePerKg: 400.0,
        averagePurchaseValuePerCattle: 55200.0
      }
    ]
  },
  {
    date: new Date('2025-07-02'),
    location: 'Manikganj',
    totalLiveWeight: 461,
    totalActualPurchaseValue: 179790.42,
    cattle: [
      {
        cattleNumber: '26',
        purchaseLiveWeight: 157,
        purchasePricePerKg: 373.0,
        actualPurchaseValue: 58561.0,
        averagePurchaseValuePerKg: 390.0,
        averagePurchaseValuePerCattle: 61230.0
      },
      {
        cattleNumber: '27',
        purchaseLiveWeight: 158,
        purchasePricePerKg: 378.0,
        actualPurchaseValue: 59724.0,
        averagePurchaseValuePerKg: 390.0,
        averagePurchaseValuePerCattle: 61620.0
      },
      {
        cattleNumber: '28',
        purchaseLiveWeight: 146,
        purchasePricePerKg: 421.27,
        actualPurchaseValue: 61505.42,
        averagePurchaseValuePerKg: 390.0,
        averagePurchaseValuePerCattle: 56940.0
      }
    ]
  },
  {
    date: new Date('2025-07-06'),
    location: 'Manikganj',
    totalLiveWeight: 1411,
    totalActualPurchaseValue: 555928.6,
    cattle: [
      {
        cattleNumber: 29,
        purchaseLiveWeight: 123,
        purchasePricePerKg: 363.0,
        actualPurchaseValue: 44649.0,
        averagePurchaseValuePerKg: 394.0,
        averagePurchaseValuePerCattle: 48462.0
      },
      {
        cattleNumber: 30,
        purchaseLiveWeight: 138,
        purchasePricePerKg: 378.0,
        actualPurchaseValue: 52164.0,
        averagePurchaseValuePerKg: 394.0,
        averagePurchaseValuePerCattle: 54372.0
      },
      {
        cattleNumber: 31,
        purchaseLiveWeight: 163,
        purchasePricePerKg: 444.0,
        actualPurchaseValue: 72372.0,
        averagePurchaseValuePerKg: 394.0,
        averagePurchaseValuePerCattle: 64222.0
      },
      {
        cattleNumber: 32,
        purchaseLiveWeight: 181,
        purchasePricePerKg: 400.0,
        actualPurchaseValue: 72400.0,
        averagePurchaseValuePerKg: 394.0,
        averagePurchaseValuePerCattle: 71314.0
      },
      {
        cattleNumber: 33,
        purchaseLiveWeight: 179,
        purchasePricePerKg: 421.0,
        actualPurchaseValue: 75359.0,
        averagePurchaseValuePerKg: 394.0,
        averagePurchaseValuePerCattle: 70526.0
      },
      {
        cattleNumber: '34',
        purchaseLiveWeight: 194,
        purchasePricePerKg: 389.0,
        actualPurchaseValue: 75466.0,
        averagePurchaseValuePerKg: 394.0,
        averagePurchaseValuePerCattle: 76436.0
      },
      {
        cattleNumber: '35',
        purchaseLiveWeight: 174,
        purchasePricePerKg: 378.0,
        actualPurchaseValue: 65772.0,
        averagePurchaseValuePerKg: 394.0,
        averagePurchaseValuePerCattle: 68556.0
      },
      {
        cattleNumber: '36',
        purchaseLiveWeight: 259,
        purchasePricePerKg: 377.4,
        actualPurchaseValue: 97746.6,
        averagePurchaseValuePerKg: 394.0,
        averagePurchaseValuePerCattle: 102046.0
      }
    ]
  },
  {
    date: new Date('2025-07-09'),
    location: 'Mataji Hat,Mahadevpur,Naogaon',
    totalLiveWeight: 1261,
    totalActualPurchaseValue: 544746.03,
    cattle: [
      {
        cattleNumber: '37',
        purchaseLiveWeight: 160,
        purchasePricePerKg: 413.0,
        actualPurchaseValue: 66080.0,
        averagePurchaseValuePerKg: 432.0,
        averagePurchaseValuePerCattle: 69120.0
      },
      {
        cattleNumber: '38',
        purchaseLiveWeight: 150,
        purchasePricePerKg: 466.0,
        actualPurchaseValue: 69900.0,
        averagePurchaseValuePerKg: 432.0,
        averagePurchaseValuePerCattle: 64800.0
      },
      {
        cattleNumber: '39',
        purchaseLiveWeight: 145,
        purchasePricePerKg: 482.0,
        actualPurchaseValue: 69890.0,
        averagePurchaseValuePerKg: 432.0,
        averagePurchaseValuePerCattle: 62640.0
      },
      {
        cattleNumber: '40',
        purchaseLiveWeight: 158,
        purchasePricePerKg: 472.0,
        actualPurchaseValue: 74576.0,
        averagePurchaseValuePerKg: 432.0,
        averagePurchaseValuePerCattle: 68256.0
      },
      {
        cattleNumber: '41',
        purchaseLiveWeight: 168.5,
        purchasePricePerKg: 408.0,
        actualPurchaseValue: 68748.0,
        averagePurchaseValuePerKg: 432.0,
        averagePurchaseValuePerCattle: 72792.0
      },
      {
        cattleNumber: '42',
        purchaseLiveWeight: 146.5,
        purchasePricePerKg: 426.0,
        actualPurchaseValue: 62409.0,
        averagePurchaseValuePerKg: 432.0,
        averagePurchaseValuePerCattle: 63288.0
      },
      {
        cattleNumber: '43',
        purchaseLiveWeight: 194.5,
        purchasePricePerKg: 402.0,
        actualPurchaseValue: 78189.0,
        averagePurchaseValuePerKg: 432.0,
        averagePurchaseValuePerCattle: 84024.0
      },
      {
        cattleNumber: '44',
        purchaseLiveWeight: 138.5,
        purchasePricePerKg: 396.78,
        actualPurchaseValue: 54954.03,
        averagePurchaseValuePerKg: 432.0,
        averagePurchaseValuePerCattle: 59832.0
      }
    ]
  },
  {
    date: new Date('2025-07-11'),
    location: 'Choubaria Hat,Manda,Naogaon',
    totalLiveWeight: 4709,
    totalActualPurchaseValue: 1902431.4,
    cattle: [
      {
        cattleNumber: '45',
        purchaseLiveWeight: 140,
        purchasePricePerKg: 420.0,
        actualPurchaseValue: 58800.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 56560.0
      },
      {
        cattleNumber: '46',
        purchaseLiveWeight: 154,
        purchasePricePerKg: 422.0,
        actualPurchaseValue: 64988.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 62216.0
      },
      {
        cattleNumber: '47',
        purchaseLiveWeight: 145,
        purchasePricePerKg: 378.0,
        actualPurchaseValue: 54810.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 58580.0
      },
      {
        cattleNumber: '48',
        purchaseLiveWeight: 161,
        purchasePricePerKg: 413.0,
        actualPurchaseValue: 66493.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 65044.0
      },
      {
        cattleNumber: '49',
        purchaseLiveWeight: 178,
        purchasePricePerKg: 341.0,
        actualPurchaseValue: 60698.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 71912.0
      },
      {
        cattleNumber: '50',
        purchaseLiveWeight: 117,
        purchasePricePerKg: 415.0,
        actualPurchaseValue: 48555.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 47268.0
      },
      {
        cattleNumber: '51',
        purchaseLiveWeight: 180,
        purchasePricePerKg: 499.0,
        actualPurchaseValue: 89820.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 72720.0
      },
      {
        cattleNumber: '52',
        purchaseLiveWeight: 178,
        purchasePricePerKg: 504.0,
        actualPurchaseValue: 89712.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 71912.0
      },
      {
        cattleNumber: '53',
        purchaseLiveWeight: 159,
        purchasePricePerKg: 403.0,
        actualPurchaseValue: 64077.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 64236.0
      },
      {
        cattleNumber: '54',
        purchaseLiveWeight: 169,
        purchasePricePerKg: 386.0,
        actualPurchaseValue: 65234.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 68276.0
      },
      {
        cattleNumber: '55',
        purchaseLiveWeight: 166,
        purchasePricePerKg: 394.0,
        actualPurchaseValue: 65404.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 67064.0
      },
      {
        cattleNumber: '56',
        purchaseLiveWeight: 175,
        purchasePricePerKg: 379.0,
        actualPurchaseValue: 66325.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 70700.0
      },
      {
        cattleNumber: '57',
        purchaseLiveWeight: 147,
        purchasePricePerKg: 377.0,
        actualPurchaseValue: 55419.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 59388.0
      },
      {
        cattleNumber: '58',
        purchaseLiveWeight: 140,
        purchasePricePerKg: 395.0,
        actualPurchaseValue: 55300.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 56560.0
      },
      {
        cattleNumber: '59',
        purchaseLiveWeight: 160,
        purchasePricePerKg: 389.0,
        actualPurchaseValue: 62240.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 64640.0
      },
      {
        cattleNumber: '60',
        purchaseLiveWeight: 146,
        purchasePricePerKg: 417.0,
        actualPurchaseValue: 60882.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 58984.0
      },
      {
        cattleNumber: '61',
        purchaseLiveWeight: 165,
        purchasePricePerKg: 370.0,
        actualPurchaseValue: 61050.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 66660.0
      },
      {
        cattleNumber: '62',
        purchaseLiveWeight: 140,
        purchasePricePerKg: 413.0,
        actualPurchaseValue: 57820.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 56560.0
      },
      {
        cattleNumber: '63',
        purchaseLiveWeight: 167,
        purchasePricePerKg: 408.0,
        actualPurchaseValue: 68136.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 67468.0
      },
      {
        cattleNumber: '64',
        purchaseLiveWeight: 125,
        purchasePricePerKg: 397.0,
        actualPurchaseValue: 49625.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 50500.0
      },
      {
        cattleNumber: '65',
        purchaseLiveWeight: 155,
        purchasePricePerKg: 403.0,
        actualPurchaseValue: 62465.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 62620.0
      },
      {
        cattleNumber: '66',
        purchaseLiveWeight: 153,
        purchasePricePerKg: 394.0,
        actualPurchaseValue: 60282.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 61812.0
      },
      {
        cattleNumber: '67',
        purchaseLiveWeight: 148,
        purchasePricePerKg: 422.0,
        actualPurchaseValue: 62456.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 59792.0
      },
      {
        cattleNumber: '68',
        purchaseLiveWeight: 176,
        purchasePricePerKg: 393.0,
        actualPurchaseValue: 69168.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 71104.0
      },
      {
        cattleNumber: '69',
        purchaseLiveWeight: 148,
        purchasePricePerKg: 368.0,
        actualPurchaseValue: 54464.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 59792.0
      },
      {
        cattleNumber: '70',
        purchaseLiveWeight: 173,
        purchasePricePerKg: 391.0,
        actualPurchaseValue: 67643.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 69892.0
      },
      {
        cattleNumber: '71',
        purchaseLiveWeight: 164,
        purchasePricePerKg: 412.0,
        actualPurchaseValue: 67568.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 66256.0
      },
      {
        cattleNumber: '72',
        purchaseLiveWeight: 166,
        purchasePricePerKg: 407.0,
        actualPurchaseValue: 67562.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 67064.0
      },
      {
        cattleNumber: '73',
        purchaseLiveWeight: 167,
        purchasePricePerKg: 405.0,
        actualPurchaseValue: 67635.0,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 67468.0
      },
      {
        cattleNumber: '74',
        purchaseLiveWeight: 147,
        purchasePricePerKg: 393.2,
        actualPurchaseValue: 57800.4,
        averagePurchaseValuePerKg: 404.0,
        averagePurchaseValuePerCattle: 59388.0
      }
    ]
  },
  {
    date: new Date('2025-07-13'),
    location: 'Hargoz Hat,Manikganj',
    totalLiveWeight: 1295,
    totalActualPurchaseValue: 492094.7,
    cattle: [
      {
        cattleNumber: '75',
        purchaseLiveWeight: 185,
        purchasePricePerKg: 373.0,
        actualPurchaseValue: 69005.0,
        averagePurchaseValuePerKg: 380.0,
        averagePurchaseValuePerCattle: 70300.0
      },
      {
        cattleNumber: '76',
        purchaseLiveWeight: 205,
        purchasePricePerKg: 361.0,
        actualPurchaseValue: 74005.0,
        averagePurchaseValuePerKg: 380.0,
        averagePurchaseValuePerCattle: 77900.0
      },
      {
        cattleNumber: '77',
        purchaseLiveWeight: 116,
        purchasePricePerKg: 393.0,
        actualPurchaseValue: 45588.0,
        averagePurchaseValuePerKg: 380.0,
        averagePurchaseValuePerCattle: 44080.0
      },
      {
        cattleNumber: '78',
        purchaseLiveWeight: 144,
        purchasePricePerKg: 380.0,
        actualPurchaseValue: 54720.0,
        averagePurchaseValuePerKg: 380.0,
        averagePurchaseValuePerCattle: 54720.0
      },
      {
        cattleNumber: '79',
        purchaseLiveWeight: 184,
        purchasePricePerKg: 378.0,
        actualPurchaseValue: 69552.0,
        averagePurchaseValuePerKg: 380.0,
        averagePurchaseValuePerCattle: 69920.0
      },
      {
        cattleNumber: '80',
        purchaseLiveWeight: 155,
        purchasePricePerKg: 386.0,
        actualPurchaseValue: 59830.0,
        averagePurchaseValuePerKg: 380.0,
        averagePurchaseValuePerCattle: 58900.0
      },
      {
        cattleNumber: '81',
        purchaseLiveWeight: 143,
        purchasePricePerKg: 362.0,
        actualPurchaseValue: 51766.0,
        averagePurchaseValuePerKg: 380.0,
        averagePurchaseValuePerCattle: 54340.0
      },
      {
        cattleNumber: '82',
        purchaseLiveWeight: 163,
        purchasePricePerKg: 414.9,
        actualPurchaseValue: 67628.7,
        averagePurchaseValuePerKg: 380.0,
        averagePurchaseValuePerCattle: 61940.0
      }
    ]
  }
];
async function createCattleInBatches(event: PurchaseEvent, batchSize = 5) {
  const batches = [];
  for (let i = 0; i < event.cattle.length; i += batchSize) {
    batches.push(event.cattle.slice(i, i + batchSize));
  }

  let totalCreated = 0;

  for (const [index, batch] of batches.entries()) {
    try {
      await prisma.$transaction(
        async (tx) => {
          console.log(
            `Processing batch ${index + 1}/${batches.length} for ${
              event.location
            } (${batch.length} cattle)`
          );

          for (const cattleData of batch) {
            // Create CattlePurchase for each cattle
            const cattlePurchase = await tx.cattlePurchase.create({
              data: {
                purchaseDate: event.date,
                purchaseLocation: event.location,
                liveWeight: cattleData.purchaseLiveWeight,
                purchasePricePerKg: cattleData.purchasePricePerKg,
                meatPercentage: Math.floor(Math.random() * 30) + 50, // 50-80%
                fatPercentage: Math.floor(Math.random() * 10) + 5 // 5-15%
              }
            });

            // Create the associated Cattle record
            await tx.cattle.create({
              data: {
                cattleNumber: Number(cattleData.cattleNumber),
                cattlePurchaseId: cattlePurchase.id,
                gender: Gender.MALE,
                isVaccinated: false,
                isQuarantined: false,
                isPregnant: false,
                isLactating: false,
                isInseminated: false,
                healthStatus: 'HEALTHY'
              }
            });

            totalCreated++;
          }
        },
        {
          maxWait: 5000, // 5 seconds max wait
          timeout: 10000 // 10 seconds timeout
        }
      );

      console.log(`Batch ${index + 1} completed successfully`);
    } catch (error) {
      console.error(`Failed to process batch ${index + 1}:`, error);
      throw error; // Re-throw to stop execution
    }
  }

  return totalCreated;
}

async function main() {
  console.log('Start seeding...');

  for (const [eventIndex, event] of allPurchaseData.entries()) {
    try {
      console.log(
        `\nProcessing event ${eventIndex + 1}/${allPurchaseData.length}`
      );
      console.log(
        `Location: ${event.location}, Date: ${event.date.toDateString()}, Cattle Count: ${
          event.cattle.length
        }`
      );

      const createdCount = await createCattleInBatches(event);

      console.log(
        `✅ Successfully created ${createdCount} cattle for ${event.location}`
      );
    } catch (error) {
      console.error(`❌ Failed to process event for ${event.location}:`);
      throw error; // Stop execution on error
    }
  }

  console.log('\n🎉 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('\n💥 Seeding failed:', e.message);
    console.error('Full error:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Disconnecting from database...');
    await prisma.$disconnect();
  });
