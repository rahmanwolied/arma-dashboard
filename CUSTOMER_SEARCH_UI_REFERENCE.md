# Customer Search Bar - UI Reference

## Visual Layout

### Initial State
```
┌─────────────────────────────────────────────────┐
│ 👤 Customer Name *                              │
├─────────────────────────────────────────────────┤
│ [👤 Search customers...            ▼]           │
└─────────────────────────────────────────────────┘
```

### Existing Customer Selected
```
┌─────────────────────────────────────────────────┐
│ 👤 Customer Name *                              │
├─────────────────────────────────────────────────┤
│ [👤 John Doe                       ▼]           │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────┐ │
│ │ [👤 Existing Customer]                      │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ 📱 Phone Number                                 │
│ [+880 1234-567890]           (disabled/gray)    │
│                                                 │
│ 🗺️ Division                                     │
│ [Dhaka]                      (disabled/gray)    │
│                                                 │
│ 📍 District                                     │
│ [Dhaka]                      (disabled/gray)    │
│                                                 │
│ 📍 Zone/Upazila                                 │
│ [Mirpur]                     (disabled/gray)    │
│                                                 │
│ 🏠 Address                                      │
│ [House 123, Road 5, Block A] (disabled/gray)    │
└─────────────────────────────────────────────────┘
```

### New Customer Being Created
```
┌─────────────────────────────────────────────────┐
│ 👤 Customer Name *                              │
├─────────────────────────────────────────────────┤
│ [👤 Jane Smith                     ▼]           │
└─────────────────────────────────────────────────┘
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│ │ [+ New Customer]                            │ │
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │
│                                                 │
│ 📱 Phone Number *                               │
│ [Enter phone number________________]            │
│                                                 │
│ 🗺️ Division *                                   │
│ [Select division                  ▼]            │
│                                                 │
│ 📍 District *                                   │
│ [Select district                  ▼]            │
│   (disabled until division selected)            │
│                                                 │
│ 📍 Zone/Upazila *                               │
│ [Select zone/upazila              ▼]            │
│   (disabled until district selected)            │
│                                                 │
│ 🏠 Address Line *                               │
│ [House/Road/Area details__________]             │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

### Search Dropdown (Active)
```
┌─────────────────────────────────────────────────┐
│ Type to search customers...                     │
├─────────────────────────────────────────────────┤
│ Existing Customers                              │
│ ┌─────────────────────────────────────────────┐ │
│ │ John Doe                               ✓    │ │
│ │ +880 1234-567890                            │ │
│ ├─────────────────────────────────────────────┤ │
│ │ Jane Smith                                  │ │
│ │ +880 9876-543210                            │ │
│ └─────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│ [+ Create "Jane" as a new customer]             │
└─────────────────────────────────────────────────┘
```

## Color Scheme

### Existing Customer Section
- **Border**: Solid, using border-border color
- **Background**: bg-muted/30 (soft gray)
- **Badge**: Secondary variant (subtle gray)
- **Fields**: bg-background/50 (lighter, read-only appearance)

### New Customer Section
- **Border**: Dashed, using border-primary/50 (primary color at 50% opacity)
- **Background**: bg-primary/5 (very light primary tint)
- **Badge**: Outline variant (primary colored outline)
- **Fields**: Standard input appearance (white/theme background)

## Icons Used

| Icon | Field | Meaning |
|------|-------|---------|
| 👤 (User) | Customer Name | Person/Identity |
| 📱 (Phone) | Phone Number | Contact/Communication |
| 🗺️ (Map) | Division | Large geographic area |
| 📍 (MapPin) | District/Zone | Specific location |
| 🏠 (Home) | Address Line | Physical address/residence |

## Interactive States

### Division Dropdown
1. **Default**: Enabled, shows all divisions
2. **Selected**: Updates value, enables district dropdown
3. **Changed**: Resets district and zone selections

### District Dropdown
1. **Default**: Disabled (gray)
2. **Division Selected**: Enabled, shows filtered districts
3. **Selected**: Updates value, enables zone dropdown
4. **Changed**: Resets zone selection

### Zone Dropdown
1. **Default**: Disabled (gray)
2. **District Selected**: Enabled, shows filtered zones
3. **Selected**: Updates value

## Responsive Behavior

- All fields are full width
- Proper spacing between fields (gap-3)
- Consistent padding inside containers (p-4)
- Labels are small (text-xs) for better space usage

## Accessibility Features

1. **Labels**: All inputs have associated labels with `htmlFor` attributes
2. **Required Indicators**: Asterisks (*) mark required fields
3. **Disabled States**: Clear visual and functional disable states
4. **Icons**: Enhance visual recognition without replacing text
5. **Placeholder Text**: Provides guidance for expected input

## Field Validation

### Required Fields (New Customer)
- Customer Name (validated in parent form)
- Phone Number
- Division
- District
- Zone/Upazila
- Address Line

### Optional Fields
- All location display fields (existing customers)

## Component Hierarchy

```
CustomerSearchField (Main)
├── Label (Customer Name)
├── Popover (Search Dropdown)
│   ├── PopoverTrigger (Button)
│   │   └── User Icon + Display Value + Chevron
│   └── PopoverContent
│       └── Command
│           ├── CommandInput
│           ├── CommandList
│           │   ├── CommandGroup (Existing)
│           │   │   └── CommandItem (×N)
│           │   └── CommandEmpty / Create New
│           └── CommandGroup (Create)
└── Conditional Render
    ├── ExistingCustomerDetails
    │   ├── Badge (Existing Customer)
    │   └── Grid of disabled fields
    └── NewCustomerForm
        ├── Badge (New Customer)
        └── Grid of editable fields
            ├── Phone Input
            ├── Division Select
            ├── District Select (cascading)
            ├── Zone Select (cascading)
            └── Address Line Input
```

## Animation & Transitions

- Smooth expansion when customer details appear
- Dropdown animations via Radix UI primitives
- Focus states with ring animations
- Hover effects on interactive elements

## Best Practices Implemented

1. ✅ **Separation of Concerns**: Split into sub-components
2. ✅ **Memoization**: Filtered lists use useMemo
3. ✅ **Callbacks**: Event handlers use useCallback
4. ✅ **Type Safety**: Proper TypeScript interfaces
5. ✅ **Conditional Rendering**: Only show relevant fields
6. ✅ **Cascading Logic**: Parent selections control child options
7. ✅ **Error Handling**: Graceful fallbacks for missing data
8. ✅ **Loading States**: React Query handles loading/error states
9. ✅ **Caching**: Location data cached for performance
10. ✅ **Accessibility**: Proper ARIA attributes and labels

