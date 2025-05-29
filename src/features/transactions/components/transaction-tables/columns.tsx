'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import {
  Customer,
  Cattle,
  Transaction,
  TransactionItem
} from '@/prisma/generated/prisma';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Phone, Text, XCircle } from 'lucide-react';
import { CellAction } from './cell-action';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn, formatCurrency } from '@/lib/utils';
import {
  CATTLE_CLASS_OPTIONS,
  HEALTH_STATUS_OPTIONS
} from '@/features/cattle/components/cattle-tables/options';
import { Icons } from '@/components/icons';

export type TransactionWithCustomer = Transaction & {
  customer: Customer;
  transactionItem: TransactionItem;
  cattle: Cattle;
};

export const columns: ColumnDef<TransactionWithCustomer>[] = [
  {
    id: 'cattle_number',
    accessorKey: 'cattle.cattleNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cattle Number' />
    )
  },
  {
    id: 'name',
    accessorKey: 'customer.name',
    header: ({
      column
    }: {
      column: Column<TransactionWithCustomer, unknown>;
    }) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({ cell }) => (
      <div>{cell.getValue<TransactionWithCustomer['customer']['name']>()}</div>
    ),
    meta: {
      label: 'Name',
      placeholder: 'Search customers...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'address',
    accessorKey: 'customer.address',
    header: ({
      column
    }: {
      column: Column<TransactionWithCustomer, unknown>;
    }) => <DataTableColumnHeader column={column} title='Address' />,
    cell: ({ cell }) => {
      const address =
        cell.getValue<TransactionWithCustomer['customer']['address']>();

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className='max-w-[200px] truncate'>{address}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p className='text-xs'>{address}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableColumnFilter: false,
    enableSorting: false,
    enableHiding: true,
    meta: {
      label: 'Address'
    }
  },
  {
    accessorKey: 'customer.phone',
    header: ({
      column
    }: {
      column: Column<TransactionWithCustomer, unknown>;
    }) => <DataTableColumnHeader column={column} title='Phone' />,
    cell: ({ cell }) => {
      const phone =
        cell.getValue<TransactionWithCustomer['customer']['phone']>();
      return <div>{phone}</div>;
    },
    enableColumnFilter: false,
    enableSorting: false,
    meta: {
      label: 'Phone'
    }
  },
  {
    id: 'status',
    accessorKey: 'customer.name',
    header: ({
      column
    }: {
      column: Column<TransactionWithCustomer, unknown>;
    }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ cell }) => {
      const name = cell.getValue<TransactionWithCustomer['customer']['name']>();
      const status = name?.length % 2 === 0 ? 'Old' : 'New';

      const color = status === 'Old' ? 'bg-accent' : 'bg-rose-400';
      return (
        <Badge variant='outline' className={cn(color, 'text-xs')}>
          {status}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Status',
      variant: 'multiSelect',
      options: [
        { label: 'Old', value: 'old' },
        { label: 'New', value: 'new' }
      ]
    }
  },
  {
    id: 'cattle_class',
    accessorKey: 'cattle.liveWeight',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Live Weight' />
    ),
    cell: ({ cell }) => {
      const weight =
        cell.getValue<TransactionWithCustomer['cattle']['liveWeight']>();
      const cattleClass = cell.row.original.cattle.cattleClass;
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
    meta: {
      label: 'Cattle Class',
      variant: 'multiSelect',
      options: CATTLE_CLASS_OPTIONS
    }
  },
  {
    id: 'price',
    accessorKey: 'transactionItem.totalPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total Price' />
    ),
    cell: ({ cell }) => {
      const totalPrice =
        cell.getValue<
          TransactionWithCustomer['transactionItem']['totalPrice']
        >();
      return <div>{formatCurrency(totalPrice ?? 0)}</div>;
    }
  },
  {
    id: 'paid_amount',
    accessorKey: 'transactionItem.paidAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Paid Amount' />
    ),
    cell: ({ cell }) => {
      const paidAmount =
        cell.getValue<
          TransactionWithCustomer['transactionItem']['paidAmount']
        >();
      return <div>{formatCurrency(paidAmount ?? 0)}</div>;
    }
  },
  {
    id: 'estimated_sale_price',
    accessorKey: 'transactionItem.estimatedSalePriceKg',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Estimated Sale Price (Kg)'
      />
    ),
    cell: ({ cell }) => {
      const estimatedSalePrice =
        cell.getValue<
          TransactionWithCustomer['transactionItem']['estimatedSalePriceKg']
        >();
      return <div>{formatCurrency(estimatedSalePrice ?? 0)}</div>;
    }
  },
  {
    id: 'actual_sale_price',
    accessorKey: 'transactionItem.actualSalePriceKg',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Actual Sale Price (Kg)' />
    ),
    cell: ({ cell }) => {
      const actualSalePrice =
        cell.getValue<
          TransactionWithCustomer['transactionItem']['actualSalePriceKg']
        >();
      return <div>{formatCurrency(actualSalePrice ?? 0)}</div>;
    }
  },
  {
    id: 'healthStatus',
    accessorKey: 'cattle.healthStatus',
    header: ({
      column
    }: {
      column: Column<TransactionWithCustomer, unknown>;
    }) => <DataTableColumnHeader column={column} title='Health Status' />,
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
      } = cell.row.original.cattle;

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
    id: 'remarks',
    accessorKey: 'remarks',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Remarks' />
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
