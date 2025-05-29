'use client';
import { ColumnDef } from '@tanstack/react-table';
import type { Cattle } from '@/prisma/generated/prisma';

import { cattleNumberColumn } from './cattle-number-column';
import { imageColumn } from './image-column';
import { weightClassColumn } from './weight-class-column';
import { priceColumn } from './price-column';
import { fatPercentageColumn } from './fat-percentage-column';
import { healthStatusColumn } from './health-status-column';
import { actionsColumn } from './actions-column';

export const columns: ColumnDef<Cattle>[] = [
  cattleNumberColumn,
  imageColumn,
  weightClassColumn,
  priceColumn,
  fatPercentageColumn,
  healthStatusColumn,
  actionsColumn
];
