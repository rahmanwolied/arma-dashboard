/**
 * Example usage of the new Drizzle ORM schema
 * This file demonstrates how to use the migrated schema with all the new requirements
 */

import { db } from './index';
import { 
  animals, 
  cattle, 
  customers, 
  addresses, 
  sales, 
  saleAnimalLinks, 
  animalPurchases,
  weightRecords,
  meatInventories,
  meatYields 
} from './schema';
import { eq, and } from 'drizzle-orm';

// Example 1: Create an animal without requiring a purchase (Requirement #1)
export async function createAnimalWithoutPurchase() {
  const newAnimal = await db.insert(animals).values({
    farmId: 'farm-123',
    animalType: 'CATTLE',
    status: 'ON_FARM',
  }).returning();

  // Create cattle record (1:1 relationship - Requirement #3)
  await db.insert(cattle).values({
    animalId: newAnimal[0].id, // This is both PK and FK
    cattleNumber: 'C001',
    gender: 'FEMALE',
    healthStatus: 'HEALTHY',
    isQuarantined: false,
    isPregnant: false,
    isLactating: false,
  });

  return newAnimal[0];
}

// Example 2: Create a purchase for an existing animal (One-to-zero-or-one)
export async function createPurchaseForAnimal(animalId: string) {
  return await db.insert(animalPurchases).values({
    animalId, // Unique constraint ensures one-to-zero-or-one
    purchaseDate: new Date(),
    purchasePrice: '2500.00',
    invoiceReference: 'INV-P001',
    notes: 'Purchased from local market',
  });
}

// Example 3: Multi-animal sales (Requirement #2)
export async function createMultiAnimalSale() {
  // Create the sale without animal_id column
  const sale = await db.insert(sales).values({
    farmId: 'farm-123',
    customerId: 'customer-123',
    invoiceNumber: 'INV-S001',
    totalAmount: '10000.00',
    amountPaid: '8000.00',
    amountDue: '2000.00',
    isCredit: true,
    paymentTerms: 'Net 30 days',
    saleDate: new Date(),
  }).returning();

  // Link multiple animals to this sale using junction table
  const animalIds = ['animal-1', 'animal-2', 'animal-3'];
  
  await db.insert(saleAnimalLinks).values(
    animalIds.map(animalId => ({
      saleId: sale[0].id,
      animalId,
    }))
  );

  return sale[0];
}

// Example 4: Scalable address with region-specific fields (Requirement #4)
export async function createCustomerWithScalableAddress() {
  const customer = await db.insert(customers).values({
    farmId: 'farm-123',
    name: 'John Doe', // This would be encrypted in production
    primaryPhone: '+8801234567890', // This would be encrypted in production
    email: 'john@example.com', // This would be encrypted in production
  }).returning();

  // Create address with JSONB region-specific fields
  await db.insert(addresses).values({
    customerId: customer[0].id,
    addressType: 'HOME',
    country: 'Bangladesh',
    division: 'Dhaka',
    district: 'Dhaka',
    city: 'Dhaka',
    postalCode: '1212',
    // Region-specific fields stored as JSONB (flexible schema)
    regionSpecificFields: {
      isDhakaRegion: true,
      dhakaZone: 'DHAKA_NORTH',
      locality: 'Gulshan',
      blockNumber: '12',
      roadNumber: '34',
      houseOrPlot: '56A',
      landmark: 'Near Gulshan Lake Park',
      // Can add more fields as needed without schema changes
      customField1: 'Some value',
      customField2: { nested: 'data' }
    }
  });

  return customer[0];
}

// Example 5: Working with weight records (No initialWeightKg in purchases - Requirement #5)
export async function trackAnimalWeight(animalId: string) {
  // Weight is tracked separately in weight_records table
  return await db.insert(weightRecords).values({
    animalId,
    weightKg: '450.50',
    recordedAt: new Date(),
    recordedBy: 'user-123',
    notes: 'Monthly weight check',
  });
}

// Example 6: New meat inventory management (Requirement #6)
export async function createMeatInventory(meatYieldId: string) {
  return await db.insert(meatInventories).values({
    meatYieldId,
    quantityKg: '125.50',
    pricePerKg: '800.00',
    status: 'AVAILABLE',
  });
}

// Example query: Get animals with their cattle details and optional purchase info
export async function getAnimalsWithDetails(farmId: string) {
  return await db
    .select({
      animal: animals,
      cattle: cattle,
      purchase: animalPurchases,
    })
    .from(animals)
    .leftJoin(cattle, eq(cattle.animalId, animals.id))
    .leftJoin(animalPurchases, eq(animalPurchases.animalId, animals.id))
    .where(eq(animals.farmId, farmId));
}

// Example query: Get sale with all linked animals
export async function getSaleWithAnimals(saleId: string) {
  return await db
    .select({
      sale: sales,
      animal: animals,
      cattle: cattle,
    })
    .from(sales)
    .leftJoin(saleAnimalLinks, eq(saleAnimalLinks.saleId, sales.id))
    .leftJoin(animals, eq(animals.id, saleAnimalLinks.animalId))
    .leftJoin(cattle, eq(cattle.animalId, animals.id))
    .where(eq(sales.id, saleId));
}

// Example query: Get meat inventory with yield details
export async function getMeatInventoryDetails(status?: 'AVAILABLE' | 'SOLD' | 'RESERVED') {
  const baseQuery = db
    .select({
      inventory: meatInventories,
      yield: meatYields,
    })
    .from(meatInventories)
    .leftJoin(meatYields, eq(meatYields.id, meatInventories.meatYieldId));

  if (status) {
    return baseQuery.where(eq(meatInventories.status, status));
  }

  return baseQuery;
}
