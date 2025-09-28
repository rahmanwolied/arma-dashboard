import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import { z } from "zod";

import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import type { Cattle } from "@/db/schema/tables/animals";
import { healthStatusEnum } from "@/db/schema/enums";

export const cattleSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Cattle>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  purchasePrice: parseAsString.withDefault(""),
  healthStatus: parseAsArrayOf(z.enum(healthStatusEnum.enumValues)).withDefault(
    [],
  ),

  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
};

export const cattleSearchParamsCache = createSearchParamsCache(
  cattleSearchParams,
);
