import prisma from '@/prisma';
import * as fs from 'node:fs';
import * as Papa from 'papaparse';

interface CSVRow {
  'cattle no': string;
  'live weight (kg)': string;
  'purchase price per kg': string;
  date: string;
  location: string;
  status: string;
}

// Helper function to determine cattle class based on weight
function determineCattleClass(weight: number): 'GOLD' | 'SILVER' | 'PLATINUM' {
  if (weight >= 240) return 'PLATINUM';
  if (weight >= 180) return 'GOLD';
  return 'SILVER';
}

// Helper function to generate random meat and fat percentages
function generateMeatFatPercentages(): {
  meatPercentage: number;
  fatPercentage: number;
} {
  // Meat percentage typically ranges from 45-70%
  const meatPercentage = Math.floor(Math.random() * 26) + 45; // 45-70%

  // Fat percentage typically ranges from 5-25%
  const fatPercentage = Math.floor(Math.random() * 21) + 5; // 5-25%

  return { meatPercentage, fatPercentage };
}

// Helper function to parse date from DD/MM/YYYY format
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr
    .split('/')
    .map((num) => Number.parseInt(num));
  return new Date(year, month - 1, day); // month is 0-indexed in JS Date
}

// Helper function to get random health status
function getRandomHealthStatus(): 'HEALTHY' | 'SICK' | 'DEAD' {
  const statuses: Array<'HEALTHY' | 'SICK' | 'DEAD'> = [
    'HEALTHY',
    'SICK',
    'DEAD'
  ];
  //   const weights = [0.85, 0.12, 0.03]; // 85% healthy, 12% sick, 3% dead

  //   const random = Math.random();
  //   let cumulativeWeight = 0;

  //   for (let i = 0; i < statuses.length; i++) {
  //     cumulativeWeight += weights[i];
  //     if (random <= cumulativeWeight) {
  //       return statuses[i];
  //     }
  //   }

  return 'HEALTHY'; // fallback
}

// Helper function to generate random boolean with probability
function randomBoolean(probability = 0.5): boolean {
  return Math.random() < probability;
}

async function readCSVFile(filename: string): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    const csvContent = fs.readFileSync(filename, 'utf8');

    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }
        resolve(results.data as CSVRow[]);
      },

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      error: (error: any) => {
        reject(error);
      }
    });
  });
}

async function seedCattlePurchaseData() {
  console.log('🌱 Starting to seed cattle purchase data...');

  try {
    // Read CSV file
    const csvData = await readCSVFile('./scripts/data.csv');
    console.log(`📄 Read ${csvData.length} records from CSV`);

    let successCount = 0;
    let errorCount = 0;

    for (const row of csvData) {
      try {
        const cattleNumber = Number.parseInt(row['cattle no']);
        const liveWeight = Number.parseInt(row['live weight (kg)']);
        const purchasePricePerKg = Math.round(
          Number.parseFloat(row['purchase price per kg'])
        );
        const purchaseDate = parseDate(row.date);
        const purchaseLocation = row.location;

        // Generate random meat and fat percentages
        const { meatPercentage, fatPercentage } = generateMeatFatPercentages();

        // Generate random gender and related attributes
        const gender = randomBoolean() ? 'MALE' : 'FEMALE';
        const isPregnant = gender === 'FEMALE' && randomBoolean(0.3); // 30% chance if female
        const isLactating = gender === 'FEMALE' && randomBoolean(0.25); // 25% chance if female
        const isInseminated = gender === 'FEMALE' && randomBoolean(0.15); // 15% chance if female
        const isVaccinated = randomBoolean(0.85); // 85% chance of being vaccinated
        const isQuarantined = randomBoolean(0.1); // 10% chance of being quarantined

        // Determine health status and cattle class
        const healthStatus = getRandomHealthStatus();
        const cattleClass = determineCattleClass(liveWeight);

        console.log(`Processing cattle #${cattleNumber}...`);

        // Create cattle purchase record
        const cattlePurchase = await prisma.cattlePurchase.create({
          data: {
            purchaseDate,
            purchasePricePerKg,
            liveWeight,
            meatPercentage,
            fatPercentage,
            purchaseLocation
          }
        });

        // Create cattle record
        await prisma.cattle.create({
          data: {
            cattleNumber,
            name: `Cow #${cattleNumber}`,
            gender,
            cattlePurchaseId: cattlePurchase.id,
            cattleClass,
            isQuarantined,
            isPregnant,
            isLactating,
            isInseminated,
            healthStatus,
            healthNotes:
              healthStatus === 'SICK' ? 'Requires medical attention' : null,
            isVaccinated
          }
        });

        console.log(`✅ Successfully created cattle #${cattleNumber}`);
        successCount++;
      } catch (error) {
        console.error(
          `❌ Error processing cattle #${row['cattle no']}:`,
          error
        );
        errorCount++;
      }
    }

    console.log('\n🎉 Seeding completed!');
    console.log(`✅ Successfully processed: ${successCount} records`);
    console.log(`❌ Errors: ${errorCount} records`);

    // Print database summary
    const totalCattle = await prisma.cattle.count();
    const totalCattlePurchases = await prisma.cattlePurchase.count();

    console.log('\n📊 Database Summary:');
    console.log(`   Total Cattle: ${totalCattle}`);
    console.log(`   Total Cattle Purchases: ${totalCattlePurchases}`);

    // Health status breakdown
    const healthyCount = await prisma.cattle.count({
      where: { healthStatus: 'HEALTHY' }
    });
    const sickCount = await prisma.cattle.count({
      where: { healthStatus: 'SICK' }
    });
    const deadCount = await prisma.cattle.count({
      where: { healthStatus: 'DEAD' }
    });

    console.log('\n🏥 Health Status Breakdown:');
    console.log(`   Healthy: ${healthyCount}`);
    console.log(`   Sick: ${sickCount}`);
    console.log(`   Dead: ${deadCount}`);

    // Class breakdown
    const platinumCount = await prisma.cattle.count({
      where: { cattleClass: 'PLATINUM' }
    });
    const goldCount = await prisma.cattle.count({
      where: { cattleClass: 'GOLD' }
    });
    const silverCount = await prisma.cattle.count({
      where: { cattleClass: 'SILVER' }
    });

    console.log('\n🏆 Class Breakdown:');
    console.log(`   Platinum: ${platinumCount}`);
    console.log(`   Gold: ${goldCount}`);
    console.log(`   Silver: ${silverCount}`);
  } catch (error) {
    console.error('❌ Error seeding cattle purchase data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedCattlePurchaseData().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
}

export default seedCattlePurchaseData;
