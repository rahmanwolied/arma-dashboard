'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import type { Cattle } from '@/prisma/generated/prisma';

export const fatPercentageColumn: ColumnDef<Cattle> = {
  id: 'fatPercentage',
  accessorKey: 'fatPercentage',
  header: ({ column }: { column: Column<Cattle, unknown> }) => (
    <DataTableColumnHeader column={column} title='Fat %' />
  ),
  cell: ({ cell }) => {
    const fatPercentage = cell.getValue<Cattle['fatPercentage']>();
    return <div className='text-lg font-semibold'>{fatPercentage}%</div>;
  },
  enableColumnFilter: true,
  enableSorting: true,
  meta: {
    label: 'Fat %'
  }
};
