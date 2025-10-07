import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";
import { flagConfig } from "@/config/flag";
import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import {
  animalStatusEnum,
  cattleClassEnum,
  genderEnum,
  healthStatusEnum,
} from "@/db/schema/enums";

// Cattle validation schemas
export const createCattleSchema = z.object({
  tagNumber: z.string().min(1, "Tag number is required"),
  gender: z.enum(genderEnum.enumValues),
  healthStatus: z.enum(healthStatusEnum.enumValues).default("HEALTHY"),
  isQuarantined: z.boolean().default(false),
  isPregnant: z.boolean().default(false),
  isLactating: z.boolean().default(false),
  liveWeight: z.string().refine((value) => {
    const num = Number(value);
    return !Number.isNaN(num) && num >= 0;
  }, "Live weight must be a positive number."),
  purchasePricePerKg: z.string().refine((value) => {
    const num = Number(value);
    return !Number.isNaN(num) && num >= 0;
  }, "Purchase price per kg must be a positive number.").optional(),
});

export const updateCattleSchema = createCattleSchema.partial().extend({
  id: z.string().min(1, "ID is required"),
});

export type CreateCattleSchema = z.infer<typeof createCattleSchema>;
export type UpdateCattleSchema = z.infer<typeof updateCattleSchema>;

// Cattle search params cache
export const cattleSearchParamsCache = createSearchParamsCache({
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value),
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser().withDefault([]),
  search: parseAsString.withDefault(""),
  gender: parseAsArrayOf(z.enum(genderEnum.enumValues)).withDefault([]),
  healthStatus: parseAsArrayOf(
    z.enum([
      ...healthStatusEnum.enumValues,
      "LACTATING",
      "PREGNANT",
      "QUARANTINED",
      "NOT_LACTATING",
      "NOT_PREGNANT",
      "NOT_QUARANTINED",
    ]),
  ).withDefault(
    [],
  ),
  animalStatus: parseAsArrayOf(z.enum(animalStatusEnum.enumValues)).withDefault(
    [],
  ),
  isQuarantined: parseAsBoolean.withDefault(false),
  isPregnant: parseAsBoolean.withDefault(false),
  isLactating: parseAsBoolean.withDefault(false),
  createdAt: parseAsArrayOf(z.coerce.number()).withDefault([]),
  purchasePrice: parseAsArrayOf(z.coerce.number()).withDefault([]),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  cattleClass: parseAsArrayOf(z.enum(cattleClassEnum.enumValues)).withDefault(
    [],
  ),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export type GetCattleSchema = Awaited<
  ReturnType<typeof cattleSearchParamsCache.parse>
>;

// Customers search params cache
export const customersSearchParamsCache = createSearchParamsCache({
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value),
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser().withDefault([]),
  search: parseAsString.withDefault(""),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export type GetCustomersSchema = Awaited<
  ReturnType<typeof customersSearchParamsCache.parse>
>;

// Sales search params cache
export const salesSearchParamsCache = createSearchParamsCache({
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value),
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser().withDefault([]),
  search: parseAsString.withDefault(""),
  discountType: parseAsArrayOf(z.enum(["FLAT", "PERCENT", "WEIGHT_BASED"]))
    .withDefault([]),
  saleDate: parseAsArrayOf(z.coerce.number()).withDefault([]),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export type GetSalesSchema = Awaited<
  ReturnType<typeof salesSearchParamsCache.parse>
>;
