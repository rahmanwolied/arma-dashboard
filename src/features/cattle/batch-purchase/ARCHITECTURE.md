# Batch Purchase Architecture

## Overview

The batch purchase feature follows a **layered architecture** that separates concerns and promotes maintainability, testability, and reusability.

## Architecture Layers

```
┌─────────────────────────────────────────────────┐
│           Server Action Layer                   │
│  • Authentication (Clerk)                       │
│  • Input Validation (Zod)                       │
│  • Orchestration                                │
│  • Cache Invalidation (Next.js)                 │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│            Service Layer                        │
│  • Business Logic                               │
│  • Database Transactions                        │
│  • Data Processing                              │
│  • Domain Rules                                 │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│           Database Layer                        │
│  • Drizzle ORM                                  │
│  • PostgreSQL                                   │
└─────────────────────────────────────────────────┘
```

## Why This Design?

### ❌ Problems with Old Design (Database Logic in Server Actions)

1. **Violates Separation of Concerns**
   - Mixed auth, validation, business logic, and database operations
   - Hard to understand what the code does at a glance

2. **Not Reusable**
   - Can't use the batch purchase logic outside of a server action
   - Can't call it from other services or background jobs

3. **Difficult to Test**
   - Requires mocking Clerk auth, database, and Next.js APIs
   - Integration tests become complex and slow

4. **Tight Coupling**
   - Server action directly depends on database implementation
   - Changes to database logic require changing the server action

5. **Violates Existing Architecture**
   - Other features (e.g., `CattleQueryService`) use service layer pattern
   - Creates inconsistency in the codebase

### ✅ Benefits of New Design (Service Layer Pattern)

1. **Clear Separation of Concerns**
   - Each layer has a single responsibility
   - Easy to understand and maintain

2. **Highly Reusable**
   - Service can be called from server actions, API routes, background jobs, etc.
   - Business logic is centralized in one place

3. **Easy to Test**
   - Can test service layer independently of Next.js
   - Mock dependencies at the database level
   - Can write unit tests for each method

4. **Loose Coupling**
   - Server action doesn't know about database details
   - Can swap implementations without changing consumers

5. **Consistent Architecture**
   - Follows the same pattern as `CattleQueryService`, `CustomerQueryService`
   - Easy for team members to understand

## File Structure

```
src/
├── features/cattle/batch-purchase/
│   ├── actions/
│   │   └── create-batch-purchase.ts      # Server Action (thin orchestration)
│   ├── validations/
│   │   └── batch-purchase-schema.ts      # Zod schemas
│   └── types.ts                          # Feature types
│
└── services/
    └── BatchPurchaseService.ts           # Business logic & database operations
```

## Layer Responsibilities

### 1. Server Action Layer (`create-batch-purchase.ts`)

**Responsibilities:**
- ✅ Authentication (Clerk)
- ✅ Input validation (Zod)
- ✅ Orchestration (calling services)
- ✅ Cache invalidation (Next.js)
- ✅ Error handling & user-facing responses

**Anti-patterns:**
- ❌ Database queries
- ❌ Business logic
- ❌ Complex calculations
- ❌ Transaction management

**Example:**

```typescript
export async function createBatchPurchaseAction(data: unknown) {
    try {
        // 1. Authentication
        const { userId } = await auth()
        if (!userId) {
            return { success: false, error: 'Not authenticated' }
        }

        // 2. Validation
        const validated = completeBatchPurchaseSchema.parse(data)

        // 3. Delegate to service
        const service = new BatchPurchaseService()
        const result = await service.createBatchPurchase({
            data: validated,
            userId,
        })

        // 4. Cache invalidation
        revalidatePath('/dashboard/cattle')

        return { success: true, data: result }
    } catch (error) {
        // Error handling
        return { success: false, error: error.message }
    }
}
```

### 2. Service Layer (`BatchPurchaseService.ts`)

**Responsibilities:**
- ✅ Business logic
- ✅ Database transactions
- ✅ Data processing
- ✅ Domain rules enforcement
- ✅ Complex calculations

**Anti-patterns:**
- ❌ Authentication logic
- ❌ Cache invalidation
- ❌ HTTP concerns
- ❌ User-facing error messages

**Example:**

```typescript
export class BatchPurchaseService {
    async createBatchPurchase(input: BatchPurchaseInput): Promise<BatchPurchaseResult> {
        const { data, userId } = input

        // Business logic
        const costs = this.calculateCosts(data)
        const purchaseDate = this.parsePurchaseDate(data.purchaseDate)

        // Database transaction
        const totalInvestment = await db.transaction(async (tx) => {
            const marketId = await this.ensureMarket(tx, data.marketValue)
            const purchase = await this.createPurchaseRecord(tx, { ... })
            
            let totalInvestment = 0
            for (const cattleItem of data.cattle) {
                const adjustedPrice = await this.createCattleEntry(tx, { ... })
                totalInvestment += adjustedPrice
            }
            
            return totalInvestment
        })

        return { totalCattle, totalInvestment, purchaseDate, marketName }
    }

    // Private methods for business logic
    private calculateCosts(data: CompleteBatchPurchaseFormValues) { ... }
    private parsePurchaseDate(dateString: string): Date { ... }
    private async ensureMarket(tx: unknown, marketValue: any) { ... }
}
```

## Testing Strategy

### Unit Tests for Service Layer

```typescript
import { describe, it, expect, vi } from 'vitest'
import { BatchPurchaseService } from '@/services/BatchPurchaseService'

describe('BatchPurchaseService', () => {
    describe('calculateCosts', () => {
        it('should calculate total costs correctly', () => {
            const service = new BatchPurchaseService()
            const data = {
                transportCost: '1000',
                hasilFee: '500',
                miscCost: '200',
                numberOfCattle: '10',
                cattle: [
                    { purchasePrice: '5000' },
                    { purchasePrice: '6000' },
                ]
            }
            
            // Test cost calculations
            expect(service['calculateCosts'](data)).toEqual({
                totalSharedCost: 1700,
                perHeadShare: 170,
                // ...
            })
        })
    })

    describe('parsePurchaseDate', () => {
        it('should parse DD/MM/YYYY format correctly', () => {
            const service = new BatchPurchaseService()
            const date = service['parsePurchaseDate']('15/03/2024')
            
            expect(date.getFullYear()).toBe(2024)
            expect(date.getMonth()).toBe(2) // March (0-indexed)
            expect(date.getDate()).toBe(15)
        })

        it('should throw error for invalid date', () => {
            const service = new BatchPurchaseService()
            
            expect(() => {
                service['parsePurchaseDate']('invalid')
            }).toThrow('Invalid purchase date format')
        })
    })
})
```

### Integration Tests for Server Action

```typescript
import { describe, it, expect, vi } from 'vitest'
import { createBatchPurchaseAction } from './create-batch-purchase'

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn(() => ({ userId: 'user_123' }))
}))

describe('createBatchPurchaseAction', () => {
    it('should return error if not authenticated', async () => {
        vi.mocked(auth).mockResolvedValueOnce({ userId: null })
        
        const result = await createBatchPurchaseAction({})
        
        expect(result.success).toBe(false)
        expect(result.error).toBe('You must be logged in')
    })

    it('should create batch purchase successfully', async () => {
        const validData = {
            purchaseDate: '15/03/2024',
            marketValue: { name: 'Test Market', location: 'Location' },
            numberOfCattle: '2',
            cattle: [
                { id: 1, tagNo: 'TAG001', purchasePrice: '5000' },
                { id: 2, tagNo: 'TAG002', purchasePrice: '6000' },
            ],
            transportCost: '1000',
            hasilFee: '500',
            miscCost: '200',
        }
        
        const result = await createBatchPurchaseAction(validData)
        
        expect(result.success).toBe(true)
        expect(result.data?.totalCattle).toBe(2)
    })
})
```

## Extension Points

### Adding New Features

1. **Add a new method to the service:**

```typescript
export class BatchPurchaseService {
    // Existing methods...

    /**
     * Updates an existing batch purchase
     */
    async updateBatchPurchase(input: UpdateBatchPurchaseInput): Promise<void> {
        // Business logic here
        await db.transaction(async (tx) => {
            // Database operations
        })
    }

    /**
     * Cancels a batch purchase
     */
    async cancelBatchPurchase(purchaseId: string): Promise<void> {
        // Business logic here
    }
}
```

2. **Create a new server action:**

```typescript
// actions/update-batch-purchase.ts
export async function updateBatchPurchaseAction(data: unknown) {
    const { userId } = await auth()
    // ... validation

    const service = new BatchPurchaseService()
    await service.updateBatchPurchase({ data, userId })

    revalidatePath('/dashboard/cattle')
}
```

### Reusing Logic in Different Contexts

```typescript
// API Route
export async function POST(request: Request) {
    const data = await request.json()
    
    const service = new BatchPurchaseService()
    const result = await service.createBatchPurchase(data)
    
    return Response.json(result)
}

// Background Job
async function processBatchPurchaseJob(jobData: JobData) {
    const service = new BatchPurchaseService()
    await service.createBatchPurchase(jobData)
}

// Admin Script
async function bulkImportPurchases(csvData: CsvData[]) {
    const service = new BatchPurchaseService()
    
    for (const row of csvData) {
        await service.createBatchPurchase(row)
    }
}
```

## Best Practices

### ✅ DO

1. **Keep server actions thin**
   - Only auth, validation, orchestration, cache invalidation

2. **Put business logic in services**
   - Calculations, domain rules, complex operations

3. **Use transactions for multi-step operations**
   - Ensures data consistency

4. **Type your service methods properly**
   - Input types, return types, error types

5. **Break down complex operations**
   - Private methods for each logical step

6. **Follow existing patterns**
   - Look at `CattleQueryService` for guidance

### ❌ DON'T

1. **Don't put database queries in server actions**
   - Violates separation of concerns

2. **Don't put authentication in services**
   - Services should be auth-agnostic

3. **Don't put cache invalidation in services**
   - That's a Next.js concern, not business logic

4. **Don't create God classes**
   - Keep services focused on a single domain

5. **Don't skip validation**
   - Always validate at the boundary (server action)

## Migration Checklist

When converting existing server actions to use service layer:

- [ ] Create service class in `src/services/`
- [ ] Move database operations to service methods
- [ ] Move business logic to service methods
- [ ] Break down complex logic into private methods
- [ ] Add proper types for input/output
- [ ] Update server action to be thin orchestration layer
- [ ] Remove database imports from server action
- [ ] Add service import to server action
- [ ] Test the changes
- [ ] Update documentation

## Related Patterns

- `CattleQueryService` - Query operations
- `CustomerQueryService` - Customer operations
- `CattleFilterService` - Specialized filtering logic
- `CattleSortingService` - Specialized sorting logic

## References

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)

