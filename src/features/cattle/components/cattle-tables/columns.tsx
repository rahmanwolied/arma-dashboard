'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import {
  CheckCircle2,
  DollarSign,
  ImageIcon,
  Info,
  Percent,
  Text,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { CATTLE_CLASS_OPTIONS, HEALTH_STATUS_OPTIONS } from './options';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Cattle } from '@/prisma/generated/prisma';
import { Icons } from '@/components/icons';

export const columns: ColumnDef<Cattle>[] = [
  {
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
  },
  {
    accessorKey: 'imageUrl',
    header: 'IMAGE',
    cell: ({ row }) => {
      return (
        <Image
          src={row.getValue('imageUrl') || '/assets/cow.png'}
          alt={row.original.cattleNumber.toString()}
          width={75}
          height={75}
          className='aspect-square rounded-lg object-cover'
        />
      );
    },
    enableColumnFilter: true,
    enableHiding: true,
    meta: {
      label: 'Image'
    }
  },
  {
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
  },
  {
    id: 'purchasePricePerKg',
    accessorKey: 'purchasePricePerKg',
    header: ({ column }: { column: Column<Cattle, unknown> }) => (
      <DataTableColumnHeader column={column} title='Purchase Price (KG)' />
    ),
    cell: ({ cell }) => {
      const price = cell.getValue<Cattle['purchasePricePerKg']>();
      return <div className='text-lg font-semibold'>{price}</div>;
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Purchase Price (KG)',
      variant: 'range',
      icon: DollarSign
    }
  },
  {
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
  },
  {
    id: 'healthStatus',
    accessorKey: 'healthStatus',
    header: ({ column }: { column: Column<Cattle, unknown> }) => (
      <DataTableColumnHeader column={column} title='Health Status' />
    ),
    enableHiding: true,
    enableSorting: false,
    cell: ({ cell }) => {
      const {
        isInseminated,
        isLactating,
        isPregnant,
        isQuarantined,
        isSold,
        isVaccinated,
        healthStatus
      } = cell.row.original;

      return (
        <TooltipProvider>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge
              className={cn(
                'text-xs font-medium',
                healthStatus === 'DEAD'
                  ? 'border-red-200 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : healthStatus === 'SICK'
                    ? 'border-yellow-200 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'border-green-200 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              )}
              variant='outline'
            >
              {healthStatus}
            </Badge>

            {isVaccinated && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='bg-accent rounded-lg p-2'>
                    <Icons.isVaccinated className='h-4 w-4 text-green-600 dark:text-green-500' />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Vaccinated</p>
                </TooltipContent>
              </Tooltip>
            )}
            {isPregnant && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='bg-accent rounded-lg p-2'>
                    <Icons.isPregnant className='h-4 w-4 text-pink-600 dark:text-pink-500' />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pregnant</p>
                </TooltipContent>
              </Tooltip>
            )}
            {isLactating && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='bg-accent rounded-lg p-2'>
                    <Icons.isLactating className='h-4 w-4 text-blue-600 dark:text-blue-500' />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Lactating</p>
                </TooltipContent>
              </Tooltip>
            )}
            {isSold && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='bg-accent rounded-lg p-2'>
                    <Icons.isSold className='h-4 w-4 text-green-600 dark:text-green-500' />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sold</p>
                </TooltipContent>
              </Tooltip>
            )}
            {isQuarantined && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='bg-accent rounded-lg p-2'>
                    <Icons.isQuarantined className='h-4 w-4 text-yellow-600 dark:text-yellow-500' />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quarantined</p>
                </TooltipContent>
              </Tooltip>
            )}
            {isInseminated && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='bg-accent rounded-lg p-2'>
                    <Icons.isInseminated className='h-4 w-4 text-purple-600 dark:text-purple-500' />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Inseminated</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
      );
    },
    enableColumnFilter: true,

    meta: {
      label: 'Health Status',
      variant: 'multiSelect',
      options: HEALTH_STATUS_OPTIONS
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
