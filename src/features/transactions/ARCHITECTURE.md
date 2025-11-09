# Transactions Feature Architecture

## Overview

The transactions feature follows a **layered architecture** that separates concerns and promotes maintainability, testability, and reusability. This architecture is consistent with other features in the codebase such as `cattle/batch-purchase`.

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

## File Structure

```
src/
├── features/transactions/
│   ├── index.ts                           # Public API exports
│   ├── types.ts                           # Feature-wide types
│   │
│   ├── actions/                           # Server Actions (thin orchestration)
│   │   ├── index.ts                       # Barrel export
│   │   ├── create-sale.ts                 # Create sale action
│   │   ├── get-sale.ts                    # Get sale action
│   │   └── delete-sale.ts                 # Delete sale action
│   │
│   ├── validations/                       # Zod schemas
│   │   └── sale-schema.ts                 # Sale form validation
│   │
│   ├── hooks/                             # Custom React hooks
│   │   ├── use-create-sale.ts             # Mutation hook for creating sales
│   │   ├── use-sale-query.ts              # Query hook for fetching sales
│   │   └── use-cattle-query.ts            # Query hook for cattle search
│   │
│   ├── helpers/                           # Pure utility functions
│   │   └── calculations.ts                # Discount and profit calculations
│   │
│   └── components/                        # UI Components
│       ├── sale-form.tsx                  # Main sale form
│       ├── sales-table.tsx                # Sales data table
│       ├── sales-table-columns.tsx        # Table column definitions
│       ├── sales-cell-action.tsx          # Table row actions
│       ├── sale-view-page.tsx             # View wrapper
│       │
│       ├── customer-search/               # Customer search module
│       │   ├── index.ts
│       │   ├── types.ts
│       │   ├── customer-search-bar.tsx
│       │   ├── existing-customer-details.tsx
│       │   ├── new-customer-form.tsx
│       │   ├── division-combobox.tsx
│       │   ├── district-combobox.tsx
│       │   ├── zone-combobox.tsx
│       │   ├── use-customers-query.ts
│       │   └── use-location-data.ts
│       │
│       └── cattle-search/                 # Cattle search module
│           ├── index.ts
│           ├── types.ts
│           ├── cattle-search-field.tsx
│           └── use-cattle-query.ts
│
└── services/
    └── SaleService.ts                     # Business logic & database operations
```

## Layer Responsibilities

### 1. Server Action Layer (`actions/*.ts`)

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
export async function createSaleAction(data: unknown) {
    try {
        // 1. Authentication
        const { userId } = await auth()
        if (!userId) {
            return { success: false, error: 'Not authenticated' }
        }

        // 2. Validation
        const validated = saleSchema.parse(data)

        // 3. Delegate to service
        const service = new SaleService()
        const result = await service.createSale({
            data: validated,
            userId,
        })

        // 4. Cache invalidation
        revalidateTag('sales')
        revalidatePath('/dashboard/transactions')

        return { success: true, data: result }
    } catch (error) {
        return { success: false, error: handleError(error) }
    }
}
```

### 2. Service Layer (`SaleService.ts`)

**Responsibilities:**
- ✅ Business logic (discount calculations, payment processing)
- ✅ Database transactions
- ✅ Data processing
- ✅ Domain rules enforcement

**Anti-patterns:**
- ❌ Authentication logic
- ❌ Cache invalidation
- ❌ HTTP concerns
- ❌ User-facing error messages

**Example:**

```typescript
export class SaleService {
    async createSale(input: CreateSaleInput): Promise<SaleServiceResult> {
        const { data, userId } = input

        return await db.transaction(async (tx) => {
            // 1. Create or get customer
            const customerId = await this.ensureCustomer(tx, data.customer)

            // 2. Calculate totals
            const calculations = this.calculateSaleTotals(data)

            // 3. Create sale record
            const sale = await this.createSaleRecord(tx, {
                customerId,
                calculations,
                data,
            })

            // 4. Link animals to sale
            await this.linkAnimalsToSale(tx, sale.id, data.animals)

            // 5. Create payment record
            if (data.amountPaid > 0) {
                await this.createPaymentRecord(tx, sale.id, data)
            }

            return { sale, ...calculations }
        })
    }

    private calculateSaleTotals(data: SaleFormData) {
        // Business logic for calculations
    }

    private async ensureCustomer(tx, customer) {
        // Customer creation/retrieval logic
    }
}
```

### 3. Custom Hooks Layer (`hooks/*.ts`)

**Responsibilities:**
- ✅ Encapsulate React Query logic
- ✅ Manage form state
- ✅ Handle mutations and queries
- ✅ Provide clean API to components

**Example:**

```typescript
export function useCreateSale(options?: UseCreateSaleOptions) {
    const queryClient = useQueryClient()

    const form = useForm<SaleFormData>({
        resolver: zodResolver(saleSchema),
        defaultValues: { ... }
    })

    const { mutateAsync, isPending } = useMutation({
        mutationFn: createSaleAction,
        onSuccess: () => {
            toast.success('Sale created successfully!')
            queryClient.invalidateQueries({ queryKey: ['sales'] })
            options?.onSuccess?.()
        },
        onError: (error) => {
            toast.error('Failed to create sale')
            options?.onError?.(error)
        }
    })

    return { form, handleSubmit: mutateAsync, isPending }
}
```

### 4. Helpers Layer (`helpers/*.ts`)

**Responsibilities:**
- ✅ Pure utility functions
- ✅ Calculations that don't require database access
- ✅ Data formatting and transformation

**Example:**

```typescript
export function calculateDiscount(
    totalWeight: number,
    pricePerKg: number,
    discountType: DiscountType,
    discountInput: number
): DiscountCalculationResult {
    // Pure calculation logic
}

export function calculateProfitLoss(
    finalAmount: number,
    totalCost: number
): { profitLoss: number; profitMargin: number } {
    // Pure calculation logic
}
```

## Design Benefits

### ✅ Advantages

1. **Clear Separation of Concerns**
   - Each layer has a single responsibility
   - Easy to understand and maintain

2. **Highly Reusable**
   - Service can be called from server actions, API routes, background jobs
   - Business logic centralized in one place

3. **Easy to Test**
   - Can test service layer independently of Next.js
   - Can test hooks independently of server actions
   - Mock dependencies at appropriate levels

4. **Loose Coupling**
   - Server actions don't know about database details
   - Components don't know about server action implementation

5. **Consistent Architecture**
   - Follows same pattern as `cattle/batch-purchase`
   - Easy for team members to understand

## Component Architecture

### Nested Component Modules

Complex components are organized as self-contained modules:

```
customer-search/
├── index.ts                    # Public exports
├── types.ts                    # Module types
├── customer-search-bar.tsx     # Main component
├── existing-customer-details.tsx
├── new-customer-form.tsx
├── division-combobox.tsx
├── district-combobox.tsx
├── zone-combobox.tsx
├── use-customers-query.ts      # Module-specific hook
└── use-location-data.ts        # Module-specific hook
```

**Benefits:**
- Encapsulation: Module internals are hidden
- Reusability: Can import entire module elsewhere
- Maintainability: Related code stays together

## Best Practices

### ✅ DO

1. **Keep server actions thin**
   - Only auth, validation, orchestration, cache invalidation

2. **Put business logic in services**
   - Calculations, domain rules, complex operations

3. **Use custom hooks for component logic**
   - Encapsulate mutations and queries
   - Separate concerns from UI rendering

4. **Create helper functions for pure logic**
   - Calculations without side effects
   - Easy to test and reuse

5. **Organize components into modules**
   - Group related components together
   - Provide clean public API via index.ts

### ❌ DON'T

1. **Don't put database queries in server actions**
   - Violates separation of concerns

2. **Don't put authentication in services**
   - Services should be auth-agnostic

3. **Don't put cache invalidation in services**
   - That's a Next.js concern, not business logic

4. **Don't mix component and business logic**
   - Use hooks to separate concerns

5. **Don't create God classes or files**
   - Keep modules focused on a single domain

## Testing Strategy

### Unit Tests

```typescript
describe('SaleService', () => {
    it('should calculate discount correctly', () => {
        const service = new SaleService()
        const result = service.calculateDiscount(/* ... */)
        expect(result.discountAmount).toBe(expected)
    })
})
```

### Integration Tests

```typescript
describe('createSaleAction', () => {
    it('should create sale successfully', async () => {
        const result = await createSaleAction(validData)
        expect(result.success).toBe(true)
    })
})
```

### Component Tests

```typescript
describe('SaleForm', () => {
    it('should render and submit', async () => {
        render(<SaleForm />)
        // Fill form and submit
        expect(mockCreateSale).toHaveBeenCalled()
    })
})
```

## Migration Notes

This architecture is a refactoring from the previous monolithic `actions.ts` file which contained all business logic. The new structure:

- Separates concerns across multiple focused files
- Makes testing easier
- Improves reusability
- Maintains consistency with other features

## Related Patterns

- `cattle/batch-purchase` - Same architectural pattern
- `CattleQueryService` - Query operations
- `CustomerQueryService` - Customer operations

## References

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)
