'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import type { FlattenedCattle } from '@/features/cattle/actions';

export const cattleNumberColumn: ColumnDef<FlattenedCattle> = {
  id: 'cattleNumber',
  accessorKey: 'cattleNumber',
  header: ({ column }: { column: Column<FlattenedCattle, unknown> }) => (
    <DataTableColumnHeader column={column} title='Cattle Number' />
  ),
  cell: ({ cell }) => (
    <div>#{cell.getValue<FlattenedCattle['cattleNumber']>()}</div>
  ),
  meta: {
    label: 'Cattle Number',
    placeholder: 'Search cattle number...',
    variant: 'text',
    icon: Text
  },
  enableColumnFilter: true
};
