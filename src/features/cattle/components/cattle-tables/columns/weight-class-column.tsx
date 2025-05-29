'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Cattle } from '@/prisma/generated/prisma';
import { CATTLE_CLASS_OPTIONS } from '../options';

export const weightClassColumn: ColumnDef<Cattle> = {
  id: 'cattleClass',
  accessorKey: 'liveWeight',
  header: ({ column }: { column: Column<Cattle, unknown> }) => (
    <DataTableColumnHeader column={column} title='Live Weight (KG)' />
  ),
  cell: ({ cell }) => {
    const weight = cell.getValue<Cattle['liveWeight']>();
    const cattleClass = cell.row.original.cattleClass;
    const color =
      cattleClass === 'GOLD'
        ? 'bg-amber-500 text-white'
        : cattleClass === 'SILVER'
          ? 'bg-slate-500 text-white'
          : cattleClass === 'PLATINUM'
            ? 'bg-purple-600 text-white'
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
          <TooltipContent>
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
