# Customer Search Bar Enhancements

## Overview
Enhanced the customer search bar component in the transaction form to display expandable sections with detailed customer information and support for creating new customers with full address details.

## Changes Made

### 1. Enhanced Customer Search Bar Component
**File:** `src/features/transactions/components/transaction-form/customer-search-bar.tsx`

#### Key Features:
- **Expandable Details Section**: Shows different UI based on customer type
- **Icons**: Added meaningful icons for all fields (Phone, Map, MapPin, Home)
- **Best Practices**: Refactored with proper separation of concerns

#### For Existing Customers:
- Displays disabled input fields showing:
  - Phone number
  - Division
  - District
  - Zone/Upazila
  - Address line
- Uses muted background color to indicate read-only state
- Styled with border and soft background for visual distinction

#### For New Customers:
- Displays editable input fields for:
  - Phone number (text input)
  - Division (select menu)
  - District (select menu, filtered by division)
  - Zone/Upazila (select menu, filtered by district)
  - Address line (text input)
- Cascading dropdowns: District options update when division changes, zone options update when district changes
- Styled with dashed border and primary color accent to indicate new entry

### 2. Location Data Management
**File:** `src/features/transactions/components/transaction-form/use-location-data.ts`

Created custom hooks for fetching location data:
- `useDivisions()` - Fetches all divisions
- `useDistricts()` - Fetches all districts
- `useZones()` - Fetches all zones/upazilas
- Configured with 1-hour stale time for caching efficiency

### 3. API Routes for Location Data
Created three new API routes:

**Divisions:**
- `src/app/api/locations/divisions/route.ts`
- Returns all divisions from the database

**Districts:**
- `src/app/api/locations/districts/route.ts`
- Returns all districts from the database

**Zones:**
- `src/app/api/locations/zones/route.ts`
- Returns all zones/upazilas from the database

### 4. Enhanced Customer Query
**File:** `src/features/customers/actions.ts`

Updated `getCustomers()` function to include related location data:
```typescript
addresses: {
  with: {
    division: true,
    district: true,
    zone: true,
  },
}
```

### 5. Updated Sale Schema
**File:** `src/features/transactions/schemas/sale-schema.ts`

Extended customer schema to include:
- `address` object with all location fields
- `isNew` boolean flag to distinguish new customers

### 6. Enhanced Transaction Creation
**File:** `src/features/transactions/actions.ts`

Updated `createSale()` action to:
- Create address record for new customers
- Store division, district, and zone IDs
- Store address line details

### 7. Updated Sale Form
**File:** `src/features/transactions/components/sale-form.tsx`

Updated default values to include new customer address fields.

## Component Structure

### Main Component
```
CustomerSearchField
├── Customer Search Combobox (with label)
└── Customer Details Section
    ├── ExistingCustomerDetails (for existing customers)
    │   └── Disabled input fields with location data
    └── NewCustomerForm (for new customers)
        └── Editable fields with cascading selects
```

### Sub-Components

#### ExistingCustomerDetails
- Shows badge with "Existing Customer" label
- Displays all customer information in disabled inputs
- Only shows fields that have data (conditional rendering)

#### NewCustomerForm
- Shows badge with "New Customer" label
- Provides editable form fields
- Implements cascading dropdown logic for location selection
- Validates required fields

## Type Definitions

```typescript
interface CustomerValue {
  name: string;
  phone: string;
  id?: string;
  address?: {
    addressLine: string;
    divisionId?: string;
    districtId?: string;
    zoneId?: string;
    divisionName?: string;
    districtName?: string;
    zoneName?: string;
  };
  isNew?: boolean;
}
```

## UI/UX Improvements

1. **Visual Distinction**: 
   - Existing customers: Subtle gray background with solid border
   - New customers: Light primary background with dashed border

2. **Progressive Disclosure**: 
   - Details only shown when a customer is selected or being created
   - Cascading selects prevent invalid location combinations

3. **Accessibility**:
   - All form fields have proper labels
   - Icons enhance visual recognition
   - Disabled state clearly indicated

4. **Performance**:
   - Location data cached for 1 hour
   - Memoized filtered lists for districts and zones
   - useCallback for event handlers

## Usage Example

```tsx
<CustomerSearchField
  value={customerValue}
  onChange={(value) => handleCustomerChange(value)}
  placeholder="Search customers..."
  disabled={false}
/>
```

## Future Enhancements

1. Add landmark field support
2. Implement postal code validation
3. Add address type selection (HOME, WORK, OTHER)
4. Support multiple addresses per customer
5. Add address verification/suggestion service
6. Implement Bengali language support for location names

## Testing Notes

- Verify cascading dropdown logic works correctly
- Test with customers that have no address data
- Ensure new customer creation includes address
- Validate that existing customer data displays correctly
- Check that location API endpoints return valid data

