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
import { Icons } from '@/components/icons';
import { HEALTH_STATUS_OPTIONS } from '../options';

export const healthStatusColumn: ColumnDef<Cattle> = {
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
};
