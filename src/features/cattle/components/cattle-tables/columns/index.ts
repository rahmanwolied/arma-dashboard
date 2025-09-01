'use client';
import type { ColumnDef } from '@tanstack/react-table';
import type { FlattenedCattle } from '@/features/cattle/actions';

import { actionsColumn } from './actions-column';
import { cattleNumberColumn } from './cattle-number-column';
import { fatPercentageColumn } from './fat-percentage-column';
import { healthStatusColumn } from './health-status-column';
import { imageColumn } from './image-column';
import { cattlePurchaseDateColumn } from './cattle-purchase-date';
import { priceColumn } from './price-column';
import { totalPriceColumn } from './total-price-column';
import { weightClassColumn } from './weight-class-column';

export const columns: ColumnDef<FlattenedCattle>[] = [
  cattleNumberColumn,
  // imageColumn,
  weightClassColumn,
  priceColumn,
  totalPriceColumn,
  fatPercentageColumn,
  healthStatusColumn,
  cattlePurchaseDateColumn,
  actionsColumn
];
