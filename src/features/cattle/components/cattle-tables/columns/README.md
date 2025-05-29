# Cattle Table Columns

This directory contains the refactored table column definitions for the cattle data table. The columns have been split into separate files for better maintainability and organization.

## Structure

- `index.tsx` - Main export file that combines all columns
- `cattle-number-column.tsx` - Cattle number column with search functionality
- `image-column.tsx` - Image display column
- `weight-class-column.tsx` - Live weight with cattle class badge and tooltip
- `price-column.tsx` - Purchase price per kg column
- `fat-percentage-column.tsx` - Fat percentage column
- `health-status-column.tsx` - Complex health status column with multiple status indicators
- `actions-column.tsx` - Actions column with cell actions

## Usage

Import all columns:
```tsx
import { columns } from './columns';
```

Import specific columns:
```tsx
import { cattleNumberColumn, healthStatusColumn } from './columns';
```

## Benefits

1. **Modularity**: Each column is self-contained with its own imports and logic
2. **Maintainability**: Easier to modify individual columns without affecting others
3. **Reusability**: Individual columns can be imported and used in different contexts
4. **Readability**: Smaller files are easier to understand and debug
5. **Testing**: Each column can be unit tested independently 