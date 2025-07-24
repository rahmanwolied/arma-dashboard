'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { Column, ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { CATTLE_CLASS_OPTIONS } from '../options';
import type { FlattenedCattle } from '@/features/cattle/actions';

const SILVER_WEIGHT_MAX = 400;
const GOLD_WEIGHT_MAX = 500;

const SILVER_COLOR =
  'dark:bg-slate-500 dark:text-slate-100 bg-slate-200 text-slate-500 dark:fill-slate-500 fill-slate-200';
const GOLD_COLOR =
  'dark:bg-amber-600 dark:text-amber-100 bg-yellow-100 text-amber-600 dark:fill-amber-600 fill-yellow-100';
const PLATINUM_COLOR =
  'dark:bg-purple-600 dark:text-purple-100 bg-purple-200 text-purple-500 dark:fill-purple-500 fill-purple-200';

function getWeightClass(pricePerKg: number) {
  if (pricePerKg <= SILVER_WEIGHT_MAX) return 'SILVER';
  if (pricePerKg <= GOLD_WEIGHT_MAX) return 'GOLD';
  return 'PLATINUM';
}

export const weightClassColumn: ColumnDef<FlattenedCattle> = {
  id: 'cattleClass',
  accessorKey: 'liveWeight',
  header: ({ column }: { column: Column<FlattenedCattle, unknown> }) => (
    <DataTableColumnHeader column={column} title='Live Weight (KG)' />
  ),
  cell: ({ cell }) => {
    const weight = cell.getValue<FlattenedCattle['liveWeight']>();
    const cattleClass = getWeightClass(cell.row.original.purchasePricePerKg);
    const color =
      cattleClass === 'GOLD'
        ? GOLD_COLOR
        : cattleClass === 'SILVER'
          ? SILVER_COLOR
          : cattleClass === 'PLATINUM'
            ? PLATINUM_COLOR
            : undefined;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge className={cn('flex items-center gap-2', color)}>
              <span className='text-[0.75rem] font-semibold'>{weight}</span>
              <span className='text-[0.75rem] font-semibold'>KG</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent className={color} arrowClassName={color}>
            <p>{cattleClass}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
  enableColumnFilter: true,
  enableSorting: true,
  sortingFn: (rowA, rowB) => {
    return rowA.original.liveWeight - rowB.original.liveWeight;
  },
  meta: {
    label: 'Cattle Class',
    variant: 'multiSelect',
    options: CATTLE_CLASS_OPTIONS
  }
};
