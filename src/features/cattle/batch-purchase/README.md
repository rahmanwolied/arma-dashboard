# Batch Purchase Feature

A refactored, production-ready implementation of the batch cattle purchase workflow following React 19, Next.js 15, and modern best practices.

## 🏗️ Architecture

This feature follows a **scalable, layer-separated architecture**:

```
batch-purchase/
├── types.ts                          # TypeScript type definitions
├── validations/
│   └── batch-purchase-schema.ts     # Zod validation schemas
├── actions/
│   └── create-batch-purchase.ts     # Server Actions (data mutations)
├── hooks/
│   └── use-create-batch-purchase.ts # TanStack Query hooks
├── components/                       # React components (presentation layer)
│   ├── PurchaseSetupForm.tsx        # Step 1: Date, market, count
│   ├── CattleDetailsForm.tsx        # Step 2: Individual cattle data
│   ├── BatchCostsForm.tsx           # Step 3: Shared costs
│   ├── ReviewPurchase.tsx           # Step 4: Final review
│   └── SuccessModal.tsx             # Step 5: Success confirmation
├── BatchPurchaseForm.tsx            # Main orchestrator component
├── index.ts                          # Public exports
└── README.md                         # This file
```

## ✨ Key Features

### 1. **Multi-Step Wizard Flow**
- **Step 1**: Purchase setup (date, market, number of cattle)
- **Step 2**: Individual cattle details (weight, purchase price)
- **Step 3**: Batch costs (transport, hasil, miscellaneous)
- **Step 4**: Review & confirm
- **Step 5**: Success with navigation options

### 2. **Modern Form Architecture**
- ✅ **shadcn Forms** with React Hook Form
- ✅ **Zod validation** with zodResolver
- ✅ **TanStack Query** for mutations
- ✅ **Loading states** with spinners
- ✅ **Toast notifications** (sonner) for success/error feedback

### 3. **Server-First Architecture**
- Server Actions for data mutations (no API routes needed)
- Clerk authentication integration
- Drizzle ORM for database operations
- Transaction-based batch creation (all-or-nothing)

### 4. **Enhanced UX**
- Keyboard navigation (Tab, Enter, Arrow keys)
- Auto-focus on first input
- Currency formatting (Indian numbering system)
- Price range warnings (yellow highlight for unusual prices)
- Cost distribution preview
- Keyboard shortcut: Shift+0 adds "000" to price input

## 🚀 Usage

### Basic Implementation

```tsx
import { BatchPurchaseForm } from '@/features/cattle/batch-purchase'

export default function BatchPurchasePage() {
  return <BatchPurchaseForm />
}
```

### Using the Hook Directly

```tsx
'use client'

import { useCreateBatchPurchase } from '@/features/cattle/batch-purchase'
import type { CompleteBatchPurchaseFormValues } from '@/features/cattle/batch-purchase'

export function CustomBatchForm() {
  const mutation = useCreateBatchPurchase({
    onSuccess: (data) => {
      console.log(`Created ${data.totalCattle} cattle records`)
      // Custom success handling
    },
  })

  const handleSubmit = (formData: CompleteBatchPurchaseFormValues) => {
    mutation.mutate(formData)
  }

  return (
    <div>
      {/* Your custom form UI */}
      <button 
        onClick={() => handleSubmit(data)} 
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Saving...' : 'Save Purchase'}
      </button>
    </div>
  )
}
```

## 📊 Data Flow

```
User Input → React Hook Form → Zod Validation → TanStack Query Mutation
                                                         ↓
                                                  Server Action
                                                         ↓
                                            Clerk Auth Check + Validation
                                                         ↓
                                              Database Transaction
                                            (Create animals, cattle,
                                             purchases, weight records)
                                                         ↓
                                                  Cache Invalidation
                                                         ↓
                                            Success Toast + UI Update
```

## 🧪 Cost Calculation Logic

The batch purchase feature distributes shared costs evenly across all cattle:

```typescript
// Example: 10 cattle purchase
const transportCost = 12000  // Total transport
const hasilFee = 3500        // Market fee
const miscCost = 1500        // Other costs

const totalSharedCost = transportCost + hasilFee + miscCost // 17000
const perHeadShare = totalSharedCost / 10 // 1700 per cattle

// For each cattle:
const adjustedPrice = basePurchasePrice + perHeadShare

// Example:
// Cattle #1: Base 50,000 + Share 1,700 = 51,700 (final cost)
// Cattle #2: Base 55,000 + Share 1,700 = 56,700 (final cost)
```

## 🎯 Best Practices Implemented

### ✅ Naming Conventions
- **Components**: `PascalCase` (e.g., `BatchPurchaseForm.tsx`)
- **Hooks**: `kebab-case` with `use-` prefix (e.g., `use-create-batch-purchase.ts`)
- **Actions**: `kebab-case` (e.g., `create-batch-purchase.ts`)
- **Types**: `PascalCase` (e.g., `BatchPurchaseData`)

### ✅ Separation of Concerns
- **Components**: Presentation only, no business logic
- **Hooks**: Data fetching/mutations with TanStack Query
- **Actions**: Server-side business logic and database operations
- **Validations**: Centralized Zod schemas

### ✅ Type Safety
- Full TypeScript coverage
- Zod schema inference for type generation
- No `any` types (except where necessary for legacy compatibility)

### ✅ Error Handling
- Try-catch blocks in server actions
- User-friendly error messages
- Toast notifications for all errors
- Form field validation errors

### ✅ Performance
- Server Components where possible
- Client Components only when needed (`'use client'` directive)
- Optimistic UI updates (via TanStack Query)
- Cache invalidation for related queries

## 🔧 Configuration

### Required Environment Variables
Ensure these are set in your `.env` file:

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
```

### Database Schema Requirements

The feature requires these tables:
- `animals` - Base animal records
- `cattle` - Cattle-specific data
- `animalPurchases` - Purchase transaction records
- `weightRecords` - Weight tracking

## 📝 Validation Rules

### Purchase Setup
- **Purchase Date**: Required, valid date format (DD/MM/YYYY)
- **Market Name**: Required, max 200 characters
- **Number of Cattle**: Required, 1-1000

### Cattle Details
- **Tag Number**: Auto-generated, read-only
- **Weight**: Optional, positive number
- **Purchase Price**: Required, positive number

### Batch Costs
- **Transport Cost**: Required, non-negative number
- **Hasil Fee**: Required, non-negative number
- **Miscellaneous Cost**: Required, non-negative number

## 🐛 Troubleshooting

### Issue: Toast notifications not showing
**Solution**: Ensure `<Toaster />` from `sonner` is included in your root layout:

```tsx
// app/layout.tsx
import { Toaster } from 'sonner'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
```

### Issue: TanStack Query not working
**Solution**: Wrap your app with `QueryClientProvider`:

```tsx
// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient())
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### Issue: Authentication errors
**Solution**: Verify Clerk is properly configured and the user is authenticated.

## 🎨 Customization

### Changing Default Costs

Edit `types.ts` or component defaults:

```typescript
// In BatchPurchaseForm.tsx
const getInitialData = (): BatchPurchaseData => ({
  // ... other fields
  transportCost: '15000',  // Change default transport cost
  hasilFee: '4000',        // Change default hasil fee
  miscCost: '2000',        // Change default misc cost
})
```

### Adding Custom Fields

1. Update `types.ts` with new fields
2. Update `validations/batch-purchase-schema.ts` with validation
3. Update server action to handle new fields
4. Update form components to collect new data

## 📚 Related Documentation

- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Next.js 15 Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [shadcn/ui](https://ui.shadcn.com/)

## 🤝 Contributing

When modifying this feature:
1. Maintain the layer separation (components → hooks → actions)
2. Update validation schemas when adding/changing fields
3. Add proper TypeScript types
4. Include loading states for all async operations
5. Show toast notifications for all mutations
6. Update this README with significant changes

## 📄 License

Part of the ARMA Dashboard project.

