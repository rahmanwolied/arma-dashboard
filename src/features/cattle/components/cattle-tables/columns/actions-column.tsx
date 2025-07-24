'use client';
import type { ColumnDef } from '@tanstack/react-table';
import type { FlattenedCattle } from '@/features/cattle/actions';
import { CellAction } from '../cell-action';

export const actionsColumn: ColumnDef<FlattenedCattle> = {
  id: 'actions',
  cell: ({ row }) => <CellAction data={row.original} />
};
