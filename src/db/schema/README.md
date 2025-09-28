# Database Schema Structure

This directory contains the modular database schema organized by domain and functionality.

## Directory Structure

```
src/db/schema/
├── index.ts                 # Main schema exports
├── README.md               # This documentation
├── enums/
│   └── index.ts            # All PostgreSQL enums
├── tables/
│   ├── index.ts            # All table exports
│   ├── animals.ts          # Animal and cattle tables
│   ├── health.ts           # Health and veterinary tables
│   ├── purchases.ts        # Purchase and vendor tables
│   ├── customers.ts        # Customer and address tables
│   ├── sales.ts            # Sales and payment tables
│   ├── slaughter.ts        # Slaughter and meat processing tables
│   └── breeding.ts         # Breeding and reproduction tables
├── relations/
│   └── index.ts            # All Drizzle relations
└── types/
    └── index.ts            # TypeScript type definitions
```

## Module Organization

### 1. **Enums** (`enums/index.ts`)
Contains all PostgreSQL enum definitions:
- Animal-related: `animalTypeEnum`, `animalStatusEnum`, `genderEnum`
- Health-related: `healthStatusEnum`
- Cattle-specific: `cattleClassEnum`
- Address-related: `addressTypeEnum`
- Financial: `discountTypeEnum`, `paymentMethodEnum`
- Inventory: `meatInventoryStatusEnum`

### 2. **Tables** (`tables/`)
Organized by business domain:

#### **Animals** (`animals.ts`)
- `animals` - Core animal entity
- `cattle` - Cattle-specific data (1:1 with animals)
- `weightRecords` - Animal weight tracking
- `cattleClassThresholds` - Weight-based classification rules
- `images` - Animal photos

#### **Health** (`health.ts`)
- `healthRecords` - Veterinary records
- `vaccines` - Vaccine catalog
- `vaccinationRecords` - Vaccination history
- `quarantineHistory` - Quarantine events
- `veterinarians` - Veterinarian directory

#### **Purchases** (`purchases.ts`)
- `vendors` - Purchase vendors
- `markets` - Purchase markets
- `animalPurchases` - Purchase records (1:0..1 with animals)

#### **Customers** (`customers.ts`)
- `customers` - Customer directory
- `addresses` - Scalable address system with JSONB

#### **Sales** (`sales.ts`)
- `sales` - Sale transactions (multi-animal support)
- `saleAnimalLinks` - Junction table for multi-animal sales
- `payments` - Payment tracking

#### **Slaughter** (`slaughter.ts`)
- `slaughterHouses` - Slaughterhouse directory
- `slaughterRecords` - Slaughter information
- `meatCategories` - Meat type catalog
- `meatYields` - Meat yield from slaughter
- `meatInventories` - Meat inventory management

#### **Breeding** (`breeding.ts`)
- `inseminationRecords` - Breeding records
- `calvingEvents` - Calving history
- `lactationPeriods` - Lactation tracking

### 3. **Relations** (`relations/index.ts`)
Defines all Drizzle ORM relations between tables, organized by domain for easy maintenance.

### 4. **Types** (`types/index.ts`)
TypeScript type definitions using Drizzle's `$inferSelect` and `$inferInsert` utilities.

## Usage Examples

### Basic Import
```typescript
import { animals, cattle, customers } from '@/db/schema';
import { animalTypeEnum, genderEnum } from '@/db/schema';
import type { Animal, NewAnimal } from '@/db/schema';
```

### Domain-Specific Imports
```typescript
// Import specific domain tables
import { animals, cattle } from '@/db/schema/tables/animals';
import { sales, saleAnimalLinks } from '@/db/schema/tables/sales';

// Import specific enums
import { animalStatusEnum, meatInventoryStatusEnum } from '@/db/schema/enums';

// Import specific types
import type { Customer, NewCustomer } from '@/db/schema/types';
```

### Database Operations
```typescript
import { db } from '@/db';
import { animals, cattle } from '@/db/schema';

// Create an animal
const newAnimal = await db.insert(animals).values({
  farmId: 'farm-123',
  animalType: 'CATTLE',
  status: 'ON_FARM',
}).returning();

// Create cattle record (1:1 relationship)
await db.insert(cattle).values({
  animalId: newAnimal[0].id,
  cattleNumber: 'C001',
  gender: 'FEMALE',
  healthStatus: 'HEALTHY',
});
```

## Benefits of This Structure

1. **Separation of Concerns**: Each file has a single responsibility
2. **Easy Navigation**: Domain-based organization makes finding relevant code simple
3. **Maintainable**: Changes to one domain don't affect others
4. **Scalable**: Easy to add new tables without cluttering existing files
5. **Type Safety**: Comprehensive TypeScript support with proper type inference
6. **Import Flexibility**: Choose between importing everything or specific domains

## Best Practices

1. **Always import from the main index**: `import { ... } from '@/db/schema'`
2. **Use specific domain imports only when needed**: For performance in large applications
3. **Keep related tables together**: Don't spread related functionality across files
4. **Update relations when adding new tables**: Ensure referential integrity
5. **Export types consistently**: Always provide both select and insert types

## File Naming Conventions

- Use kebab-case for directories: `tables/`, `enums/`
- Use camelCase for table names: `animalPurchases`, `saleAnimalLinks`
- Use descriptive domain names for table files: `animals.ts`, `health.ts`
- Always include an `index.ts` for clean exports
