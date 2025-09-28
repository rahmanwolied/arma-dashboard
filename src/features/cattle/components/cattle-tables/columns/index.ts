"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { CattleWithDetails } from "@/app/_lib/queries/cattle";

import { actionsColumn } from "./actions-column";
import { cattleNumberColumn } from "./cattle-number-column";
import { fatPercentageColumn } from "./fat-percentage-column";
import { healthStatusColumn } from "./health-status-column";
import { imageColumn } from "./image-column";
import { cattlePurchaseDateColumn } from "./cattle-purchase-date";
import { priceColumn } from "./price-column";
import { totalPriceColumn } from "./total-price-column";
import { weightClassColumn } from "./weight-class-column";

export const columns: ColumnDef<CattleWithDetails>[] = [
  cattleNumberColumn,
  // imageColumn,
  weightClassColumn,
  priceColumn,
  totalPriceColumn,
  healthStatusColumn,
  cattlePurchaseDateColumn,
  actionsColumn,
];
