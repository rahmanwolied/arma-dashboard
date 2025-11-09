# Refactoring Summary: Batch Purchase Architecture

## Overview

Refactored the batch purchase feature from a monolithic server action to a proper **layered architecture** following the service layer pattern.

## What Changed?

### Before: Database Logic in Server Action ❌

```typescript
// actions/create-batch-purchase.ts (182 lines)
export async function createBatchPurchaseAction(data: unknown) {
    // ❌ Auth
    const { userId } = await auth()
    
    // ❌ Validation
    const validated = schema.parse(data)
    
    // ❌ Business Logic (calculations)
    const transportCost = parseFloat(validated.transportCost) || 0
    const hasilFee = parseFloat(validated.hasilFee) || 0
    const totalSharedCost = transportCost + hasilFee + miscCost
    const perHeadShare = totalSharedCost / numCattle
    
    // ❌ Database Transactions
    await db.transaction(async (tx) => {
        const marketResult = await tx.select({ marketId: markets.id })
            .from(markets)
            .where(eq(markets.name, validated.marketValue.name))
            .limit(1)
        
        let marketId = marketResult[0]?.marketId
        
        if (!marketId) {
            const [market] = await tx.insert(markets).values({ ... })
            marketId = market.id
        }
        
        const [purchase] = await tx.insert(purchases).values({ ... })
        
        for (const cattleItem of validated.cattle) {
            const [animal] = await tx.insert(animals).values({ ... })
            await tx.insert(cattle).values({ ... })
            await tx.insert(animalPurchases).values({ ... })
            if (cattleItem.weight) {
                await tx.insert(weightRecords).values({ ... })
            }
        }
    })
    
    // ❌ Cache Invalidation
    revalidatePath('/dashboard/cattle')
}
```

**Problems:**
- 182 lines of mixed concerns
- Business logic + database operations + auth + cache invalidation
- Not reusable
- Hard to test
- Violates single responsibility principle

### After: Layered Architecture ✅

#### 1. Server Action (70 lines) - Thin Orchestration Layer

```typescript
// actions/create-batch-purchase.ts
export async function createBatchPurchaseAction(data: unknown) {
    try {
        // ✅ 1. Authentication
        const { userId } = await auth()
        if (!userId) {
            return { success: false, error: 'Not authenticated' }
        }

        // ✅ 2. Validation
        const validated = completeBatchPurchaseSchema.parse(data)

        // ✅ 3. Orchestration - Delegate to service
        const service = new BatchPurchaseService()
        const result = await service.createBatchPurchase({
            data: validated,
            userId,
        })

        // ✅ 4. Cache invalidation
        revalidatePath('/dashboard/cattle')

        return { success: true, data: result }
    } catch (error) {
        return { success: false, error: error.message }
    }
}
```

**Benefits:**
- 70 lines (61% reduction)
- Clear, single responsibility
- Easy to understand at a glance
- Focused on Next.js concerns only

#### 2. Service Layer (249 lines) - Business Logic & Database

```typescript
// services/BatchPurchaseService.ts
export class BatchPurchaseService {
    /**
     * Creates a batch purchase with all associated records
     */
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

    // Private methods - Each with a single responsibility
    private calculateCosts(data) { ... }
    private parsePurchaseDate(dateString: string): Date { ... }
    private async ensureMarket(tx, marketValue) { ... }
    private async createPurchaseRecord(tx, params) { ... }
    private async createCattleEntry(tx, params) { ... }
}
```

**Benefits:**
- Reusable from anywhere (server actions, API routes, background jobs)
- Testable independently
- Well-organized private methods
- Each method has a single responsibility
- No Next.js or Clerk dependencies

## Architecture Comparison

### Before

```
┌─────────────────────────────────────────┐
│      Server Action (Monolith)           │
│                                         │
│  • Auth                                 │
│  • Validation                           │
│  • Business Logic                       │
│  • Database Queries                     │
│  • Transactions                         │
│  • Cache Invalidation                   │
│                                         │
│  Everything in one place ❌             │
└─────────────────────────────────────────┘
```

### After

```
┌─────────────────────────────────────────┐
│         Server Action Layer             │
│  • Auth (Clerk)                         │
│  • Validation (Zod)                     │
│  • Orchestration                        │
│  • Cache Invalidation (Next.js)         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│          Service Layer                  │
│  • Business Logic                       │
│  • Database Transactions                │
│  • Data Processing                      │
└─────────────────────────────────────────┐
                  ↓
┌─────────────────────────────────────────┐
│         Database Layer                  │
│  • Drizzle ORM                          │
│  • PostgreSQL                           │
└─────────────────────────────────────────┘
```

## Measurable Improvements

### 1. Code Organization

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Server Action Lines | 182 | 70 | **61% reduction** |
| Single File | 1 | 2 | Better separation |
| Concerns Mixed | 6 | 1 per layer | Clear boundaries |

### 2. Testability

| Aspect | Before | After |
|--------|--------|-------|
| Unit Tests | Difficult (need to mock Clerk, Next.js, DB) | Easy (just test business logic) |
| Integration Tests | Complex | Simple (mock service layer) |
| Test Isolation | Low | High |

### 3. Reusability

| Context | Before | After |
|---------|--------|-------|
| Server Action | ✅ | ✅ |
| API Route | ❌ | ✅ |
| Background Job | ❌ | ✅ |
| Admin Script | ❌ | ✅ |
| CLI Tool | ❌ | ✅ |

### 4. Maintainability

| Aspect | Before | After |
|--------|--------|-------|
| Understanding | Need to read all 182 lines | Read 70-line orchestration |
| Modifying Business Logic | Change server action | Change service only |
| Adding Features | Grow monolith | Add service methods |
| Finding Bugs | Search through everything | Check relevant layer |

## Example: Testing Improvements

### Before: Hard to Test ❌

```typescript
// Need to mock everything
import { vi } from 'vitest'

// Mock Clerk
vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }))

// Mock Next.js
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

// Mock database
vi.mock('@/db', () => ({ db: mockDb }))

// Test is complex and slow
test('creates batch purchase', async () => {
    // Setup complex mocks
    vi.mocked(auth).mockResolvedValue({ userId: 'test' })
    mockDb.transaction.mockImplementation(async (cb) => {
        // Mock transaction behavior
    })
    
    // Test...
})
```

### After: Easy to Test ✅

```typescript
// Test service in isolation
import { BatchPurchaseService } from '@/services/BatchPurchaseService'

describe('BatchPurchaseService', () => {
    test('calculates costs correctly', () => {
        const service = new BatchPurchaseService()
        const result = service['calculateCosts']({
            transportCost: '1000',
            hasilFee: '500',
            miscCost: '200',
            numberOfCattle: '10',
        })
        
        expect(result.perHeadShare).toBe(170)
        expect(result.totalSharedCost).toBe(1700)
    })
    
    test('parses date correctly', () => {
        const service = new BatchPurchaseService()
        const date = service['parsePurchaseDate']('15/03/2024')
        
        expect(date.getFullYear()).toBe(2024)
        expect(date.getMonth()).toBe(2)
        expect(date.getDate()).toBe(15)
    })
})
```

## Example: Reusability Improvements

### Before: Cannot Reuse ❌

```typescript
// Want to import purchases from CSV?
// Need to duplicate all the logic ❌
async function importFromCSV(csvData) {
    // Copy-paste all the code from the server action
    // or call the server action (but lose control)
}
```

### After: Highly Reusable ✅

```typescript
// API Route
export async function POST(request: Request) {
    const data = await request.json()
    const service = new BatchPurchaseService()
    return Response.json(await service.createBatchPurchase(data))
}

// Background Job
async function processBatchPurchaseJob(jobData: JobData) {
    const service = new BatchPurchaseService()
    await service.createBatchPurchase(jobData)
}

// CLI Import Tool
async function importFromCSV(csvData: CsvRow[]) {
    const service = new BatchPurchaseService()
    for (const row of csvData) {
        await service.createBatchPurchase(transformCsvRow(row))
    }
}

// Admin Panel
async function createPurchaseAsAdmin(data: AdminPurchaseData) {
    const service = new BatchPurchaseService()
    return await service.createBatchPurchase(data)
}
```

## Consistency with Codebase

### Existing Service Layer Examples

The refactoring aligns with existing patterns:

1. **CattleQueryService** - Complex cattle queries
2. **CustomerQueryService** - Customer operations
3. **CattleFilterService** - Filter logic
4. **CattleSortingService** - Sorting logic

### Pattern Consistency

| Feature | Pattern Used | Consistent? |
|---------|-------------|-------------|
| Cattle Queries | Service Layer | ✅ |
| Customer Queries | Service Layer | ✅ |
| Batch Purchase (Before) | Monolith | ❌ |
| Batch Purchase (After) | Service Layer | ✅ |

## Migration Guide for Other Features

To apply this pattern to other server actions:

1. **Identify mixed concerns** in the server action
2. **Create a service class** in `src/services/`
3. **Move business logic** to service methods
4. **Move database operations** to service methods
5. **Break down into private methods** for clarity
6. **Update server action** to be thin orchestration
7. **Add tests** for service methods

## Conclusion

The refactoring successfully:
- ✅ **Separates concerns** into distinct layers
- ✅ **Improves testability** dramatically
- ✅ **Enables reusability** across contexts
- ✅ **Follows existing patterns** in the codebase
- ✅ **Reduces complexity** of server action by 61%
- ✅ **Makes code more maintainable** and understandable

This is a **model implementation** that can be applied to other features in the codebase.

## Files Changed

```
✅ Created: src/services/BatchPurchaseService.ts (249 lines)
✏️  Modified: src/features/cattle/batch-purchase/actions/create-batch-purchase.ts (182 → 70 lines)
📝 Added: src/features/cattle/batch-purchase/ARCHITECTURE.md (documentation)
```

## Next Steps

Consider applying this pattern to:
- [ ] Other batch operations
- [ ] Sales operations
- [ ] Health record operations
- [ ] Breeding record operations
- [ ] Any server action with complex logic

---

**Date**: November 9, 2025
**Impact**: High - Improves architecture quality
**Risk**: Low - No breaking changes, same functionality

