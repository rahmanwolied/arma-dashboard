'use client';
import { ColumnDef } from '@tanstack/react-table';
import type { Cattle } from '@/prisma/generated/prisma';
import { CellAction } from '../cell-action';

export const actionsColumn: ColumnDef<Cattle> = {
  id: 'actions',
  cell: ({ row }) => <CellAction data={row.original} />
};
