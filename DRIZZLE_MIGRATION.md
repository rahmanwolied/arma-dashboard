# Drizzle ORM Migration

This document outlines the migration from Prisma to Drizzle ORM and the implementation of the requested schema changes.

## Key Requirements Implemented

### 1. **AnimalPurchase Relation** ✅
- Modified the `animals` and `animalPurchases` relationship
- Made `animal_id` foreign key in `animalPurchases` unique
- Creates a **one-to-zero-or-one** relationship (Animal can exist without a purchase)

### 2. **Multi-Animal Sales** ✅
- Removed `animal_id` column from the `sales` table
- Created new junction table `saleAnimalLinks` with foreign keys for `sale_id` and `animal_id`
- Enables multiple animals per sale

### 3. **Cattle 1:1 Enforcement** ✅
- Modified `cattle` table: `animal_id` column is both Primary Key and Foreign Key
- References `animals.id` with cascade delete

### 4. **Scalable Address Schema** ✅
- Removed region-specific columns (`isDhakaRegion`, `dhakaZone`, `locality`, etc.)
- Added single `jsonb` column named `regionSpecificFields`
- Allows flexible, region-specific data storage

### 5. **Remove Duplication** ✅
- Deleted `initialWeightKg` column from `animalPurchases` table
- Updated `status` enum in `animals` table: `'ON_FARM'`, `'SOLD'`, `'SLAUGHTERED'`

### 6. **New MeatInventory Table** ✅
- Created `meatInventories` table linking to `meatYields`
- Includes `quantityKg`, `pricePerKg`, and `status` enum
- Status values: `'AVAILABLE'`, `'SOLD'`, `'RESERVED'`

## Drizzle ORM Setup

### Installation
```bash
pnpm install drizzle-orm@latest drizzle-kit@latest postgres
```

### Available Scripts
```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Push schema changes
pnpm db:push

# Open Drizzle Studio
pnpm db:studio

# Drop migrations
pnpm db:drop

# Check migrations
pnpm db:check

# Apply pending migrations
pnpm db:up
```

## Schema Architecture

The schema is organized into a modular structure for better maintainability:

```
src/db/schema/
├── index.ts                 # Main schema exports
├── enums/index.ts          # PostgreSQL enums
├── tables/                 # Domain-organized tables
│   ├── animals.ts          # Animal and cattle tables
│   ├── health.ts           # Health and veterinary tables
│   ├── purchases.ts        # Purchase and vendor tables
│   ├── customers.ts        # Customer and address tables
│   ├── sales.ts            # Sales and payment tables
│   ├── slaughter.ts        # Slaughter and meat processing
│   └── breeding.ts         # Breeding and reproduction
├── relations/index.ts      # Drizzle relations
└── types/index.ts          # TypeScript definitions
```

### Usage Example
```typescript
import { db } from '@/db';
import { animals, cattle, sales, saleAnimalLinks } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Create an animal
const newAnimal = await db.insert(animals).values({
  farmId: 'farm-123',
  animalType: 'CATTLE',
  status: 'ON_FARM',
}).returning();

// Create cattle record (1:1 with animal)
await db.insert(cattle).values({
  animalId: newAnimal[0].id,
  cattleNumber: 'C001',
  gender: 'FEMALE',
  healthStatus: 'HEALTHY',
});

// Multi-animal sale
const sale = await db.insert(sales).values({
  farmId: 'farm-123',
  customerId: 'customer-123',
  invoiceNumber: 'INV-001',
  totalAmount: '5000.00',
  amountPaid: '5000.00',
  amountDue: '0.00',
  isCredit: false,
  saleDate: new Date(),
}).returning();

// Link multiple animals to sale
await db.insert(saleAnimalLinks).values([
  { saleId: sale[0].id, animalId: 'animal-1' },
  { saleId: sale[0].id, animalId: 'animal-2' },
]);

// Scalable address with region-specific fields
await db.insert(addresses).values({
  customerId: 'customer-123',
  addressType: 'HOME',
  country: 'Bangladesh',
  city: 'Dhaka',
  regionSpecificFields: {
    isDhakaRegion: true,
    dhakaZone: 'DHAKA_NORTH',
    locality: 'Gulshan',
    blockNumber: '12',
    roadNumber: '34',
    houseOrPlot: '56',
    landmark: 'Near Gulshan Lake'
  }
});
```

## Schema Overview

### Core Entities
- **Animals**: Base animal entity with farm isolation
- **Cattle**: Cattle-specific data (1:1 with Animals)
- **WeightRecords**: Animal weight tracking
- **HealthRecords**: Veterinary records
- **VaccinationRecords**: Vaccine history

### Purchase & Sales
- **AnimalPurchases**: Optional purchase records (1:0..1 with Animals)
- **Sales**: Sale transactions
- **SaleAnimalLinks**: Junction table for multi-animal sales
- **Payments**: Payment tracking

### Meat Processing
- **SlaughterRecords**: Slaughter information
- **MeatYields**: Meat yield from slaughter
- **MeatInventories**: Inventory management for meat products

### Configuration
- **CattleClassThresholds**: Weight-based classification
- **Vendors**: Purchase vendors
- **Markets**: Purchase markets
- **Customers**: Sale customers
- **Addresses**: Scalable address system

## Migration from Prisma

1. **Database Connection**: Uses `postgres` driver instead of Prisma Client
2. **Type Safety**: Drizzle provides full TypeScript support with `$inferSelect` and `$inferInsert`
3. **Performance**: Direct SQL generation with zero runtime overhead
4. **Migration System**: File-based migrations instead of Prisma's approach

## Environment Variables

Ensure your `.env` file contains:
```env
NEON_DB_URL="postgresql://..."
```

The schema automatically uses the existing `NEON_DB_URL` environment variable.
