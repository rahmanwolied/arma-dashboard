'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { Column, ColumnDef } from '@tanstack/react-table';
import type { FlattenedCattle } from '@/features/cattle/actions';

export const fatPercentageColumn: ColumnDef<FlattenedCattle> = {
  id: 'fatPercentage',
  accessorKey: 'fatPercentage',
  header: ({ column }: { column: Column<FlattenedCattle, unknown> }) => (
    <DataTableColumnHeader column={column} title='Fat %' />
  ),
  cell: ({ cell }) => {
    const fatPercentage = cell.getValue<FlattenedCattle['fatPercentage']>();
    return <div className='text-lg font-semibold'>{fatPercentage}%</div>;
  },
  enableColumnFilter: true,
  enableSorting: true,
  meta: {
    label: 'Fat %'
  }
};
