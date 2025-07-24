'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { DollarSign } from 'lucide-react';
import type { FlattenedCattle } from '@/features/cattle/actions';

export const priceColumn: ColumnDef<FlattenedCattle> = {
  id: 'purchasePricePerKg',
  accessorKey: 'purchasePricePerKg',
  header: ({ column }: { column: Column<FlattenedCattle, unknown> }) => (
    <DataTableColumnHeader column={column} title='Purchase Price (KG)' />
  ),
  cell: ({ cell }) => {
    const price = cell.getValue<number>();
    return (
      <div className='font-medium'>
        {price.toLocaleString('en-US', {
          style: 'currency',
          currency: 'BDT',
          currencyDisplay: 'narrowSymbol',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          currencySign: 'accounting',
          notation: 'compact'
        })}
      </div>
    );
  },
  enableSorting: true,
  enableColumnFilter: true,
  meta: {
    label: 'Purchase Price (KG)',
    variant: 'range',
    icon: DollarSign
  }
};
