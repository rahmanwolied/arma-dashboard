'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Customer } from '@/prisma/generated/prisma';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Phone, Text, XCircle } from 'lucide-react';
import { CellAction } from './cell-action';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export const columns: ColumnDef<Customer>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Customer, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Customer['name']>()}</div>,
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
    accessorKey: 'address',
    header: ({ column }: { column: Column<Customer, unknown> }) => (
      <DataTableColumnHeader column={column} title='Address' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<Customer['address']>();

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className='max-w-[200px] truncate'>{status}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p className='text-xs'>{status}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableColumnFilter: false,
    enableSorting: false,
    meta: {
      label: 'address',
      variant: 'multiSelect',
      options: []
    }
  },
  {
    accessorKey: 'phone',
    header: ({ column }: { column: Column<Customer, unknown> }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ cell }) => {
      const phone = cell.getValue<Customer['phone']>();
      return <div>{phone}</div>;
    },
    enableColumnFilter: false,
    enableSorting: false,
    meta: {
      label: 'phone',
      variant: 'text',
      icon: Phone
    }
  },
  {
    id: 'status',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Customer, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ cell }) => {
      const name = cell.getValue<Customer['name']>();
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
      label: 'status',
      variant: 'multiSelect',
      options: [
        { label: 'Old', value: 'old' },
        { label: 'New', value: 'new' }
      ]
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
