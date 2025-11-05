# Cattle Purchase Flow Implementation Summary

## Overview

Successfully implemented the transformation of the cattle purchase system from individual entry to daily batch purchasing with automatic cost distribution across all cattle bought on the same day.

## Completed Tasks

### 1. Database Schema Changes ✅

#### Updated Tables

**`purchases` table** - Added new cost tracking fields:
- `pickupCost` (decimal 10,2) - Transportation/pickup costs
- `hasilCost` (decimal 10,2) - Market commission/broker fees
- `miscellaneousCost` (decimal 10,2) - Other expenses
- `totalAdditionalCosts` (decimal 10,2) - Sum of all additional costs
- `isFinalized` (boolean, default false) - Whether costs are recorded and distributed
- Kept `totalTransportCost` for backwards compatibility

**`animalPurchases` table** - Added price tracking fields:
- `pricePerKg` (decimal 10,2) - Rate per kilogram
- `actualPrice` (decimal 10,2) - Original price (pricePerKg × weight)
- `adjustedPrice` (decimal 10,2) - Actual price + distributed additional costs
- Kept `purchasePrice` for backwards compatibility (now stores adjustedPrice)

**Files Modified:**
- [src/db/schema/tables/purchases.ts](src/db/schema/tables/purchases.ts)

**Migration Generated:**
- [src/db/migrations/0003_bent_giant_man.sql](src/db/migrations/0003_bent_giant_man.sql)

### 2. Validation Schemas ✅

Created comprehensive Zod schemas for the new purchase flow:

- `dailyPurchaseSchema` - For creating/getting daily purchase records
- `cattleEntrySchema` - For individual cattle data entry
- `addCattleToPurchaseSchema` - For batch adding cattle
- `updatePurchaseCostsSchema` - For updating additional costs
- `finalizePurchaseSchema` - For finalizing and distributing costs
- `removeCattleFromPurchaseSchema` - For removing cattle before finalization

**Files Created:**
- [src/features/cattle/schemas/purchase-schemas.ts](src/features/cattle/schemas/purchase-schemas.ts)

### 3. Server Actions ✅

Implemented all required server actions with proper authorization, validation, and error handling:

#### `createOrGetDailyPurchase()`
- Checks if purchase exists for the selected date
- Creates new purchase if none exists
- Returns existing purchase to continue adding cattle

#### `addCattleToPurchase()`
- Validates purchase is not finalized
- Creates animal, cattle, weight, and purchase records
- Auto-generates tag numbers (can be manually overridden)
- Calculates actual price (pricePerKg × weight)
- Marks weight record with `onPurchase: true`

#### `updatePurchaseCosts()`
- Updates pickup, hasil, and miscellaneous costs
- Calculates and stores total additional costs
- Only allowed before finalization

#### `finalizePurchase()`
- Distributes additional costs equally across all cattle
- Calculates adjusted price for each animal
- Marks purchase as finalized (prevents further edits)
- Updates both `adjustedPrice` and `purchasePrice` fields

#### `removeCattleFromPurchase()`
- Only allowed before finalization
- Deletes animal and cascades to related records

#### `getPurchaseCattle()`
- Fetches all cattle for a specific purchase with details

**Files Created:**
- [src/features/cattle/purchase-actions.ts](src/features/cattle/purchase-actions.ts)

### 4. Batch Purchase UI ✅

Created a comprehensive multi-step form component following the specification:

#### Step 1: Purchase Date & Basic Info
- Date picker (defaults to today)
- Displays finalization status
- Loads existing purchase for selected date

#### Step 2: Add Cattle Form (Repeatable)
- Tag Number input (auto-generated with override)
- Live Weight (kg) input
- Price Per Kg input
- Calculated actual price display
- Gender selection
- Optional cattle class
- Health flags (vaccinated, pregnant, lactating, quarantined)

#### Step 3: Cattle List Table
- Displays all cattle for the current purchase
- Shows Tag#, Weight, Price/kg, Actual Price
- Allows removal before finalization
- Shows cost breakdown after finalization

#### Step 4: Additional Costs
- Pickup costs input
- Hasil (commission) input
- Miscellaneous costs input
- Real-time total calculation
- Shows cost per cattle

#### Step 5: Cost Distribution Summary
- Table showing final breakdown per cattle
- Actual Price + Cost Share = Adjusted Price
- Grand total display

#### Step 6: Finalize Button
- Summary of totals
- One-click finalization
- Locks purchase from further edits

**Files Created:**
- [src/features/cattle/components/batch-purchase-form.tsx](src/features/cattle/components/batch-purchase-form.tsx)

### 5. Query Service Updates ✅

The CattleQueryService automatically includes the new fields through TypeScript's type inference:

- `animalPurchase.$inferSelect` automatically includes all schema fields
- No code changes required - the service is future-proof
- New fields (pricePerKg, actualPrice, adjustedPrice) are automatically fetched

**Files Verified (No Changes Needed):**
- [src/services/CattleQueryService.ts](src/services/CattleQueryService.ts)
- [src/services/CattleDataProcessor.ts](src/services/CattleDataProcessor.ts)
- [src/types/cattle-query.ts](src/types/cattle-query.ts)

### 6. Table Column Updates ✅

Updated display columns to show adjusted prices with cost breakdown tooltips:

#### Price Per KG Column
- Uses `pricePerKg` field (new)
- Falls back to calculated price for backwards compatibility
- Updated column header to "Price Per KG"

#### Total Price Column
- Displays `adjustedPrice` (includes distributed costs)
- Falls back to `purchasePrice` for backwards compatibility
- **Interactive Tooltip** shows breakdown when hovering:
  - Actual Price: [amount]
  - Additional Costs: [amount]
  - Total: [amount]

**Files Modified:**
- [src/features/cattle/components/cattle-tables/columns/price-column.tsx](src/features/cattle/components/cattle-tables/columns/price-column.tsx)
- [src/features/cattle/components/cattle-tables/columns/total-price-column.tsx](src/features/cattle/components/cattle-tables/columns/total-price-column.tsx)

## Business Rules Implemented

1. **Daily Grouping**: All cattle added on same date belong to same purchase
2. **Flexible Entry**: Can add cattle throughout the day before finalization
3. **Cost Distribution**: Equal distribution of additional costs across all cattle
4. **Finalization**: Once finalized, adjusted prices are locked
5. **Tag Numbers**: Auto-increment with manual override capability
6. **Backwards Compatibility**: Existing data continues to work with fallback logic

## Data Flow

### Adding Cattle (Before Finalization)
```
1. Select/Create Daily Purchase
   ↓
2. Add Cattle Entry
   → Creates: animal, cattle, weight_record, animal_purchase
   → Stores: pricePerKg, actualPrice (pricePerKg × weight)
   → adjustedPrice = null (not calculated yet)
   ↓
3. Add More Cattle (repeat step 2)
   ↓
4. Update Additional Costs
   → Updates: pickupCost, hasilCost, miscellaneousCost
   → Calculates: totalAdditionalCosts
   ↓
5. Finalize Purchase
   → Calculates: costPerCattle = totalAdditionalCosts / cattleCount
   → Updates each animal: adjustedPrice = actualPrice + costPerCattle
   → Sets: isFinalized = true
```

### Viewing Cattle Data
```
1. Query fetches all fields (including new price fields)
   ↓
2. Table columns display:
   - Price Per KG: from pricePerKg field
   - Total Price: from adjustedPrice (or purchasePrice fallback)
   ↓
3. Tooltip shows breakdown:
   - Actual Price (original)
   - Additional Costs (distributed share)
   - Total (adjusted)
```

## Migration Steps

### To Apply Changes:

1. **Apply Database Migration** (IMPORTANT - DO THIS FIRST):
   ```bash
   pnpm db:push
   ```
   Or for production:
   ```bash
   pnpm db:migrate
   ```

2. **Verify Schema Changes**:
   ```bash
   pnpm db:studio
   ```
   Check that new columns exist in `purchases` and `animal_purchases` tables

3. **Test the New Flow**:
   - Navigate to the batch purchase form
   - Add multiple cattle for today's date
   - Add additional costs
   - Finalize the purchase
   - Verify adjusted prices in the cattle table

4. **Migrate Existing Data** (Optional):

   Run this SQL script to populate new fields for existing records:

   ```sql
   -- Update animal_purchases with calculated values for existing data
   UPDATE animal_purchases ap
   SET
     actual_price = ap.purchase_price,
     adjusted_price = ap.purchase_price,
     price_per_kg = CASE
       WHEN wr.weight_kg > 0 THEN ap.purchase_price / wr.weight_kg
       ELSE 0
     END
   FROM (
     SELECT animal_id, weight_kg
     FROM weight_records
     WHERE on_purchase = true
   ) wr
   WHERE ap.animal_id = wr.animal_id
     AND ap.actual_price IS NULL;

   -- Mark all existing purchases as finalized
   UPDATE purchases
   SET is_finalized = true
   WHERE is_finalized IS NULL OR is_finalized = false;
   ```

## Testing Checklist

- [ ] Apply database migration successfully
- [ ] Create a new daily purchase
- [ ] Add multiple cattle to the purchase
- [ ] Verify tag numbers auto-generate
- [ ] Override a tag number manually
- [ ] Update additional costs
- [ ] Verify cost per cattle calculation
- [ ] Finalize the purchase
- [ ] Verify adjusted prices are calculated correctly
- [ ] Check that finalized purchases cannot be edited
- [ ] View cattle in table with adjusted prices
- [ ] Hover over total price to see breakdown tooltip
- [ ] Verify existing cattle data still displays correctly

## Files Created

1. `src/features/cattle/schemas/purchase-schemas.ts` - Validation schemas
2. `src/features/cattle/purchase-actions.ts` - Server actions
3. `src/features/cattle/components/batch-purchase-form.tsx` - UI component
4. `src/db/migrations/0003_bent_giant_man.sql` - Database migration

## Files Modified

1. `src/db/schema/tables/purchases.ts` - Schema updates
2. `src/features/cattle/components/cattle-tables/columns/price-column.tsx` - Column display
3. `src/features/cattle/components/cattle-tables/columns/total-price-column.tsx` - Column display with tooltip

## Next Steps

1. **Apply the database migration** - This is critical!
2. **Integrate the batch purchase form** into your routing/navigation
3. **Test thoroughly** with sample data
4. **Migrate existing data** if needed
5. **Update user documentation** to reflect new workflow
6. **Consider adding**:
   - Vendor/Market selection in Step 1
   - Bulk import from CSV
   - Purchase reports showing cost distributions
   - Audit trail for finalized purchases

## Notes

- The old `cattle-form.tsx` is still in place for reference
- All changes maintain backwards compatibility
- The implementation follows Next.js 15 and React 19 best practices
- Type safety is maintained throughout with Zod and TypeScript
- All server actions include proper authentication and authorization checks
- Cache invalidation is handled correctly with `revalidateTag()`

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify database migration was applied
3. Check server logs for action errors
4. Ensure proper permissions are set in Clerk
5. Review the validation schemas for input requirements
