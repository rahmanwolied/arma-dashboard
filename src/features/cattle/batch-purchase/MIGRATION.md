# Migration Guide: Old Batch Purchase → New Refactored Version

This document guides you through migrating from the old batch-purchase implementation to the new refactored version.

## 🔄 What Changed?

### File Structure

**Old Structure:**
```
components/batch-purchase/
├── BatchPurchaseForm.tsx
└── components/
    ├── PurchaseSetupModal.tsx
    ├── CattleDetailsEntry.tsx
    ├── BatchCosts.tsx
    ├── ReviewPurchase.tsx
    ├── SuccessModal.tsx
    └── icons/
```

**New Structure:**
```
batch-purchase/
├── types.ts                          # NEW: Type definitions
├── validations/
│   └── batch-purchase-schema.ts     # NEW: Zod schemas
├── actions/
│   └── create-batch-purchase.ts     # NEW: Server Action
├── hooks/
│   └── use-create-batch-purchase.ts # NEW: TanStack Query hook
├── components/
│   ├── PurchaseSetupForm.tsx        # REFACTORED
│   ├── CattleDetailsForm.tsx        # REFACTORED
│   ├── BatchCostsForm.tsx           # REFACTORED
│   ├── ReviewPurchase.tsx           # REFACTORED
│   └── SuccessModal.tsx             # REFACTORED
├── BatchPurchaseForm.tsx            # REFACTORED: Main orchestrator
├── index.ts                          # NEW: Public exports
└── README.md                         # NEW: Documentation
```

### Architecture Changes

| Aspect | Old | New |
|--------|-----|-----|
| **Form Validation** | Manual state + validation | React Hook Form + Zod |
| **Data Submission** | Direct logic in component | Server Action + TanStack Query |
| **Type Safety** | Inline interfaces | Centralized types + Zod inference |
| **Loading States** | Manual `isLoading` state | `mutation.isPending` from TanStack Query |
| **Error Handling** | Alert dialogs | Toast notifications (sonner) |
| **Success Feedback** | Basic modal | Toast + Success modal |

## 📋 Step-by-Step Migration

### Step 1: Install Dependencies (if not already installed)

```bash
pnpm add @tanstack/react-query zod @hookform/resolvers/zod sonner
```

### Step 2: Update Your Imports

**Old:**
```tsx
import BatchPurchaseForm from '@/features/cattle/components/batch-purchase/BatchPurchaseForm'
```

**New:**
```tsx
import { BatchPurchaseForm } from '@/features/cattle/batch-purchase'
```

### Step 3: Ensure Providers Are Set Up

Make sure your app has the required providers in `app/layout.tsx` or `app/providers.tsx`:

```tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000 },
    },
  }))
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}
```

### Step 4: Update Page Components

**Old:**
```tsx
// app/cattle/batch-purchase/page.tsx
import BatchPurchaseForm from '@/features/cattle/components/batch-purchase/BatchPurchaseForm'

export default function BatchPurchasePage() {
  return <BatchPurchaseForm />
}
```

**New:**
```tsx
// app/cattle/batch-purchase/page.tsx
import { BatchPurchaseForm } from '@/features/cattle/batch-purchase'

export default function BatchPurchasePage() {
  return <BatchPurchaseForm />
}
```

### Step 5: Remove Old Files

After verifying the new implementation works, you can safely remove:

```bash
rm -rf src/features/cattle/components/batch-purchase/
```

## 🔑 Key API Changes

### Data Types

**Old:**
```typescript
interface Cattle {
  id: number
  tagNo: string
  weight: string
  purchasePrice: string
}

interface PurchaseData {
  purchaseDate: string
  marketName: string
  numberOfCattle: string
  cattle: Cattle[]
  transportCost: string
  hasilFee: string
  miscCost: string
}

enum Screen {
  SETUP = 'setup',
  DETAILS = 'details',
  // ...
}
```

**New:**
```typescript
import {
  type BatchCattleItem,
  type BatchPurchaseData,
  type BatchPurchaseStep,
  BATCH_PURCHASE_STEPS,
} from '@/features/cattle/batch-purchase'
```

### Component Props

**Old (PurchaseSetupModal):**
```typescript
interface Props {
  onNext: (data: { purchaseDate: string; marketName: string; numberOfCattle: string }) => void
  initialData: PurchaseData
}
```

**New (PurchaseSetupForm):**
```typescript
interface PurchaseSetupFormProps {
  onNext: (data: PurchaseSetupFormValues) => void
  initialData?: Partial<PurchaseSetupFormValues>
}
```

## 🎯 Feature Comparison

| Feature | Old | New |
|---------|-----|-----|
| **Form Validation** | ❌ Manual checks | ✅ Zod schemas with real-time validation |
| **Type Safety** | ⚠️ Partial | ✅ Full TypeScript + Zod inference |
| **Loading States** | ✅ Basic | ✅ Enhanced with spinners |
| **Error Messages** | ✅ Alert() | ✅ Toast notifications |
| **Success Feedback** | ✅ Modal | ✅ Toast + Modal |
| **Cache Invalidation** | ❌ Manual refresh | ✅ Automatic via TanStack Query |
| **Server Actions** | ❌ Not used | ✅ Used for mutations |
| **Database Transactions** | ❌ Not implemented | ✅ All-or-nothing batch creation |
| **Code Organization** | ⚠️ Mixed concerns | ✅ Layer separation |
| **Documentation** | ❌ None | ✅ Comprehensive README |
| **Keyboard Navigation** | ✅ Yes | ✅ Yes (preserved) |
| **Currency Formatting** | ✅ Yes | ✅ Yes (preserved) |

## 🐛 Common Migration Issues

### Issue 1: "Cannot find module '@/features/cattle/batch-purchase'"

**Solution:** Make sure the new folder structure is in place at:
```
src/features/cattle/batch-purchase/
```

### Issue 2: Toast notifications not appearing

**Solution:** Add `<Toaster />` to your root layout:

```tsx
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

### Issue 3: "useQuery must be used within QueryClientProvider"

**Solution:** Wrap your app with `QueryClientProvider`. See Step 3 above.

### Issue 4: Type errors on enum values

**Old:**
```typescript
Screen.SETUP // enum
```

**New:**
```typescript
BATCH_PURCHASE_STEPS.SETUP // const object
```

## ✅ Testing Checklist

After migration, test these scenarios:

- [ ] Purchase setup form validation
  - [ ] Empty fields show errors
  - [ ] Invalid dates are rejected
  - [ ] Invalid cattle count is rejected

- [ ] Cattle details entry
  - [ ] Keyboard navigation (Tab, Enter, arrows)
  - [ ] Shift+0 shortcut adds "000" to price
  - [ ] Currency formatting works
  - [ ] Price out-of-range warning (yellow highlight)

- [ ] Batch costs
  - [ ] Cost calculation is correct
  - [ ] Preview shows accurate distribution
  - [ ] Form validation on negative numbers

- [ ] Review screen
  - [ ] All data displays correctly
  - [ ] Financial calculations are accurate
  - [ ] Loading state shows during submission

- [ ] Success handling
  - [ ] Success toast appears
  - [ ] Success modal displays
  - [ ] "Add Another" resets the form
  - [ ] "View Inventory" navigates correctly

- [ ] Error handling
  - [ ] Network errors show toast
  - [ ] Validation errors display in form
  - [ ] Authentication errors are handled

- [ ] Database
  - [ ] All cattle records created
  - [ ] Purchase record created
  - [ ] Weight records created (if provided)
  - [ ] Transaction rollback on error

## 📊 Performance Improvements

The new implementation includes:

1. **Smaller bundle size**: Tree-shakeable exports via `index.ts`
2. **Optimized re-renders**: Using React Hook Form's controlled components
3. **Automatic caching**: TanStack Query handles caching and invalidation
4. **Server-side validation**: Zod validation runs on both client and server
5. **Database transactions**: Ensures data consistency (all-or-nothing)

## 🔗 Related Documentation

- [Main README](./README.md) - Feature documentation
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zod](https://zod.dev/)

## 🆘 Need Help?

If you encounter issues during migration:

1. Check the [README.md](./README.md) for troubleshooting
2. Verify all dependencies are installed
3. Ensure database schema matches expectations
4. Check browser console for errors
5. Review the refactor command guidelines

## 🎉 Migration Complete!

Once you've verified everything works:
1. Delete the old `components/batch-purchase/` folder
2. Update any documentation references
3. Celebrate! 🎊

