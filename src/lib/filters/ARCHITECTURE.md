# Filter System Architecture

## Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Consumer Code                             │
│  (CattleFilterService, queries.ts, etc.)                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ imports filterColumns()
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              src/lib/filter-columns.ts                       │
│         (Backwards Compatibility Layer)                      │
│  - Converts old signature to new                            │
│  - Re-exports from src/lib/filters/                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ delegates to
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              src/lib/filters/index.ts                        │
│              (Main Entry Point)                              │
│                                                              │
│  filterColumns()                                             │
│  ├─ Check special case registry                             │
│  ├─ Apply operator handlers                                 │
│  └─ Combine with AND/OR                                     │
└─────┬───────────────────┬───────────────────┬───────────────┘
      │                   │                   │
      │                   │                   │
      ▼                   ▼                   ▼
┌─────────────┐  ┌─────────────────┐  ┌──────────────────┐
│  Operators  │  │ Special Handlers │  │  Column Map      │
│             │  │                  │  │                  │
│ Registry of │  │ Domain-specific  │  │ Cross-table      │
│ 14 handlers │  │ filter logic     │  │ column lookup    │
│             │  │                  │  │                  │
│ • iLike     │  │ • Health Status  │  │ Maps columns to  │
│ • notILike  │  │ • Cattle Class   │  │ source tables    │
│ • eq / ne   │  │                  │  │                  │
│ • inArray   │  │ (Include/Exclude)│  │ COLUMN_TABLE_MAP │
│ • lt/lte    │  │                  │  │ getColumnFrom... │
│ • gt/gte    │  │                  │  │                  │
│ • isBetween │  │                  │  │                  │
│ • isEmpty   │  │                  │  │                  │
│ • ...       │  │                  │  │                  │
└─────┬───────┘  └─────────┬─────────┘  └────────┬─────────┘
      │                    │                      │
      │ uses               │ uses                 │
      ▼                    ▼                      │
┌─────────────────────────────────────────────────┴─────────┐
│                   Utilities                                 │
│                                                             │
│  utils/date.ts          utils/number.ts      utils/array.ts│
│  • parseDateStart()     • toNumberOrNull()   • normalize() │
│  • parseDateEnd()       • parseNumberRange() • validate()  │
│  • isValidTimestamp()   • isValidNumber()    • enumCheck() │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
Filter Input
    │
    ├─ { id: "tagNumber", value: "A123", operator: "iLike", variant: "text" }
    │
    ▼
filterColumns()
    │
    ├─ Check special case? "tagNumber:iLike"
    │  └─ No → Use standard operator
    │
    ├─ Get column from table
    │  └─ column = getColumnFromTables(table, "tagNumber")
    │
    ├─ Get operator handler
    │  └─ handler = OPERATOR_REGISTRY["iLike"]
    │
    ├─ Execute handler
    │  └─ handler({ column, value: "A123", variant: "text" })
    │     └─ Returns: ilike(column, "%A123%")
    │
    └─ Combine all conditions with AND/OR
       └─ Returns: SQL condition
```

## Special Case Flow

```
Filter Input (Special Case)
    │
    ├─ { id: "healthStatus", value: ["HEALTHY", "LACTATING"], 
    │    operator: "inArray", variant: "multiSelect" }
    │
    ▼
filterColumns()
    │
    ├─ Check special case? "healthStatus:inArray"
    │  └─ Yes! Found in SPECIAL_CASE_REGISTRY
    │
    ├─ Execute special handler
    │  └─ buildHealthStatusFilter(["HEALTHY", "LACTATING"], tables)
    │     │
    │     ├─ Validate values against allowed enum
    │     │  └─ Both valid
    │     │
    │     ├─ Separate into categories
    │     │  ├─ healthStatusValues: ["HEALTHY"]
    │     │  └─ booleanConditions: [eq(cattle.isLactating, true)]
    │     │
    │     ├─ Build SQL conditions
    │     │  ├─ inArray(cattle.healthStatus, ["HEALTHY"])
    │     │  └─ eq(cattle.isLactating, true)
    │     │
    │     └─ Combine with OR
    │        └─ or(inArray(...), eq(...))
    │
    └─ Returns: Combined SQL condition
```

## Operator Handler Pattern

Each operator follows this pattern:

```typescript
export function handleOperatorName(ctx: OperatorContext): SQL | undefined {
  // 1. Validate inputs
  if (ctx.variant !== "expectedVariant") return undefined;
  if (typeof ctx.value !== "expectedType") return undefined;
  
  // 2. Normalize/parse value
  const normalizedValue = normalize(ctx.value);
  if (!isValid(normalizedValue)) return undefined;
  
  // 3. Build SQL condition
  return drizzleOperator(ctx.column, normalizedValue);
}
```

Example:

```typescript
export function handleILike(ctx: OperatorContext): SQL | undefined {
  // Validate
  if (ctx.variant !== "text" || typeof ctx.value !== "string") {
    return undefined;
  }
  
  // Normalize
  if (ctx.value.trim() === "") {
    return undefined;
  }
  
  // Build SQL
  return ilike(ctx.column, `%${ctx.value}%`);
}
```

## Extension Pattern

### Adding a New Operator

```
1. Create handler function
   └─ src/lib/filters/operators/index.ts
      └─ export function handleNewOp(ctx) { ... }

2. Register in OPERATOR_REGISTRY
   └─ OPERATOR_REGISTRY = {
        ...existing,
        newOp: handleNewOp,
      }

3. Add to type definitions
   └─ src/config/data-table.ts
      └─ operators: [...existing, "newOp"]

4. Use in filters
   └─ { id: "field", operator: "newOp", ... }
```

### Adding a Special Case

```
1. Create handler module
   └─ src/lib/filters/special/my-feature.ts
      └─ export function buildMyFeatureFilter() { ... }

2. Register handler
   └─ src/lib/filters/index.ts
      └─ SPECIAL_CASE_REGISTRY = {
           ...existing,
           "myField:operator": (filter, tables) => 
             buildMyFeatureFilter(filter.value, tables),
         }

3. Use in filters
   └─ { id: "myField", operator: "operator", ... }
```

## Dependency Graph

```
index.ts
  ├─ depends on → operators/index.ts
  │                 └─ depends on → utils/*
  │
  ├─ depends on → special/*
  │                 ├─ health-status.ts
  │                 │   └─ depends on → utils/*
  │                 └─ cattle-class.ts
  │                     └─ depends on → utils/*
  │
  └─ depends on → column-map.ts
                    └─ (no dependencies)

utils/*
  ├─ date.ts (depends on date-fns)
  ├─ number.ts (no dependencies)
  └─ array.ts (no dependencies)
```

## Type Flow

```typescript
// Input type
interface ExtendedColumnFilter<TData> {
  id: Extract<keyof TData, string>;
  value: string | string[];
  variant: FilterVariant;
  operator: FilterOperator;
  filterId: string;
}

// Operator context
interface OperatorContext {
  column: AnyColumn;
  value: unknown;
  variant: FilterVariant;
}

// Handler signature
type OperatorHandler = (ctx: OperatorContext) => SQL | undefined;

// Special handler signature
type SpecialCaseHandler = (
  filter: ExtendedColumnFilter<Table>,
  additionalTables?: AdditionalTables,
  cattleClassThresholds?: CattleClassThreshold[],
) => SQL | undefined;

// Output type
type FilterResult = SQL | undefined;
```

## Error Handling Strategy

```
Level 1: Validation (Silent)
  └─ Invalid inputs → return undefined
     Examples:
     - Wrong variant for operator
     - Empty values
     - Type mismatches

Level 2: Column Resolution (Throw)
  └─ Column not found → throw descriptive error
     "Column 'X' not found in primary table or additional table 'Y'"

Level 3: Special Cases (Throw)
  └─ Missing required table → throw descriptive error
     "Health status filtering requires 'cattle' table in additionalTables"

Level 4: Operator Execution (Throw)
  └─ Handler error → throw with context
     "Operator handler failed for 'field' with operator 'op': <error>"
```

## Performance Characteristics

```
┌─────────────────────────────┬──────────┬─────────────┐
│ Operation                   │ Before   │ After       │
├─────────────────────────────┼──────────┼─────────────┤
│ Column lookup               │ O(n)     │ O(1) map    │
│ Operator dispatch           │ O(1)     │ O(1)        │
│ Date parsing per filter     │ 2-4x     │ 1x          │
│ Special case check          │ O(n) if  │ O(1) map    │
│ Error message generation    │ Generic  │ Contextual  │
└─────────────────────────────┴──────────┴─────────────┘
```

## Testing Strategy

```
Unit Tests
  ├─ Operators
  │    ├─ Each operator handler independently
  │    ├─ All variant combinations
  │    └─ Edge cases (null, empty, invalid)
  │
  ├─ Special Handlers
  │    ├─ Health status combinations
  │    ├─ Cattle class include/exclude
  │    └─ Missing table errors
  │
  └─ Utilities
       ├─ Date parsing boundaries
       ├─ Number range parsing
       └─ Array normalization

Integration Tests
  ├─ Multiple filters combined
  ├─ AND/OR operator combinations
  ├─ Cross-table column resolution
  └─ End-to-end query building

Regression Tests
  └─ Original test suite passes unchanged
```

## Compatibility Matrix

```
┌────────────────────┬─────────┬──────────┐
│ Import Style       │ Before  │ After    │
├────────────────────┼─────────┼──────────┤
│ filter-columns.ts  │ ✅      │ ✅       │
│ filters/index.ts   │ ❌      │ ✅       │
│ API Signature      │ ✅      │ ✅       │
│ Behavior           │ ✅      │ ✅       │
└────────────────────┴─────────┴──────────┘
```
