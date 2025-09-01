import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { FlattenedCattle } from '@/features/cattle/actions';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { DollarSign } from 'lucide-react';

export const totalPriceColumn: ColumnDef<FlattenedCattle> = {
  id: 'totalPrice',
  header: ({ column }: { column: Column<FlattenedCattle, unknown> }) => (
    <DataTableColumnHeader column={column} title='Total Price' />
  ),
  cell: ({ row }) => {
    return (
      <div className='mr-7 text-right font-medium'>
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
      </div>
    );
  },
  meta: {
    label: 'Total Price',
    placeholder: 'Search total price...',
    variant: 'text',
    icon: DollarSign
  }
};
