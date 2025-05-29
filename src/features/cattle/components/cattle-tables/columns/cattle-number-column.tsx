'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import type { Cattle } from '@/prisma/generated/prisma';

export const cattleNumberColumn: ColumnDef<Cattle> = {
  id: 'cattleNumber',
  accessorKey: 'cattleNumber',
  header: ({ column }: { column: Column<Cattle, unknown> }) => (
    <DataTableColumnHeader column={column} title='Cattle Number' />
  ),
  cell: ({ cell }) => <div>#{cell.getValue<Cattle['cattleNumber']>()}</div>,
  meta: {
    label: 'Cattle Number',
    placeholder: 'Search cattle number...',
    variant: 'text',
    icon: Text
  },
  enableColumnFilter: true
};
