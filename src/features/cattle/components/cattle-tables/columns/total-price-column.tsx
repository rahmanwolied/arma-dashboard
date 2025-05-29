import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Cattle } from '@/prisma/generated/prisma';
import { Column, ColumnDef } from '@tanstack/react-table';
import { DollarSign } from 'lucide-react';

export const totalPriceColumn: ColumnDef<Cattle> = {
  id: 'totalPrice',
  header: ({ column }: { column: Column<Cattle, unknown> }) => (
    <DataTableColumnHeader column={column} title='Total Price' />
  ),
  cell: ({ row }) => {
    return (
      <span className='text-right font-medium'>
        {(
          row.original.purchasePricePerKg * row.original.liveWeight
        ).toLocaleString('en-US', {
          style: 'currency',
          currency: 'BDT',
          currencyDisplay: 'narrowSymbol',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          currencySign: 'accounting'
        })}
      </span>
    );
  },
  meta: {
    label: 'Total Price',
    placeholder: 'Search total price...',
    variant: 'text',
    icon: DollarSign
  }
};
