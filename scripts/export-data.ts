import prisma from '@/prisma';
import * as fs from 'node:fs';
import * as path from 'node:path';

interface ExportData {
  exportTimestamp: string;
  summary: {
    totalCattle: number;
    totalCustomers: number;
    totalTransactions: number;
    totalTransactionItems: number;
    totalCattlePurchases: number;
    totalCattleSales: number;
  };
  data: {
    cattle: any[];
    customers: any[];
    transactions: any[];
    transactionItems: any[];
    cattlePurchases: any[];
    cattleSales: any[];
  };
}

async function exportAllData() {
  console.log('🚀 Starting data export...');

  try {
    // Fetch all data with relations
    console.log('📊 Fetching cattle data...');
    const cattle = await prisma.cattle.findMany({
      include: {
        cattlePurchase: true,
        cattleSale: true,
        transactionItems: {
          include: {
            transaction: {
              include: {
                customer: true
              }
            }
          }
        }
      }
    });

    console.log('👥 Fetching customer data...');
    const customers = await prisma.customer.findMany({
      include: {
        cattleSale: true,
        transactions: {
          include: {
            transactionItems: {
              include: {
                cattle: true
              }
            }
          }
        }
      }
    });

    console.log('💰 Fetching transaction data...');
    const transactions = await prisma.transaction.findMany({
      include: {
        customer: true,
        transactionItems: {
          include: {
            cattle: {
              include: {
                cattlePurchase: true,
                cattleSale: true
              }
            }
          }
        }
      }
    });

    console.log('📝 Fetching transaction items...');
    const transactionItems = await prisma.transactionItem.findMany({
      include: {
        transaction: {
          include: {
            customer: true
          }
        },
        cattle: {
          include: {
            cattlePurchase: true,
            cattleSale: true
          }
        }
      }
    });

    console.log('🛒 Fetching cattle purchases...');
    const cattlePurchases = await prisma.cattlePurchase.findMany({
      include: {
        Cattle: true
      }
    });

    console.log('💸 Fetching cattle sales...');
    const cattleSales = await prisma.cattleSale.findMany({
      include: {
        customer: true,
        Cattle: true
      }
    });

    // Create export data structure
    const exportData: ExportData = {
      exportTimestamp: new Date().toISOString(),
      summary: {
        totalCattle: cattle.length,
        totalCustomers: customers.length,
        totalTransactions: transactions.length,
        totalTransactionItems: transactionItems.length,
        totalCattlePurchases: cattlePurchases.length,
        totalCattleSales: cattleSales.length
      },
      data: {
        cattle,
        customers,
        transactions,
        transactionItems,
        cattlePurchases,
        cattleSales
      }
    };

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `arma-data-export-${timestamp}.json`;
    const filePath = path.join('./scripts', filename);

    // Save to JSON file
    console.log(`💾 Saving data to ${filename}...`);
    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2), 'utf8');

    // Print summary
    console.log('\n🎉 Export completed successfully!');
    console.log(`📁 File saved: ${filePath}`);
    console.log(`📊 Export Summary:`);
    console.log(`   Total Cattle: ${exportData.summary.totalCattle}`);
    console.log(`   Total Customers: ${exportData.summary.totalCustomers}`);
    console.log(`   Total Transactions: ${exportData.summary.totalTransactions}`);
    console.log(`   Total Transaction Items: ${exportData.summary.totalTransactionItems}`);
    console.log(`   Total Cattle Purchases: ${exportData.summary.totalCattlePurchases}`);
    console.log(`   Total Cattle Sales: ${exportData.summary.totalCattleSales}`);

    // Calculate file size
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
    console.log(`   File size: ${fileSizeInMB} MB`);

    // Additional statistics
    console.log('\n📈 Additional Statistics:');
    
    // Health status breakdown for cattle
    const healthyCount = cattle.filter(c => c.healthStatus === 'HEALTHY').length;
    const sickCount = cattle.filter(c => c.healthStatus === 'SICK').length;
    const deadCount = cattle.filter(c => c.healthStatus === 'DEAD').length;
    
    console.log(`   Cattle Health Status:`);
    console.log(`     Healthy: ${healthyCount}`);
    console.log(`     Sick: ${sickCount}`);
    console.log(`     Dead: ${deadCount}`);

    // Class breakdown for cattle
    const platinumCount = cattle.filter(c => c.cattleClass === 'PLATINUM').length;
    const goldCount = cattle.filter(c => c.cattleClass === 'GOLD').length;
    const silverCount = cattle.filter(c => c.cattleClass === 'SILVER').length;
    
    console.log(`   Cattle Class Distribution:`);
    console.log(`     Platinum: ${platinumCount}`);
    console.log(`     Gold: ${goldCount}`);
    console.log(`     Silver: ${silverCount}`);

    // Gender breakdown for cattle
    const maleCount = cattle.filter(c => c.gender === 'MALE').length;
    const femaleCount = cattle.filter(c => c.gender === 'FEMALE').length;
    
    console.log(`   Cattle Gender Distribution:`);
    console.log(`     Male: ${maleCount}`);
    console.log(`     Female: ${femaleCount}`);

    // Payment status breakdown for transaction items
    const pendingPayments = transactionItems.filter(ti => ti.paymentStatus === 'PENDING').length;
    const paidPayments = transactionItems.filter(ti => ti.paymentStatus === 'PAID').length;
    const partiallyPaidPayments = transactionItems.filter(ti => ti.paymentStatus === 'PARTIALLY_PAID').length;
    
    console.log(`   Payment Status Distribution:`);
    console.log(`     Pending: ${pendingPayments}`);
    console.log(`     Paid: ${paidPayments}`);
    console.log(`     Partially Paid: ${partiallyPaidPayments}`);

    return filePath;

  } catch (error) {
    console.error('❌ Error exporting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the export function
if (require.main === module) {
  exportAllData().catch((error) => {
    console.error('❌ Export failed:', error);
    process.exit(1);
  });
}

export default exportAllData;
