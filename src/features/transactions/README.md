# Transactions Feature

## Overview

The transactions feature handles all sales-related operations in the ARMA Dashboard, including creating sales, managing customer payments, tracking multi-animal sales, and calculating discounts and profit margins.

## Features

### Sale Management
- ✅ Create multi-animal sales
- ✅ Link multiple cattle to a single sale
- ✅ Customer management (new/existing)
- ✅ Multiple payment methods (Cash, Credit Card, Bank Transfer, Mobile Money)
- ✅ Partial payments with due tracking
- ✅ Invoice generation

### Discount System
- ✅ **Flat Discount**: Fixed amount in currency
- ✅ **Percentage Discount**: Percentage of total amount
- ✅ **Weight-Based Discount**: Weight reduction in kg

### Profit/Loss Tracking
- ✅ Real-time profit/loss calculations
- ✅ Profit margin percentage
- ✅ Cost breakdown vs revenue
- ✅ Adjusted cattle costs tracking

### Payment Management
- ✅ Multiple payment methods
- ✅ Partial payment support
- ✅ Due amount tracking
- ✅ Payment confirmation workflow

## Quick Start

### Creating a Sale

```typescript
import { SaleForm } from '@/features/transactions'

export default function NewSalePage() {
    return <SaleForm initialData={null} pageTitle="Create New Sale" />
}
```

### Using the Sale Hook

```typescript
import { useCreateSale } from '@/features/transactions'

function MyComponent() {
    const { form, handleSubmit, isPending } = useCreateSale({
        onSuccess: () => {
            console.log('Sale created!')
        }
    })

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)}>
            {/* Form fields */}
        </form>
    )
}
```

### Calling Server Actions

```typescript
import { createSaleAction } from '@/features/transactions'

const result = await createSaleAction(saleData)

if (result.success) {
    console.log('Sale created:', result.data)
} else {
    console.error('Error:', result.message)
}
```

## Architecture

This feature follows a layered architecture pattern:

1. **Server Actions** (`/actions`) - Thin orchestration layer
2. **Service Layer** (`/src/services/SaleService.ts`) - Business logic
3. **Custom Hooks** (`/hooks`) - React Query integration
4. **Helpers** (`/helpers`) - Pure utility functions
5. **Components** (`/components`) - UI layer

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed information.

## Directory Structure

```
transactions/
├── index.ts                           # Public exports
├── types.ts                           # Type definitions
├── ARCHITECTURE.md                    # Architecture documentation
├── README.md                          # This file
│
├── actions/                           # Server actions
│   ├── create-sale.ts
│   ├── get-sale.ts
│   └── delete-sale.ts
│
├── validations/                       # Zod schemas
│   └── sale-schema.ts
│
├── hooks/                             # Custom hooks
│   ├── use-create-sale.ts
│   ├── use-sale-query.ts
│   └── use-cattle-query.ts
│
├── helpers/                           # Utility functions
│   └── calculations.ts
│
└── components/                        # UI components
    ├── sale-form.tsx
    ├── sales-table.tsx
    ├── customer-search/               # Customer search module
    └── cattle-search/                 # Cattle search module
```

## API Reference

### Server Actions

#### `createSaleAction(data: unknown)`
Creates a new sale with customer, animals, and payment information.

**Returns:** `ActionResult<SaleServiceResult>`

#### `getSaleByIdAction(id: string)`
Retrieves a sale by ID with all related data.

**Returns:** `ActionResult<SaleFormData>`

#### `deleteSaleAction(id: string)`
Deletes a sale and all related records (links, payments).

**Returns:** `ActionResult<void>`

### Hooks

#### `useCreateSale(options?: UseCreateSaleOptions)`
Hook for creating sales with form management.

**Returns:**
```typescript
{
    form: UseFormReturn<SaleFormData>
    handleSubmit: (data: SaleFormData) => Promise<void>
    isPending: boolean
}
```

#### `useSaleQuery(options: UseSaleQueryOptions)`
Hook for fetching sale data.

**Returns:** React Query result

#### `useCattleQuery()`
Hook for searching and selecting cattle for sale.

**Returns:** React Query result

### Helpers

#### `calculateDiscount(totalWeight, pricePerKg, discountType, discountInput)`
Calculates discount amount based on type.

**Returns:** `DiscountCalculationResult`

#### `calculateProfitLoss(finalAmount, totalCost)`
Calculates profit/loss and margin.

**Returns:** `{ profitLoss: number, profitMargin: number }`

## Components

### SaleForm
Main form component for creating/editing sales.

**Props:**
```typescript
{
    initialData: SaleFormData | null
    pageTitle: string
}
```

**Features:**
- Customer search/creation
- Multi-animal selection
- Discount calculation
- Payment processing
- Partial payment warning modal
- Real-time profit/loss preview

### SalesTable
Data table for displaying sales list.

**Features:**
- Sortable columns
- Filterable data
- Row actions (view, edit, delete)
- Pagination
- URL-synced state

### Customer Search Module
Reusable customer search component with:
- Autocomplete search
- New customer form
- Address management (Division/District/Zone)
- Existing customer details display

### Cattle Search Module
Reusable cattle search component with:
- Tag number search
- Multi-select support
- Available cattle filtering
- Weight and cost display

## Business Rules

### Sale Creation
1. Must select at least one animal
2. Must provide customer information (new or existing)
3. Price per kg must be positive
4. Amount paid cannot exceed final amount

### Discount Calculation
- **FLAT**: Direct currency amount deduction
- **PERCENT**: Percentage of (totalWeight × pricePerKg)
- **WEIGHT_BASED**: (pricePerKg × discountInput in kg)

### Payment Rules
- If amountPaid < finalAmount, creates a credit sale
- Due amount = finalAmount - amountPaid
- Partial payments trigger confirmation dialog
- Payment record only created if amountPaid > 0

### Profit/Loss Calculation
```typescript
profitLoss = finalAmount - totalCost
profitMargin = (profitLoss / totalCost) × 100
```

Where:
- `finalAmount` = (totalWeight × pricePerKg) - discountAmount
- `totalCost` = sum of all cattle adjustedPrice values

## Database Schema

### Sales Table
- `id`: UUID
- `farmId`: UUID (multi-farm support)
- `customerId`: UUID (references customers)
- `invoiceNumber`: String (auto-generated)
- `totalAmount`: Decimal
- `discountAmount`: Decimal (nullable)
- `discountType`: Enum (nullable)
- `amountPaid`: Decimal
- `amountDue`: Decimal
- `isCredit`: Boolean
- `paymentTerms`: Text (nullable)
- `saleDate`: Timestamp

### Sale-Animal Links (Junction Table)
- `saleId`: UUID
- `animalId`: UUID

### Payments Table
- `id`: UUID
- `saleId`: UUID
- `paidAmount`: Decimal
- `paidAt`: Timestamp
- `paymentMethod`: Enum

## Error Handling

All actions return a consistent result type:

```typescript
type ActionResult<T> =
    | { success: true; message: string; data: T }
    | { success: false; message: string; error?: unknown }
```

Errors are:
1. Caught in server actions
2. Logged to console
3. Converted to user-friendly messages
4. Returned to client for display (toast notifications)

## Testing

### Running Tests
```bash
pnpm test:unit          # Unit tests for helpers and services
pnpm test:integration   # Integration tests for actions
pnpm test:e2e           # End-to-end tests for components
```

### Test Coverage
- ✅ Discount calculations
- ✅ Profit/loss calculations
- ✅ Server action validation
- ✅ Service layer business logic
- ✅ Component rendering
- ✅ Form submission

## Performance Considerations

### Caching Strategy
- Server-side: Uses `revalidateTag('sales')` on mutations
- Client-side: React Query with 5-minute stale time
- Optimistic updates for better UX

### Database Optimization
- Uses transactions for data consistency
- Batch inserts for sale-animal links
- Indexed foreign keys for joins

## Common Tasks

### Adding a New Discount Type

1. Update `DiscountType` in `types.ts`
2. Add case to `calculateDiscount()` in `helpers/calculations.ts`
3. Update `saleSchema` in `validations/sale-schema.ts`
4. Add UI option in `sale-form.tsx`

### Adding a New Payment Method

1. Update database enum in `src/db/schema/enums/`
2. Update `PaymentMethod` type in `types.ts`
3. Update `saleSchema` in `validations/sale-schema.ts`
4. Add UI option in `sale-form.tsx`

### Extending the Service Layer

Add new methods to `SaleService`:

```typescript
export class SaleService {
    // Existing methods...

    async updateSale(id: string, data: Partial<SaleFormData>) {
        // Implementation
    }

    async getSalesBetweenDates(startDate: Date, endDate: Date) {
        // Implementation
    }
}
```

Then create corresponding server actions in `/actions`.

## Troubleshooting

### Sale creation fails
- Check that all selected cattle are still available
- Verify customer data is valid
- Check database connection
- Review console logs for detailed error

### Discount calculation incorrect
- Verify discount type matches input
- Check that pricePerKg and totalWeight are correct
- Review `calculateDiscount()` logic in helpers

### Partial payment modal doesn't appear
- Check that `amountPaid < finalAmount`
- Verify modal state management in `sale-form.tsx`
- Review `discountPreview` calculations

## Contributing

When modifying this feature:

1. Follow the layered architecture pattern
2. Keep server actions thin
3. Put business logic in services
4. Create helpers for pure functions
5. Use custom hooks for component logic
6. Update tests for any changes
7. Update this README if adding new features

## Related Features

- **Cattle Management** (`/features/cattle`) - Animal data
- **Customer Management** (`/features/customers`) - Customer data
- **Batch Purchase** (`/features/cattle/batch-purchase`) - Similar architecture pattern

## Support

For questions or issues:
1. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for architectural guidance
2. Review existing code examples
3. Check related features for similar patterns
4. Consult the team lead

## License

Part of the ARMA Dashboard project.
