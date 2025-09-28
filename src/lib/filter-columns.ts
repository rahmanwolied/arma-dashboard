import { addDays, endOfDay, startOfDay } from "date-fns";
import {
  and,
  type AnyColumn,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  lt,
  lte,
  ne,
  not,
  notIlike,
  notInArray,
  or,
  type SQL,
  type Table,
} from "drizzle-orm";
import { isEmpty } from "@/db/utils";
import type { ExtendedColumnFilter, JoinOperator } from "@/types/data-table";

// Special handler for healthStatus filter that combines multiple fields
function handleHealthStatusFilter(
  values: unknown[],
  additionalTables?: Record<string, Table>,
): SQL | undefined {
  if (!additionalTables?.cattle) {
    return undefined;
  }

  const cattle = additionalTables.cattle as Table & {
    healthStatus: AnyColumn;
    isLactating: AnyColumn;
    isPregnant: AnyColumn;
    isQuarantined: AnyColumn;
  };
  const validValues = values.filter(
    (value): value is string => typeof value === "string" && value !== "",
  );

  if (validValues.length === 0) {
    return undefined;
  }

  const healthStatusValues: string[] = [];
  const booleanConditions: SQL[] = [];

  for (const value of validValues) {
    switch (value) {
      case "HEALTHY":
      case "MINOR_ISSUE":
      case "SICK":
      case "CRITICAL":
        healthStatusValues.push(value);
        break;
      case "LACTATING":
        booleanConditions.push(eq(cattle.isLactating, true));
        break;
      case "NOT_LACTATING":
        booleanConditions.push(eq(cattle.isLactating, false));
        break;
      case "PREGNANT":
        booleanConditions.push(eq(cattle.isPregnant, true));
        break;
      case "NOT_PREGNANT":
        booleanConditions.push(eq(cattle.isPregnant, false));
        break;
      case "QUARANTINED":
        booleanConditions.push(eq(cattle.isQuarantined, true));
        break;
      case "NOT_QUARANTINED":
        booleanConditions.push(eq(cattle.isQuarantined, false));
        break;
      // Reject invalid values like "isLactating", "isSold", etc.
      default:
        // Invalid values are silently ignored
        break;
    }
  }

  const conditions: SQL[] = [];

  if (healthStatusValues.length > 0) {
    conditions.push(inArray(cattle.healthStatus, healthStatusValues));
  }

  if (booleanConditions.length > 0) {
    conditions.push(...booleanConditions);
  }

  return conditions.length > 0 ? or(...conditions) : undefined;
}

export function filterColumns<T extends Table>({
  table,
  filters,
  joinOperator,
  additionalTables,
}: {
  table: T;
  filters: ExtendedColumnFilter<T>[];
  joinOperator: JoinOperator;
  additionalTables?: Record<string, Table>;
}): SQL | undefined {
  const joinFn = joinOperator === "and" ? and : or;

  const conditions = filters.map((filter) => {
    // Special handling for healthStatus which combines multiple fields
    if (
      filter.id === "healthStatus" && filter.operator === "inArray" &&
      Array.isArray(filter.value)
    ) {
      return handleHealthStatusFilter(filter.value, additionalTables);
    }

    // Special handling for cattleClass which is computed from weight, handled in cattle query
    if (filter.id === "cattleClass") {
      // cattleClass filtering is handled in the cattle query post-processing
      return undefined;
    }

    const column = getColumnFromTables(table, filter.id, additionalTables);

    switch (filter.operator) {
      case "iLike":
        return filter.variant === "text" && typeof filter.value === "string"
          ? ilike(column, `%${filter.value}%`)
          : undefined;

      case "notILike":
        return filter.variant === "text" && typeof filter.value === "string"
          ? notIlike(column, `%${filter.value}%`)
          : undefined;

      case "eq":
        if (column.dataType === "boolean" && typeof filter.value === "string") {
          return eq(column, filter.value === "true");
        }
        if (filter.variant === "date" || filter.variant === "dateRange") {
          const date = new Date(Number(filter.value));
          date.setHours(0, 0, 0, 0);
          const end = new Date(date);
          end.setHours(23, 59, 59, 999);
          return and(gte(column, date), lte(column, end));
        }
        return eq(column, filter.value);

      case "ne":
        if (column.dataType === "boolean" && typeof filter.value === "string") {
          return ne(column, filter.value === "true");
        }
        if (filter.variant === "date" || filter.variant === "dateRange") {
          const date = new Date(Number(filter.value));
          date.setHours(0, 0, 0, 0);
          const end = new Date(date);
          end.setHours(23, 59, 59, 999);
          return or(lt(column, date), gt(column, end));
        }
        return ne(column, filter.value);

      case "inArray":
        if (Array.isArray(filter.value)) {
          // Filter out empty strings and invalid values
          const validValues = filter.value.filter(
            (value) => value !== null && value !== undefined && value !== "",
          );
          if (validValues.length === 0) {
            return undefined;
          }
          return inArray(column, validValues);
        }
        return undefined;

      case "notInArray":
        if (Array.isArray(filter.value)) {
          // Filter out empty strings and invalid values
          const validValues = filter.value.filter(
            (value) => value !== null && value !== undefined && value !== "",
          );
          if (validValues.length === 0) {
            return undefined;
          }
          return notInArray(column, validValues);
        }
        return undefined;

      case "lt":
        return filter.variant === "number" || filter.variant === "range"
          ? lt(column, filter.value)
          : filter.variant === "date" && typeof filter.value === "string"
          ? lt(
            column,
            (() => {
              const date = new Date(Number(filter.value));
              date.setHours(23, 59, 59, 999);
              return date;
            })(),
          )
          : undefined;

      case "lte":
        return filter.variant === "number" || filter.variant === "range"
          ? lte(column, filter.value)
          : filter.variant === "date" && typeof filter.value === "string"
          ? lte(
            column,
            (() => {
              const date = new Date(Number(filter.value));
              date.setHours(23, 59, 59, 999);
              return date;
            })(),
          )
          : undefined;

      case "gt":
        return filter.variant === "number" || filter.variant === "range"
          ? gt(column, filter.value)
          : filter.variant === "date" && typeof filter.value === "string"
          ? gt(
            column,
            (() => {
              const date = new Date(Number(filter.value));
              date.setHours(0, 0, 0, 0);
              return date;
            })(),
          )
          : undefined;

      case "gte":
        return filter.variant === "number" || filter.variant === "range"
          ? gte(column, filter.value)
          : filter.variant === "date" && typeof filter.value === "string"
          ? gte(
            column,
            (() => {
              const date = new Date(Number(filter.value));
              date.setHours(0, 0, 0, 0);
              return date;
            })(),
          )
          : undefined;

      case "isBetween":
        if (
          (filter.variant === "date" || filter.variant === "dateRange") &&
          Array.isArray(filter.value) &&
          filter.value.length === 2
        ) {
          return and(
            filter.value[0]
              ? gte(
                column,
                (() => {
                  const date = new Date(Number(filter.value[0]));
                  date.setHours(0, 0, 0, 0);
                  return date;
                })(),
              )
              : undefined,
            filter.value[1]
              ? lte(
                column,
                (() => {
                  const date = new Date(Number(filter.value[1]));
                  date.setHours(23, 59, 59, 999);
                  return date;
                })(),
              )
              : undefined,
          );
        }

        if (
          (filter.variant === "number" || filter.variant === "range") &&
          Array.isArray(filter.value) &&
          filter.value.length === 2
        ) {
          const firstValue = filter.value[0] && filter.value[0].trim() !== ""
            ? Number(filter.value[0])
            : null;
          const secondValue = filter.value[1] && filter.value[1].trim() !== ""
            ? Number(filter.value[1])
            : null;

          if (firstValue === null && secondValue === null) {
            return undefined;
          }

          if (firstValue !== null && secondValue === null) {
            return eq(column, firstValue);
          }

          if (firstValue === null && secondValue !== null) {
            return eq(column, secondValue);
          }

          return and(
            firstValue !== null ? gte(column, firstValue) : undefined,
            secondValue !== null ? lte(column, secondValue) : undefined,
          );
        }
        return undefined;

      case "isRelativeToToday":
        if (
          (filter.variant === "date" || filter.variant === "dateRange") &&
          typeof filter.value === "string"
        ) {
          const today = new Date();
          const [amount, unit] = filter.value.split(" ") ?? [];
          let startDate: Date;
          let endDate: Date;

          if (!amount || !unit) return undefined;

          switch (unit) {
            case "days":
              startDate = startOfDay(addDays(today, Number.parseInt(amount)));
              endDate = endOfDay(startDate);
              break;
            case "weeks":
              startDate = startOfDay(
                addDays(today, Number.parseInt(amount) * 7),
              );
              endDate = endOfDay(addDays(startDate, 6));
              break;
            case "months":
              startDate = startOfDay(
                addDays(today, Number.parseInt(amount) * 30),
              );
              endDate = endOfDay(addDays(startDate, 29));
              break;
            default:
              return undefined;
          }

          return and(gte(column, startDate), lte(column, endDate));
        }
        return undefined;

      case "isEmpty":
        return isEmpty(column);

      case "isNotEmpty":
        return not(isEmpty(column));

      default:
        throw new Error(`Unsupported operator: ${filter.operator}`);
    }
  });

  const validConditions = conditions.filter(
    (condition) => condition !== undefined,
  );

  return validConditions.length > 0 ? joinFn(...validConditions) : undefined;
}

export function getColumn<T extends Table>(
  table: T,
  columnKey: keyof T,
): AnyColumn {
  return table[columnKey] as AnyColumn;
}

export function getColumnFromTables<T extends Table>(
  primaryTable: T,
  columnKey: string,
  additionalTables?: Record<string, Table>,
): AnyColumn {
  // Define mapping for columns that exist in different tables
  const columnTableMapping: Record<string, string> = {
    purchaseDate: "purchases",
    purchasePrice: "animalPurchases",
    totalTransportCost: "purchases",
    vendorId: "purchases",
    marketId: "purchases",
    saleDate: "sales",
    invoiceNumber: "sales",
    totalAmount: "sales",
    // Boolean fields in cattle table
    isLactating: "cattle",
    isPregnant: "cattle",
    isQuarantined: "cattle",
    // Animal status in animals table
    animalStatus: "animals",
    status: "animals",
    // Add more mappings as needed
  };

  // Check if this column should come from a different table
  const targetTableName = columnTableMapping[columnKey];
  if (targetTableName && additionalTables?.[targetTableName]) {
    const targetTable = additionalTables[targetTableName];
    if (columnKey in targetTable) {
      return targetTable[columnKey as keyof typeof targetTable] as AnyColumn;
    }
  }

  // Default to primary table
  if (columnKey in primaryTable) {
    return primaryTable[columnKey as keyof T] as AnyColumn;
  }

  // Fallback - throw error if column not found
  throw new Error(
    `Column '${columnKey}' not found in any of the provided tables`,
  );
}
