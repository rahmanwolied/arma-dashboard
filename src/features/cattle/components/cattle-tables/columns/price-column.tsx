'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { DollarSign } from 'lucide-react';
import type { Cattle } from '@/prisma/generated/prisma';

export const priceColumn: ColumnDef<Cattle> = {
  id: 'purchasePricePerKg',
  accessorKey: 'purchasePricePerKg',
  header: ({ column }: { column: Column<Cattle, unknown> }) => (
    <DataTableColumnHeader column={column} title='Purchase Price (KG)' />
  ),
  cell: ({ cell }) => {
    const price = cell.getValue<Cattle['purchasePricePerKg']>();
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
