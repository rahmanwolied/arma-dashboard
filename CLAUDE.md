# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ARMA Dashboard is a full-stack livestock management application built with Next.js 15 (App Router), TypeScript, Drizzle ORM, and PostgreSQL. It manages cattle operations including sales, purchases, customers, and health tracking with geographic hierarchy support.

## Tech Stack

- **Framework**: Next.js 15.3.2 with App Router and React 19
- **Database**: PostgreSQL (Neon serverless) via Drizzle ORM 0.44.5
- **Authentication**: Clerk 6.12.12 (passwordless, social login, RBAC)
- **UI**: Shadcn-ui (Radix primitives) + Tailwind CSS v4
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand (complex state), Nuqs (URL params), TanStack React Query (server state)
- **Error Tracking**: Sentry (Next.js integration)
- **Package Manager**: pnpm

## Common Commands

### Development
```bash
pnpm dev              # Start dev server with Turbopack
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix linting issues and format
pnpm format           # Format code with Prettier
pnpm tsc:check        # Type-check without emit
```

### Database Operations
```bash
pnpm db:push          # Push schema changes to database (dev)
pnpm db:generate      # Generate migration files from schema
pnpm db:migrate       # Run pending migrations
pnpm db:studio        # Open Drizzle Studio (database GUI)
pnpm db:check         # Check for schema inconsistencies
pnpm db:drop          # Drop migration

# Data seeding
pnpm db:seed-transactions       # Seed transaction data
pnpm db:seed-cattle-from-csv    # Import cattle from CSV
pnpm db:seed-customers          # Seed customer data
pnpm db:export                  # Export data
pnpm db:import-cattle           # Import cattle data
```

### Testing Single Components
```bash
# Run TypeScript check on specific file
pnpm tsc --noEmit path/to/file.ts

# Format specific file
pnpm prettier --write path/to/file.ts
```

## Architecture Overview

### Feature-Based Organization

The codebase follows a feature-based structure where each major domain (cattle, customers, transactions) is self-contained:

```
src/features/[feature]/
  ├── components/      # Feature-specific UI components
  ├── actions.ts       # Server actions (mutations)
  ├── schemas/         # Zod validation schemas
  └── utils/           # Feature utilities
```

### Server Actions Pattern

Server-side mutations use Next.js Server Actions (marked with `"use server"`):

```typescript
// src/features/cattle/actions.ts
export async function createCattle(data: CattleFormData) {
  // 1. Validate with Zod
  // 2. Database transaction
  // 3. Revalidate cache tags
  // 4. Return { data, error }
}
```

Always revalidate relevant tags after mutations:
```typescript
revalidateTag("cattle");
revalidatePath("/dashboard/cattle");
```

### Query Layer Architecture

Queries are organized in three locations depending on complexity:

1. **Simple queries**: `src/app/_lib/queries.ts`
2. **Feature queries**: `src/features/[feature]/actions.ts`
3. **Complex queries**: Service layer in `src/services/`

**Service Layer Pattern** (for complex operations):
```
CattleQueryService (orchestrator)
  ├── CattleFilterService     # WHERE clause building
  ├── CattleSortingService    # ORDER BY logic
  ├── CattleDataProcessor     # Data transformation
  └── CattleCacheService      # Cache management
```

### Database Schema Structure

Key tables and relationships:

- **animals** → **cattle** (1-to-1): Core livestock data
- **sales** → **sale_animal_links** → **animals** (M-to-M): One sale can include multiple animals
- **customers** → **addresses** → **divisions/districts/zones**: Geographic hierarchy
- **weight_records**: Track weight changes with `on_purchase`/`on_sale` flags
- **health_records**, **breeding_records**: Auxiliary tracking

Database files located in:
```
src/db/
  ├── schema/
  │   ├── enums/         # PostgreSQL ENUMs (animalTypeEnum, genderEnum, etc.)
  │   ├── tables/        # Table definitions
  │   └── relations/     # Drizzle relationships
  ├── migrations/        # Generated SQL migrations
  └── index.ts           # Database client initialization
```

### Advanced Filtering System

Located in `src/lib/filters/`, supports complex queries with operators:

- **Basic operators**: eq, like, gte, lte, in, between
- **Special handlers**: For computed fields (cattle_class, health_status)
- **Column mapping**: Display names ↔ database columns
- **AND/OR joins**: Combine multiple filter conditions

When implementing filters:
1. Define column map in `src/lib/filters/column-map.ts`
2. Add operator support in `src/lib/filters/operators/`
3. Special cases go in `src/lib/filters/special/`

### Role-Based Access Control

Defined in `src/permissions.ts`:
- **Roles**: admin, director, manager, accountant, shareholder
- **Resources**: cattle, customer, transaction
- **Permissions**: read, write, update, delete

Middleware (`src/middleware.ts`) protects `/dashboard` routes with Clerk.

### State Management Patterns

1. **URL State** (filters, pagination): Use Nuqs
   ```typescript
   const [search, setSearch] = useQueryState("search", { defaultValue: "" });
   ```

2. **Server State** (data fetching): TanStack React Query
   ```typescript
   const { data } = useQuery({
     queryKey: ["cattle", filters],
     queryFn: () => getCattleData(filters),
     staleTime: 1000 * 60 * 5, // 5 minutes
   });
   ```

3. **Complex Client State**: Zustand
   ```typescript
   // src/features/kanban/utils/store.ts
   const useStore = create((set) => ({ ... }));
   ```

### Form Handling

All forms use React Hook Form + Zod:

```typescript
// 1. Define schema
const cattleSchema = z.object({
  name: z.string().min(1),
  weight: z.number().positive(),
});

// 2. Use in form
const form = useForm<z.infer<typeof cattleSchema>>({
  resolver: zodResolver(cattleSchema),
});

// 3. Submit to server action
const onSubmit = async (data) => {
  const result = await createCattle(data);
  if (result.error) {
    toast.error(result.error);
  }
};
```

Schemas are located in:
- `src/app/_lib/validations.ts` (shared schemas)
- `src/features/[feature]/schemas/` (feature-specific)

### Caching Strategy

Multi-layer caching approach:

1. **Server-side**: `unstable_cache` wrapper in `src/lib/unstable-cache.ts`
2. **Client-side**: React Query with `staleTime`
3. **Invalidation**: `revalidateTag()` on mutations

Example:
```typescript
export const getCachedCattle = unstable_cache(
  async () => db.query.cattle.findMany(),
  ["cattle"],
  { tags: ["cattle"], revalidate: 3600 }
);
```

## Environment Setup

Required environment variables (see `src/env.js` for validation):

**Database**:
- `NEON_DB_URL` - Neon PostgreSQL connection URL
- `NEON_DB_URL_DIRECT` - Direct connection (for migrations)

**Authentication**:
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` (e.g., `/auth/sign-in`)
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (e.g., `/auth/sign-up`)
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` (e.g., `/dashboard`)
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` (e.g., `/dashboard`)

**Monitoring** (optional):
- `SENTRY_AUTH_TOKEN`
- `NEXT_PUBLIC_SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DISABLED` (true/false)

## Key Conventions

### File Organization
- **Server Actions**: `"use server"` at top, in `actions.ts` files
- **Client Components**: `"use client"` when using hooks/browser APIs
- **Shared UI**: `src/components/ui/` (Shadcn components)
- **Feature UI**: `src/features/[feature]/components/`

### Naming Conventions
- **Server Actions**: `createX`, `updateX`, `deleteX`, `getX`
- **Queries**: `getXData`, `fetchX`
- **Schemas**: `xSchema`, `xFormSchema`
- **Types**: `XFormData`, `XSearchParams`, `XFilters`

### Database Migrations
1. Modify schema in `src/db/schema/tables/`
2. Run `pnpm db:generate` to create migration
3. Review generated SQL in `src/db/migrations/`
4. Run `pnpm db:migrate` (production) or `pnpm db:push` (dev)

### Error Handling
Use the centralized error handler:
```typescript
import { handleError } from "@/lib/handle-error";

try {
  // operation
} catch (error) {
  return { error: handleError(error) };
}
```

## Data Table Pattern

Tables use TanStack React Table with server-side operations:

```typescript
// 1. Define columns in features/[feature]/components/[feature]-tables/columns/
export const cattleColumns: ColumnDef<Cattle>[] = [ ... ];

// 2. Use data table hook
const { table } = useDataTable({
  data,
  columns: cattleColumns,
  pageCount,
  filterFields: [...],
});

// 3. Render with DataTable component
<DataTable table={table} />
```

Table state synced with URL via Nuqs for shareable links.

## Unique Architectural Decisions

### Multi-Animal Sales
- Sales can include multiple animals via `sale_animal_links` junction table
- Supports complex pricing: per-animal pricing, bulk discounts, weight-based calculations

### Geographic Hierarchy
- Three-level normalization: **Divisions** → **Districts** → **Zones**
- Addresses reference hierarchy + store unstructured details in JSONB
- API endpoints at `/api/locations/[divisions|districts|zones]`

### Weight Tracking
- Separate `weight_records` table with temporal tracking
- Flags: `on_purchase`, `on_sale` mark significant weight entries
- Calculate sale price from latest weight × price per kg

### Cattle Classification
- Dynamic thresholds in `cattle_class_thresholds` table
- Classes: GOLD, SILVER, PLATINUM based on weight/age ranges
- Configurable without code changes

## Common Patterns

### Creating a New Feature
1. Create feature directory: `src/features/new-feature/`
2. Add schema: `schemas/new-feature-schema.ts`
3. Create server actions: `actions.ts`
4. Build UI components: `components/`
5. Add to navigation in `src/components/layout/`
6. Update permissions if needed in `src/permissions.ts`

### Adding a New Table
1. Define in `src/db/schema/tables/new-table.ts`
2. Add relations in `src/db/schema/relations/`
3. Export from `src/db/schema/index.ts`
4. Generate migration: `pnpm db:generate`
5. Apply: `pnpm db:push` or `pnpm db:migrate`

### Implementing Search/Filter
1. Define search params type
2. Use Nuqs for URL state: `useQueryStates(searchParamsParser)`
3. Create filter builder in service or query function
4. Apply filters in Drizzle query with `.where()`
5. Connect to table component with `filterFields` prop

## Debugging

### Database Issues
- Check connection: `pnpm db:studio` to open GUI
- View schema: `src/db/schema/`
- Check migrations: `src/db/migrations/`
- Reset: Drop tables manually in studio, then `pnpm db:push`

### Authentication Issues
- Verify Clerk keys in `.env.local`
- Check middleware config in `src/middleware.ts`
- Test with Clerk dashboard: https://dashboard.clerk.com

### Type Errors
- Run `pnpm tsc:check` for full type checking
- Regenerate Drizzle types after schema changes: `pnpm db:generate`
- Check for stale imports or circular dependencies

### Performance Issues
- Enable Drizzle query logging: Set `verbose: true` in `drizzle.config.ts`
- Check React Query DevTools for stale queries
- Profile with Next.js: Add `?debug=true` to URL
- Review Sentry performance monitoring if enabled
