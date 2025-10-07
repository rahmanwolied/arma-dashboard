# Sales and Discount Guide

## Overview

The ARMA Dashboard supports three types of discounts when creating sales:

1. **FLAT** - Fixed amount discount in BDT
2. **PERCENT** - Percentage-based discount on total amount
3. **WEIGHT_BASED** - Discount based on weight reduction

## Discount Calculation Logic

### 1. FLAT Discount

A direct currency discount applied to the total sale amount.

**Formula:**
```
discountAmount = inputValue (in BDT)
finalAmount = totalAmount - discountAmount
```

**Example:**
- Total Weight: 250 kg
- Price per kg: 500 BDT
- Total Amount: 125,000 BDT
- Discount Input: 5,000 BDT
- **Discount Amount: 5,000 BDT**
- **Final Amount: 120,000 BDT**

### 2. PERCENT Discount

A percentage-based discount calculated on the total sale amount.

**Formula:**
```
discountAmount = round((totalAmount × inputPercent) / 100)
finalAmount = totalAmount - discountAmount
```

**Example:**
- Total Weight: 250 kg
- Price per kg: 500 BDT
- Total Amount: 125,000 BDT
- Discount Input: 10 (%)
- **Discount Amount: 12,500 BDT**
- **Final Amount: 112,500 BDT**

### 3. WEIGHT_BASED Discount

A weight reduction applied before calculating the final price. The user provides a weight reduction value (in kg), and the system calculates the discount by multiplying this reduction by the price per kg.

**Formula:**
```
discountAmount = pricePerKg × weightReduction
discountedWeight = actualWeight - weightReduction
finalAmount = discountedWeight × pricePerKg
  OR
finalAmount = totalAmount - discountAmount
```

**Example:**
- Total Weight: 250 kg
- Price per kg: 500 BDT
- Total Amount: 125,000 BDT
- Discount Input: 10 kg (weight reduction)
- **Discount Amount: 10 × 500 = 5,000 BDT**
- **Discounted Weight: 240 kg**
- **Final Amount: 120,000 BDT**

## Implementation Details

### Database Schema

The `sales` table stores:
- `totalAmount`: Original total (weight × price_per_kg)
- `discountAmount`: Calculated discount in BDT
- `discountType`: One of `FLAT`, `PERCENT`, `WEIGHT_BASED`
- `amountPaid`: Initial payment amount
- `amountDue`: Remaining balance (finalAmount - amountPaid)

### Creating a Sale

When creating a sale through the UI:

1. Select customer (existing or new)
2. Select animals (one or multiple)
3. Enter price per kg
4. Select discount type (optional)
5. Enter discount value based on type:
   - FLAT: Enter discount amount in BDT
   - PERCENT: Enter percentage (e.g., 10 for 10%)
   - WEIGHT_BASED: Enter weight reduction in kg
6. The UI displays the calculated discount amount in BDT for all types
7. Enter payment method and amount paid
8. Submit

### Visual Indicators

Discounted sales are highlighted in the sales table:
- Badge with discount percentage icon on invoice number
- Tooltip shows discount amount and type
- Discount type shown as colored badge
- Total amount shown in green for discounted sales
- Discount column shows amount with tag icon

### Color Coding

- **FLAT**: Blue badge
- **PERCENT**: Purple badge  
- **WEIGHT_BASED**: Green badge

## Code References

### Discount Calculation
See: `src/features/transactions/actions/create-sale.ts` - `calculateDiscount()` function

### Sale Creation
See: `src/features/transactions/actions/create-sale.ts` - `createSale()` function

### Table Display
See: `src/features/transactions/components/sales-table-columns.tsx`

## Testing

To test different discount scenarios:

```bash
# Example test data
Scenario 1 - FLAT:
- Animals: 1 animal, 250kg
- Price: 500 BDT/kg
- Discount: FLAT, 5000 BDT
- Expected: Discount = 5000 BDT, Final = 120,000 BDT

Scenario 2 - PERCENT:
- Animals: 1 animal, 250kg
- Price: 500 BDT/kg
- Discount: PERCENT, 10%
- Expected: Discount = 12,500 BDT, Final = 112,500 BDT

Scenario 3 - WEIGHT_BASED:
- Animals: 1 animal, 250kg
- Price: 500 BDT/kg
- Discount: WEIGHT_BASED, 10kg
- Expected: Discount = 5,000 BDT, Discounted Weight = 240kg, Final = 120,000 BDT
```

## Notes

- All discount amounts are rounded to nearest integer
- Weight-based discounts store the reduction value, not the discounted weight
- The UI always shows discount amount in BDT regardless of type
- Sales with no discount have `discountAmount` and `discountType` set to `null`
