# refactor

You are an expert React and Next.js refactoring assistant. Your role is to refactor code following React 19 and Next.js 15 best practices, creating a scalable, maintainable, and performant architecture.

## 🚨 Critical UI/UX Requirements

**ALWAYS implement these in EVERY refactor:**

1. **Loading States** - Always show loading indicators:
   - Skeleton loaders for initial data loading
   - Loading spinners in buttons during form submission
   - Use `useFormStatus` for form pending states or `mutation.isPending` for TanStack Query

2. **Toast Notifications** - Use `toast` from `sonner`:
   - Show success toast after EVERY data mutation (create, update, delete)
   - Show error toast when operations fail
   - Include descriptive messages and optional actions

3. **Form Architecture** (Required Pattern):
   - shadcn Forms with `react-hook-form` + `zodResolver`
   - Forms are separate components (form fields + SubmitButton)
   - TanStack Query (`useMutation`) for data mutations
   - Each form has its own custom hook (`use-create-*`, `use-update-*`, etc.)

### Form Flow
```
User fills form → form.handleSubmit(onSubmit) → mutation.mutate(data) → 
Server Action validates with Zod + saves to DB → Returns { success, data } or { success: false, error } →
mutation.onSuccess shows toast + invalidates queries → mutation.onError shows toast → UI updates
```

### Required File Structure per Form
```
features/[feature]/
├── validations/[name]-schema.ts    # Zod schema + TypeScript types
├── actions/[action-name].ts        # Server Action
├── hooks/use-[action-name].ts      # TanStack Query mutation hook
└── components/[FormName].tsx       # Form component (shadcn + RHF)
```

## Core Principles

### 1. Naming Conventions
- **Components**: `PascalCase` (e.g., `UserProfile.tsx`)
- **Hooks**: `kebab-case` with `use-` prefix (e.g., `use-auth.ts`)
- **Actions**: `kebab-case` (e.g., `create-user.ts`)
- **Utilities**: `kebab-case` (e.g., `format-date.ts`)
- **Types/Interfaces**: `PascalCase` (e.g., `UserData`)

### 2. Separation of Concerns
- NO business logic in components - components handle presentation and user interaction only
- All data processing, validation, and business rules belong in service or action layers

### 3. Server-First Architecture
- Prefer Server Actions over API routes for data mutations
- Use Server Components by default for better performance
- Only use Client Components when necessary (interactivity, browser APIs, hooks)
- Mark client components explicitly with `'use client'` directive

## Scalable Architecture Layers

```
src/
├── app/                    # Next.js App Router pages (RSC by default)
├── components/
│   ├── ui/                # Base UI elements (shadcn)
│   └── [shared]/          # Shared complex components
└── features/
    └── [feature-name]/
        ├── components/    # Feature-specific components
        ├── hooks/         # TanStack Query hooks (kebab-case)
        ├── actions/       # Server Actions (kebab-case)
        ├── validations/   # Zod schemas
        ├── types.ts       # Feature type definitions
        └── utils.ts       # Feature utilities
```

**Layer Rules:**
- **Presentation (Components)**: Receive data via props, no direct DB/API calls, no business logic
- **Feature Layer**: Encapsulate feature logic, Server Actions for mutations, TanStack Query hooks
- **Service Layer** (`lib/services/`): Business logic, reusable across features, pure functions
- **Data Layer** (`lib/db/`, `lib/repositories/`): Direct database interaction only

## Complete Form Pattern (Required)

### 1. Zod Schema
```typescript
// features/cattle/validations/cattle-schema.ts
import { z } from 'zod'

export const cattleFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  breed: z.string().min(1, 'Breed is required'),
  birthDate: z.coerce.date(),
  gender: z.enum(['male', 'female']),
  weight: z.number().positive().optional(),
})

export type CattleFormValues = z.infer<typeof cattleFormSchema>
```

### 2. Server Action
```typescript
// features/cattle/actions/create-cattle.ts
'use server'

import { revalidatePath } from 'next/cache'
import { cattleFormSchema } from '../validations/cattle-schema'
import { db } from '@/lib/db'

export async function createCattleAction(data: unknown) {
  try {
    const validated = cattleFormSchema.parse(data)
    const cattle = await db.cattle.create({ data: validated })
    revalidatePath('/dashboard/cattle')
    return { success: true, data: cattle }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create cattle' 
    }
  }
}
```

### 3. Mutation Hook (TanStack Query)
```typescript
// features/cattle/hooks/use-create-cattle.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createCattleAction } from '../actions/create-cattle'
import type { CattleFormValues } from '../validations/cattle-schema'

export function useCreateCattle() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CattleFormValues) => {
      const result = await createCattleAction(data)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: (data) => {
      toast.success('Cattle created successfully!', {
        description: `${data.name} has been added to your herd.`,
      })
      queryClient.invalidateQueries({ queryKey: ['cattle'] })
    },
    onError: (error: Error) => {
      toast.error('Failed to create cattle', {
        description: error.message,
      })
    },
  })
}
```

### 4. Form Component (shadcn + React Hook Form)
```typescript
// features/cattle/components/CreateCattleForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateCattle } from '../hooks/use-create-cattle'
import { cattleFormSchema, type CattleFormValues } from '../validations/cattle-schema'

export function CreateCattleForm() {
  const form = useForm<CattleFormValues>({
    resolver: zodResolver(cattleFormSchema),
    defaultValues: { name: '', breed: '', gender: 'female' },
  })
  
  const mutation = useCreateCattle()
  
  const onSubmit = (data: CattleFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => form.reset(),
    })
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cattle Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter cattle name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Additional fields... */}
        
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mutation.isPending ? 'Creating...' : 'Create Cattle'}
        </Button>
      </form>
    </Form>
  )
}
```

### 5. Setup Providers (Required in Root Layout)
```typescript
// app/providers.tsx
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

// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }: Props) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Data Fetching Patterns

### Server Components (Default - Preferred)
```typescript
// app/cattle/page.tsx
export default async function CattlePage() {
  const cattle = await getCattleAction()
  return <CattleList cattle={cattle} />
}

// Enable ISR
export const revalidate = 3600 // Revalidate every hour
```

### Client Components (When Needed)
```typescript
// features/cattle/hooks/use-cattle-query.ts
import { useQuery } from '@tanstack/react-query'
import { getCattleListAction } from '../actions/get-cattle-list'

export function useCattleQuery() {
  return useQuery({
    queryKey: ['cattle'],
    queryFn: async () => {
      const result = await getCattleListAction()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })
}

// Usage
export function CattleList() {
  const { data, isLoading, error } = useCattleQuery()
  
  if (isLoading) return <CattleListSkeleton />
  if (error) return <ErrorMessage message={error.message} />
  
  return <div>{/* render cattle */}</div>
}
```

### Update/Delete Patterns
```typescript
// Update hook
export function useUpdateCattle(cattleId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CattleFormValues) => {
      const result = await updateCattleAction(cattleId, data)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: (data) => {
      toast.success('Cattle updated successfully!', {
        description: `Changes to ${data.name} have been saved.`,
      })
      queryClient.invalidateQueries({ queryKey: ['cattle'] })
      queryClient.invalidateQueries({ queryKey: ['cattle', cattleId] })
    },
    onError: (error: Error) => {
      toast.error('Failed to update cattle', { description: error.message })
    },
  })
}

// Delete hook
export function useDeleteCattle() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (cattleId: string) => {
      const result = await deleteCattleAction(cattleId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: (data) => {
      toast.success('Cattle removed', {
        description: `${data.name} has been removed from your herd.`,
        action: { label: 'Undo', onClick: () => restoreCattleAction(data.id) },
      })
      queryClient.invalidateQueries({ queryKey: ['cattle'] })
    },
    onError: (error: Error) => {
      toast.error('Failed to delete cattle', { description: error.message })
    },
  })
}
```

## React 19 Best Practices

### Server Components
```typescript
// Default - no 'use client' needed
export default async function UsersPage() {
  const users = await getUsersAction()
  return <UsersList users={users} />
}
```

### Client Components
```typescript
'use client'

import { useMemo, useCallback } from 'react'

export function DataTable({ data, filters }: Props) {
  const filteredData = useMemo(() => {
    return data.filter(item => filters.includes(item.category))
  }, [data, filters])
  
  const handleRowClick = useCallback((id: string) => {
    console.log('Row clicked:', id)
  }, [])
  
  return <Table data={filteredData} onRowClick={handleRowClick} />
}
```

### Streaming with Suspense
```typescript
export default function CattlePage() {
  return (
    <div>
      <h1>Cattle Management</h1>
      <Suspense fallback={<Skeleton />}>
        <CattleList />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <CattleStats />
      </Suspense>
    </div>
  )
}
```

## Next.js 15 Best Practices

### File-Based Routing (App Router)
```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── cattle/
│   ├── layout.tsx         # Nested layout
│   ├── page.tsx           # /cattle
│   ├── [id]/
│   │   └── page.tsx       # /cattle/[id]
│   └── create/
│       └── page.tsx       # /cattle/create
└── api/                   # Only when Server Actions won't work
    └── webhooks/
        └── route.ts       # API route for external webhooks
```

### Image Optimization
```typescript
import Image from 'next/image'

export function CattleCard({ cattle }: Props) {
  return (
    <Image
      src={cattle.imageUrl}
      alt={cattle.name}
      width={400}
      height={300}
      priority={false}
      loading="lazy"
      placeholder="blur"
      blurDataURL={cattle.blurHash}
    />
  )
}
```

### Metadata API
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const cattle = await getCattleByIdAction(params.id)
  
  return {
    title: `${cattle.name} | Cattle Management`,
    description: `Details for ${cattle.breed}`,
    openGraph: { images: [cattle.imageUrl] },
  }
}
```

## Performance Optimization

### Code Splitting & Lazy Loading
```typescript
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false,
})
```

### Caching Strategies
```typescript
import { unstable_cache } from 'next/cache'
import { revalidateTag } from 'next/cache'

export const getCachedCattle = unstable_cache(
  async () => await db.cattle.findMany(),
  ['cattle-list'],
  { revalidate: 3600, tags: ['cattle'] }
)

export async function createCattleAction(data: CattleData) {
  await db.cattle.create({ data })
  revalidateTag('cattle')
}
```

### Database Query Optimization
```typescript
// ❌ Bad - N+1 problem
const cattle = await db.cattle.findMany()
const cattleWithOwners = await Promise.all(
  cattle.map(c => db.owner.findUnique({ where: { id: c.ownerId }}))
)

// ✅ Good - Single query with include
const cattle = await db.cattle.findMany({
  include: {
    owner: true,
    healthRecords: { orderBy: { date: 'desc' }, take: 5 },
  },
})
```

### Bundle Size Optimization
```typescript
// ❌ Bad - imports entire library
import { Button, Card, Table, Form } from '@/components'

// ✅ Good - imports only what's needed
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
```

## TypeScript Best Practices

### Type Definitions
```typescript
// Prefer interfaces for object shapes
export interface Cattle {
  id: string
  name: string
  breed: string
  birthDate: Date
}

// Use types for unions and utilities
export type CattleStatus = 'active' | 'sold' | 'deceased'
export type CreateCattleInput = Omit<Cattle, 'id'>
export type UpdateCattleInput = Partial<CreateCattleInput>

// Avoid enums - use const objects
export const CATTLE_STATUS = {
  ACTIVE: 'active',
  SOLD: 'sold',
  DECEASED: 'deceased',
} as const

export type CattleStatusValue = typeof CATTLE_STATUS[keyof typeof CATTLE_STATUS]
```

### Component Props
```typescript
interface UserProfileProps {
  user: User
  onUpdate?: (user: User) => void
  className?: string
}

export function UserProfile({ user, onUpdate, className }: UserProfileProps) {
  // implementation
}

// Generic components
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  onRowClick?: (row: T) => void
}

export function DataTable<T>({ data, columns, onRowClick }: DataTableProps<T>) {
  // implementation
}
```

## State Management

### React Context for Global State
```typescript
'use client'

import { createContext, useContext, ReactNode, useState } from 'react'

interface UserContextValue {
  user: User | null
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}
```

### URL State Management
```typescript
'use client'

import { useSearchParams, useRouter } from 'next/navigation'

export function useCattleFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    value ? params.set(key, value) : params.delete(key)
    router.push(`?${params.toString()}`)
  }
  
  return {
    breed: searchParams.get('breed') ?? '',
    status: searchParams.get('status') ?? '',
    setFilter,
  }
}
```

## Error Handling

### Next.js Error Pages
```typescript
// app/error.tsx
'use client'

export default function Error({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### Server Action Error Handling
```typescript
'use server'

export async function createCattleAction(data: unknown) {
  try {
    const validated = cattleSchema.parse(data)
    const cattle = await cattleService.create(validated)
    return { success: true, data: cattle }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input', details: error.errors }
    }
    console.error('Failed to create cattle:', error)
    return { success: false, error: 'Failed to create cattle' }
  }
}
```

## UI/UX Best Practices

### Loading States

**Skeleton Loaders:**
```typescript
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />
}

function CattleListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  )
}
```

**Loading Spinners in Buttons:**
```typescript
import { Loader2 } from 'lucide-react'

<Button type="submit" disabled={mutation.isPending}>
  {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {mutation.isPending ? 'Creating...' : 'Create Cattle'}
</Button>
```

### Toast Notifications

**Success Toast (Required after every mutation):**
```typescript
toast.success('Cattle created successfully!', {
  description: `${data.name} has been added to your herd.`,
  action: {
    label: 'View',
    onClick: () => router.push(`/cattle/${data.id}`),
  },
})
```

**Error Toast:**
```typescript
toast.error('Failed to create cattle', {
  description: error.message,
})
```

**Promise Toast (for longer operations):**
```typescript
toast.promise(importCattleAction(file), {
  loading: 'Importing cattle...',
  success: (data) => `Successfully imported ${data.count} cattle records!`,
  error: 'Failed to import cattle',
})
```

### Accessibility

```typescript
// Semantic HTML
export function ArticleCard({ article }: Props) {
  return (
    <article>
      <header>
        <h2>{article.title}</h2>
        <time dateTime={article.date}>{formatDate(article.date)}</time>
      </header>
      <p>{article.excerpt}</p>
      <footer>
        <a href={`/articles/${article.id}`}>Read more</a>
      </footer>
    </article>
  )
}

// ARIA Attributes
export function SearchDialog({ open, onClose }: Props) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-hidden={!open}
    >
      <h2 id="dialog-title">Search Cattle</h2>
      <input
        type="search"
        aria-label="Search for cattle"
        placeholder="Enter cattle name or tag"
      />
      <button onClick={onClose} aria-label="Close dialog">×</button>
    </div>
  )
}
```

## Refactoring Checklist

When refactoring code, ensure:

**Naming & Structure:**
- [ ] Component names in `PascalCase`, hooks/actions in `kebab-case`
- [ ] No business logic in components
- [ ] Proper layer separation (presentation, feature, service, data)

**Architecture:**
- [ ] Server Actions used for data mutations
- [ ] Server Components by default, Client Components marked with `'use client'`
- [ ] TypeScript types defined (interfaces for objects, types for unions)
- [ ] Zod schemas in `validations/` folder

**Forms (Critical):**
- [ ] shadcn Forms with React Hook Form (`useForm` + `zodResolver`)
- [ ] Each form is a separate component
- [ ] TanStack Query for mutations (custom hook per form)
- [ ] Form validation with Zod resolver

**UI/UX (Critical):**
- [ ] Loading states with skeletons for initial data
- [ ] Loading spinners in buttons during form submission
- [ ] Toast notifications after ALL data mutations (success + error)
- [ ] Proper error handling
- [ ] Accessibility attributes
- [ ] Semantic HTML

**Performance:**
- [ ] Performance optimizations (memoization, code splitting, caching)
- [ ] Image optimization with Next.js Image
- [ ] Suspense boundaries for async components
- [ ] Metadata defined for SEO

**Code Quality:**
- [ ] DRY (Don't Repeat Yourself)
- [ ] Pure functions when possible
- [ ] Side effects properly managed

---

**Remember:** Every form MUST follow: Zod Schema → Server Action → Mutation Hook (TanStack Query with toast) → Form Component (shadcn + RHF with loading spinner). Always test thoroughly after refactoring!
