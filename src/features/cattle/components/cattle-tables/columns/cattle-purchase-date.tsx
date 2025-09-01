'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { Column, ColumnDef } from '@tanstack/react-table';
import type { FlattenedCattle } from '@/features/cattle/actions';
import { Calendar } from 'lucide-react';

export const cattlePurchaseDateColumn: ColumnDef<FlattenedCattle> = {
  id: 'purchaseDate',
  accessorKey: 'purchaseDate',
  header: ({ column }: { column: Column<FlattenedCattle, unknown> }) => (
    <DataTableColumnHeader column={column} title='Cattle Purchase Date' />
  ),
  cell: ({ cell }) => {
    const cattlePurchaseDate = cell.getValue<
      FlattenedCattle['purchaseDate']
    >() as Date;
    return (
      <div className='font-medium'>{cattlePurchaseDate.toDateString()}</div>
    );
  },
  enableColumnFilter: true,
  enableSorting: true,
  meta: {
    label: 'Purchase Date',
    variant: 'dateRange',
    icon: Calendar
  }
};
