import prisma from '../src/prisma';
import { Decimal } from '@prisma/client/runtime/library';

// CSV data from the user
const csvData = [
  {
    slNo: '1',
    cowNo: '1',
    customerName: 'Freedom Fighter Kazi A. Mannan',
    customerAddress: '108, Dhupchhaya, Lakes Circus, Kolabagan, Dhaka',
    mobileNo: '01715-547334',
    cowWeight: '243',
    estimatedSalePricePerKg: '500.00',
    actualSalePricePerKg: '494.00',
    totalPrice: '120000.00',
    meatPercentage: '58%',
    fatPercentage: '1%',
    remarks: ''
  },
  {
    slNo: '2',
    cowNo: '2',
    customerName: 'Md. Shah Alam (Bultu)',
    customerAddress: '',
    mobileNo: '01712-807497',
    cowWeight: '241',
    estimatedSalePricePerKg: '500.00',
    actualSalePricePerKg: '470.00',
    totalPrice: '113000.00',
    meatPercentage: '58%',
    fatPercentage: '1%',
    remarks: ''
  },
  {
    slNo: '3',
    cowNo: '3',
    customerName: 'Khandakar Shahin',
    customerAddress: 'Block-C, Road No.-11, Bonosree',
    mobileNo: '01711-533488',
    cowWeight: '248',
    estimatedSalePricePerKg: '500.00',
    actualSalePricePerKg: '470.00',
    totalPrice: '116560.00',
    meatPercentage: '58%',
    fatPercentage: '1%',
    remarks: ''
  },
  {
    slNo: '4',
    cowNo: '4',
    customerName: 'Mohammad Shoeb',
    customerAddress: 'House-52/2, East Hajipara, Rampura, Dhaka',
    mobileNo: '01712-067447',
    cowWeight: '283',
    estimatedSalePricePerKg: '525.00',
    actualSalePricePerKg: '460.00',
    totalPrice: '128000.00',
    meatPercentage: '61%',
    fatPercentage: '1%',
    remarks: 'Discount – 2,180'
  },
  {
    slNo: '5',
    cowNo: '5',
    customerName: 'Khandakar Shahin',
    customerAddress: 'Block-C, Road No.-11, Bonosree',
    mobileNo: '',
    cowWeight: '238',
    estimatedSalePricePerKg: '525.00',
    actualSalePricePerKg: '470.00',
    totalPrice: '111860.00',
    meatPercentage: '58%',
    fatPercentage: '1%',
    remarks: ''
  },
  {
    slNo: '6',
    cowNo: '6',
    customerName: 'Adv. Monir Molla (Haji Abul Khair)',
    customerAddress: '',
    mobileNo: '01711-989035',
    cowWeight: '252',
    estimatedSalePricePerKg: '500.00',
    actualSalePricePerKg: '490.00',
    totalPrice: '123000.00',
    meatPercentage: '58%',
    fatPercentage: '',
    remarks: 'Discount – 480'
  },
  {
    slNo: '7',
    cowNo: '7',
    customerName: 'Khandakar Shahin',
    customerAddress: 'Block-C, Road No.-11, Bonosree',
    mobileNo: '',
    cowWeight: '272',
    estimatedSalePricePerKg: '500.00',
    actualSalePricePerKg: '470.00',
    totalPrice: '127840.00',
    meatPercentage: '58%',
    fatPercentage: '1%',
    remarks: ''
  },
  {
    slNo: '8',
    cowNo: '9',
    customerName: 'Khandakar Shahin',
    customerAddress: 'Block-C, Road No.-11, Bonosree',
    mobileNo: '',
    cowWeight: '249',
    estimatedSalePricePerKg: '500.00',
    actualSalePricePerKg: '470.00',
    totalPrice: '117030.00',
    meatPercentage: '58%',
    fatPercentage: '1%',
    remarks: ''
  },
  {
    slNo: '9',
    cowNo: '10',
    customerName: 'Dr. Md. Aslam Hossain',
    customerAddress: 'House No.-26/A, Road-3, Dhanmondi, Dhaka',
    mobileNo: '01707-330875',
    cowWeight: '244',
    estimatedSalePricePerKg: '525.00',
    actualSalePricePerKg: '490.00',
    totalPrice: '118000.00',
    meatPercentage: '58%',
    fatPercentage: '1%',
    remarks: 'Discount – 1,560'
  },
  {
    slNo: '10',
    cowNo: '11',
    customerName: 'Mr. Jahangir (Darain)',
    customerAddress:
      'Tusar Dhara Residential Area before the signboard, Dhaka-Chattogram Highway, behind Saddam Market',
    mobileNo: '01307-439760',
    cowWeight: '226',
    estimatedSalePricePerKg: '500.00',
    actualSalePricePerKg: '490.00',
    totalPrice: '110500.00',
    meatPercentage: '56%',
    fatPercentage: '1%',
    remarks: ''
  },
  {
    slNo: '11',
    cowNo: '12',
    customerName: 'Md. Mohiuddin Sarkar',
    customerAddress:
      'Basic Cherry Blossom 111 & 112, South Goran, Dhaka (beside Sultan Bhuiyan Jame Mosque)',
    mobileNo: '01711-149329',
    cowWeight: '237',
    estimatedSalePricePerKg: '500.00',
    actualSalePricePerKg: '470.00',
    totalPrice: '111000.00',
    meatPercentage: '58%',
    fatPercentage: '1%',
    remarks: ''
  },
  {
    slNo: '12',
    cowNo: '13',
    customerName: 'Dr. Samir Azam',
    customerAddress:
      'House No.-18, Flat No. C-4, Road No. 9/A, Dhanmondi, Dhaka',
    mobileNo: '01711-128312',
    cowWeight: '236',
    estimatedSalePricePerKg: '500.00',
    actualSalePricePerKg: '490.00',
    totalPrice: '115000.00',
    meatPercentage: '57%',
    fatPercentage: '1%',
    remarks: ''
  },
  {
    slNo: '13',
    cowNo: '14',
    customerName: 'Khandakar Shahjahan',
    customerAddress: 'Block-C, Road No.-11, Bonosree',
    mobileNo: '01715-019561',
    cowWeight: '240',
    estimatedSalePricePerKg: '500.00',
    actualSalePricePerKg: '470.00',
    totalPrice: '110000.00',
    meatPercentage: '58%',
    fatPercentage: '1%',
    remarks: ''
  },
  {
    slNo: '14',
    cowNo: '15',
    customerName: 'Abdur Razzak',
    customerAddress: '',
    mobileNo: '',
    cowWeight: '240',
    estimatedSalePricePerKg: '500.00',
    actualSalePricePerKg: '480.00',
    totalPrice: '115000.00',
    meatPercentage: '58%',
    fatPercentage: '1%',
    remarks: ''
  },
  {
    slNo: '15',
    cowNo: '16',
    customerName: 'Engineer Gazi Shahriar Parvez',
    customerAddress: 'DGM (Admin), DESCO; House K-206/B, Namapara, Khilkhet',
    mobileNo: '01713-443042',
    cowWeight: '248',
    estimatedSalePricePerKg: '500.00',
    actualSalePricePerKg: '490.00',
    totalPrice: '120000.00',
    meatPercentage: '58%',
    fatPercentage: '1%',
    remarks: 'Discount – 1,520'
  },
  {
    slNo: '16',
    cowNo: '17',
    customerName: 'Freedom Fighter Khoka',
    customerAddress: '16 Lakes Circus, Kolabagan, Hasnahena Tri A (3), Dhaka',
    mobileNo: '01819-223260',
    cowWeight: '212',
    estimatedSalePricePerKg: '500.00',
    actualSalePricePerKg: '490.00',
    totalPrice: '103000.00',
    meatPercentage: '56%',
    fatPercentage: '1%',
    remarks: ''
  },
  {
    slNo: '17',
    cowNo: '18',
    customerName: 'ATM Mozharul Hoque',
    customerAddress: 'Silicon Valley, Bhuiyapara, Bonosree',
    mobileNo: '01777-792648',
    cowWeight: '255',
    estimatedSalePricePerKg: '500.00',
    actualSalePricePerKg: '470.00',
    totalPrice: '119000.00',
    meatPercentage: '60%',
    fatPercentage: '1%',
    remarks: ''
  }
];

// Helper function to parse percentage strings
function parsePercentage(percentageStr: string): number {
  if (!percentageStr || percentageStr === '') return 1; // Default to 1%
  return parseFloat(percentageStr.replace('%', ''));
}

// Helper function to generate purchase price per kg (using estimated price as base)
function generatePurchasePricePerKg(estimatedPrice: number): number {
  // Assuming purchase price is typically 20-30% less than estimated sale price
  const discount = 0.25; // 25% discount
  return Math.round(estimatedPrice * (1 - discount));
}

// Helper function to determine cattle class based on weight and quality
function determineCattleClass(
  weight: number,
  meatPercentage: number
): 'GOLD' | 'SILVER' | 'PLATINUM' {
  if (weight >= 250 && meatPercentage >= 60) return 'PLATINUM';
  if (weight >= 240 && meatPercentage >= 58) return 'GOLD';
  return 'SILVER';
}

async function seedTransactionData() {
  console.log('🌱 Starting to seed transaction data...');

  try {
    // Create a map to store unique customers to avoid duplicates
    const customerMap = new Map<string, string>();

    // First, create or find unique customers
    for (const row of csvData) {
      if (!customerMap.has(row.customerName)) {
        console.log(`Creating customer: ${row.customerName}`);

        const customer = await prisma.customer.create({
          data: {
            name: row.customerName,
            address: row.customerAddress,
            phone: row.mobileNo
          }
        });

        customerMap.set(row.customerName, customer.id);
      }
    }

    console.log(`✅ Created ${customerMap.size} unique customers`);

    // Create cattle records and transactions
    for (const row of csvData) {
      const customerId = customerMap.get(row.customerName)!;
      const cowWeight = parseInt(row.cowWeight);
      const meatPercentage = parsePercentage(row.meatPercentage);
      const fatPercentage = parsePercentage(row.fatPercentage);
      const estimatedPricePerKg = parseFloat(row.estimatedSalePricePerKg);
      const actualPricePerKg = parseFloat(row.actualSalePricePerKg);
      const totalPrice = parseFloat(row.totalPrice);

      console.log(`Creating cattle and transaction for Cow #${row.cowNo}...`);

      // Create cattle record
      const cattle = await prisma.cattle.create({
        data: {
          cattleNumber: parseInt(row.cowNo),
          name: `Cow #${row.cowNo}`,
          gender: Math.random() < 0.5 ? 'MALE' : 'FEMALE',
          liveWeight: cowWeight,
          meatPercentage,
          fatPercentage,
          purchasePricePerKg: generatePurchasePricePerKg(estimatedPricePerKg),
          cattleClass: determineCattleClass(cowWeight, meatPercentage),
          isSold: true, // These are already sold
          healthStatus: 'HEALTHY',
          isVaccinated: true
        }
      });

      // Create transaction
      const transaction = await prisma.transaction.create({
        data: {
          customerId: customerId,
          serialNumber: parseInt(row.slNo),
          remarks: row.remarks || null
        }
      });

      // Create transaction item
      await prisma.transactionItem.create({
        data: {
          transactionId: transaction.id,
          cattleId: cattle.id,
          estimatedSalePrice: Math.round(estimatedPricePerKg),
          actualSalePrice: Math.round(actualPricePerKg),
          totalPrice: Math.round(totalPrice),
          paymentStatus: 'PAID', // Assuming all are paid
          paymentDate: new Date(),
          paymentMethod: 'CASH', // Default to cash
          paidAmount: Math.round(totalPrice)
        }
      });

      console.log(
        `✅ Created cattle #${row.cowNo} and transaction for ${row.customerName}`
      );
    }

    console.log('🎉 Successfully seeded all transaction data!');

    // Print summary
    const totalCattle = await prisma.cattle.count();
    const totalCustomers = await prisma.customer.count();
    const totalTransactions = await prisma.transaction.count();
    const totalTransactionItems = await prisma.transactionItem.count();

    console.log('\n📊 Database Summary:');
    console.log(`   Customers: ${totalCustomers}`);
    console.log(`   Cattle: ${totalCattle}`);
    console.log(`   Transactions: ${totalTransactions}`);
    console.log(`   Transaction Items: ${totalTransactionItems}`);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedTransactionData().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
}

export default seedTransactionData;
