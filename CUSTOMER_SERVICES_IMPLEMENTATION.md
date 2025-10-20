# Customer Services Implementation Summary

## Overview
Implemented a service-based architecture for customer data fetching, following the same pattern as the cattle services. This includes support for filtering by division and district.

## Changes Made

### 1. Updated Validation Schema (`src/app/_lib/validations.ts`)
Added new filter fields to `customersSearchParamsCache`:
- `division`: Array of division IDs to filter by
- `district`: Array of district IDs to filter by

```typescript
division: parseAsArrayOf(z.string()).withDefault([]),
district: parseAsArrayOf(z.string()).withDefault([]),
```

### 2. Created Customer Services (`src/services/CustomerServices/`)

#### CustomerCacheService.ts
- Provides granular caching for customer queries
- Generates cache keys based on query parameters
- Adjusts TTL based on query complexity
- Similar to `CattleCacheService`

Key methods:
- `getCachedBaseQuery()`: Cache base customer queries
- `generateCacheKey()`: Generate deterministic cache keys
- `getCacheTTL()`: Get cache TTL based on query complexity

#### CustomerFilterService.ts
- Handles all filtering logic for customer queries
- Supports both basic and advanced filters
- Includes division and district filtering

Key methods:
- `buildWhereClause()`: Build main WHERE clause
- `buildAdvancedFilters()`: Build advanced filters using filterColumns utility
- `buildBasicFilters()`: Build basic filters (search, division, district)
- `buildDivisionFilter()`: Filter by division IDs
- `buildDistrictFilter()`: Filter by district IDs
- `validateFilterInput()`: Validate filter input

#### CustomerSortingService.ts
- Handles all sorting logic for customer queries
- All customer fields can be sorted at SQL level (no post-processing needed)

Key methods:
- `needsComputedSort()`: Always returns false for customers
- `getSQLOrderBy()`: Get SQL ORDER BY clauses
- `validateSortConfig()`: Validate sort configuration

Supported sort fields:
- `name`
- `primaryPhone`
- `email`
- `createdAt` (default)
- `updatedAt`

#### CustomerDataProcessor.ts
- Handles data processing and transformation
- Maps raw database data to structured customer objects
- Maintains flat structure for backward compatibility

Key methods:
- `mapRawDataToCustomerWithDetails()`: Transform raw data
- `validateCustomerData()`: Validate data consistency
- `calculateStatistics()`: Calculate statistics by division/district
- `groupBy()`: Group customers by division or district
- `filterByAddressAvailability()`: Filter customers with/without addresses

Data structure (flat for backward compatibility):
```typescript
interface CustomerWithDetails {
    id: string;
    name: string;
    primaryPhone: string;
    secondaryPhone: string | null;
    email: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    addressId: string | null;
    addressLine: string | null;
    landmark: string | null;
    divisionName: string | null;
    districtName: string | null;
    zoneName: string | null;
}
```

#### CustomerQueryService.ts
- Main orchestrator service
- Coordinates all customer query operations
- Uses specialized services for filtering, sorting, caching, and data processing

Key methods:
- `getCustomersData()`: Main method to get customer data with all processing
- `getCustomersByIds()`: Get specific customers by their IDs

### 3. Updated Customer Queries (`src/app/_lib/queries/customers.ts`)
Simplified the query layer to use the new service:

```typescript
const customerQueryService = new CustomerQueryService();

export async function getCustomersData(input: GetCustomersSchema) {
    const result = await customerQueryService.getCustomersData(input);
    return {
        data: result.data,
        pageCount: result.pageCount,
    };
}
```

## How to Use

### Basic Usage
The existing customer table components will work without changes. The service layer handles all the complexity behind the scenes.

### Filtering by Division
```typescript
// In URL or search params
?division=<division-id-1>&division=<division-id-2>
```

### Filtering by District
```typescript
// In URL or search params
?district=<district-id-1>&district=<district-id-2>
```

### Combined Filters
```typescript
// Division + District + Search
?division=<division-id>&district=<district-id>&search=John
```

## UI Integration

The customer table already has columns for division and district with filter support:

```typescript
{
    id: "division",
    accessorKey: "divisionName",
    enableColumnFilter: true,
    meta: {
        label: "Division",
        variant: "multiSelect",
        options: [], // Populated from data
    },
}
```

To populate filter options, you can:
1. Fetch all divisions/districts from the database
2. Use the unique values from the current customer data
3. Add a separate API endpoint to get available filter options

## Architecture Benefits

1. **Separation of Concerns**: Each service has a single responsibility
2. **Testability**: Each service can be tested independently
3. **Maintainability**: Easy to modify filtering/sorting logic without touching other parts
4. **Caching**: Built-in caching with configurable TTL
5. **Type Safety**: Full TypeScript support with interfaces
6. **Consistency**: Follows the same pattern as cattle services
7. **Backward Compatibility**: Data structure remains flat to work with existing components

## Service Dependencies

```
CustomerQueryService (Main Orchestrator)
├── CustomerFilterService (Filtering logic)
├── CustomerSortingService (Sorting logic)
├── CustomerDataProcessor (Data transformation)
└── CustomerCacheService (Caching strategy)
```

## Future Enhancements

1. Add zone (upazila) filtering support
2. Add address type filtering (HOME, OFFICE, etc.)
3. Implement full-text search on address fields
4. Add geographic radius-based filtering
5. Add computed fields for customer statistics
6. Implement data export functionality
7. Add bulk operations support

## Testing

To test the implementation:

1. Navigate to `/dashboard/customers`
2. Use the search bar to filter by customer name
3. Use column filters to filter by division/district (once filter options are populated)
4. Use sorting on various columns
5. Test pagination

## Notes

- All services use Drizzle ORM methods exclusively (no raw SQL except for joins)
- Caching is automatic and based on query parameters
- Soft-deleted customers are automatically excluded
- The service pattern makes it easy to add new filters or sorting options



