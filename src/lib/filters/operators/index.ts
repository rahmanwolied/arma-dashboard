/**
 * Filter Operator Handlers
 * Each operator has a dedicated handler function that builds the appropriate SQL condition
 */

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
} from "drizzle-orm";
import { isEmpty } from "@/db/utils";
import type { FilterOperator, FilterVariant } from "@/types/data-table";
import {
    isValidTimestamp,
    normalizeArray,
    parseDateEnd,
    parseDateStart,
    parseNumberRange,
    toNumberOrNull,
} from "../utils";

/**
 * Context passed to operator handlers
 */
export interface OperatorContext {
    column: AnyColumn;
    value: unknown;
    variant: FilterVariant;
}

/**
 * Operator handler function type
 */
export type OperatorHandler = (ctx: OperatorContext) => SQL | undefined;

/**
 * Handles iLike operator (case-insensitive contains)
 */
export function handleILike(ctx: OperatorContext): SQL | undefined {
    if (ctx.variant !== "text" || typeof ctx.value !== "string") {
        return undefined;
    }
    if (ctx.value.trim() === "") {
        return undefined;
    }
    return ilike(ctx.column, `%${ctx.value}%`);
}

/**
 * Handles notILike operator (case-insensitive does not contain)
 */
export function handleNotILike(ctx: OperatorContext): SQL | undefined {
    if (ctx.variant !== "text" || typeof ctx.value !== "string") {
        return undefined;
    }
    if (ctx.value.trim() === "") {
        return undefined;
    }
    return notIlike(ctx.column, `%${ctx.value}%`);
}

/**
 * Handles eq operator (equals)
 */
export function handleEq(ctx: OperatorContext): SQL | undefined {
    // Boolean columns
    if (ctx.column.dataType === "boolean" && typeof ctx.value === "string") {
        return eq(ctx.column, ctx.value === "true");
    }

    // Date columns - match the entire day
    if (ctx.variant === "date" || ctx.variant === "dateRange") {
        if (!isValidTimestamp(ctx.value)) {
            return undefined;
        }
        const startDate = parseDateStart(ctx.value);
        const endDate = parseDateEnd(ctx.value);
        return and(gte(ctx.column, startDate), lte(ctx.column, endDate));
    }

    return eq(ctx.column, ctx.value);
}

/**
 * Handles ne operator (not equals)
 */
export function handleNe(ctx: OperatorContext): SQL | undefined {
    // Boolean columns
    if (ctx.column.dataType === "boolean" && typeof ctx.value === "string") {
        return ne(ctx.column, ctx.value === "true");
    }

    // Date columns - match anything outside the entire day
    if (ctx.variant === "date" || ctx.variant === "dateRange") {
        if (!isValidTimestamp(ctx.value)) {
            return undefined;
        }
        const startDate = parseDateStart(ctx.value);
        const endDate = parseDateEnd(ctx.value);
        return or(lt(ctx.column, startDate), gt(ctx.column, endDate));
    }

    return ne(ctx.column, ctx.value);
}

/**
 * Handles inArray operator (value is in array)
 */
export function handleInArray(ctx: OperatorContext): SQL | undefined {
    if (!Array.isArray(ctx.value)) {
        return undefined;
    }

    const validValues = normalizeArray(ctx.value);
    if (validValues.length === 0) {
        return undefined;
    }

    return inArray(ctx.column, validValues);
}

/**
 * Handles notInArray operator (value is not in array)
 */
export function handleNotInArray(ctx: OperatorContext): SQL | undefined {
    if (!Array.isArray(ctx.value)) {
        return undefined;
    }

    const validValues = normalizeArray(ctx.value);
    if (validValues.length === 0) {
        return undefined;
    }

    return notInArray(ctx.column, validValues);
}

/**
 * Handles lt operator (less than)
 */
export function handleLt(ctx: OperatorContext): SQL | undefined {
    // Number/range variants
    if (ctx.variant === "number" || ctx.variant === "range") {
        return lt(ctx.column, ctx.value);
    }

    // Date variants - use end of day for inclusive comparison
    if (ctx.variant === "date" && isValidTimestamp(ctx.value)) {
        return lt(ctx.column, parseDateEnd(ctx.value));
    }

    return undefined;
}

/**
 * Handles lte operator (less than or equal)
 */
export function handleLte(ctx: OperatorContext): SQL | undefined {
    // Number/range variants
    if (ctx.variant === "number" || ctx.variant === "range") {
        return lte(ctx.column, ctx.value);
    }

    // Date variants - use end of day for inclusive comparison
    if (ctx.variant === "date" && isValidTimestamp(ctx.value)) {
        return lte(ctx.column, parseDateEnd(ctx.value));
    }

    return undefined;
}

/**
 * Handles gt operator (greater than)
 */
export function handleGt(ctx: OperatorContext): SQL | undefined {
    // Number/range variants
    if (ctx.variant === "number" || ctx.variant === "range") {
        return gt(ctx.column, ctx.value);
    }

    // Date variants - use start of day for inclusive comparison
    if (ctx.variant === "date" && isValidTimestamp(ctx.value)) {
        return gt(ctx.column, parseDateStart(ctx.value));
    }

    return undefined;
}

/**
 * Handles gte operator (greater than or equal)
 */
export function handleGte(ctx: OperatorContext): SQL | undefined {
    // Number/range variants
    if (ctx.variant === "number" || ctx.variant === "range") {
        return gte(ctx.column, ctx.value);
    }

    // Date variants - use start of day for inclusive comparison
    if (ctx.variant === "date" && isValidTimestamp(ctx.value)) {
        return gte(ctx.column, parseDateStart(ctx.value));
    }

    return undefined;
}

/**
 * Handles isBetween operator (value is between two values)
 */
export function handleIsBetween(ctx: OperatorContext): SQL | undefined {
    if (!Array.isArray(ctx.value) || ctx.value.length !== 2) {
        return undefined;
    }

    // Date range
    if (ctx.variant === "date" || ctx.variant === "dateRange") {
        const [start, end] = ctx.value;
        const conditions: (SQL | undefined)[] = [];

        if (start && isValidTimestamp(start)) {
            conditions.push(gte(ctx.column, parseDateStart(start)));
        }

        if (end && isValidTimestamp(end)) {
            conditions.push(lte(ctx.column, parseDateEnd(end)));
        }

        const validConditions = conditions.filter(
            (c): c is SQL => c !== undefined,
        );
        return validConditions.length > 0 ? and(...validConditions) : undefined;
    }

    // Number range
    if (ctx.variant === "number" || ctx.variant === "range") {
        const [minValue, maxValue] = parseNumberRange(ctx.value);

        // Both null - no filter
        if (minValue === null && maxValue === null) {
            return undefined;
        }

        // Only min provided - treat as equals
        if (minValue !== null && maxValue === null) {
            return eq(ctx.column, minValue);
        }

        // Only max provided - treat as equals
        if (minValue === null && maxValue !== null) {
            return eq(ctx.column, maxValue);
        }

        // Both provided - range (we know both are non-null here due to checks above)
        if (minValue !== null && maxValue !== null) {
            return and(gte(ctx.column, minValue), lte(ctx.column, maxValue));
        }
    }

    return undefined;
}

/**
 * Handles isRelativeToToday operator (date relative to today)
 */
export function handleIsRelativeToToday(ctx: OperatorContext): SQL | undefined {
    if (
        (ctx.variant !== "date" && ctx.variant !== "dateRange") ||
        typeof ctx.value !== "string"
    ) {
        return undefined;
    }

    const [amountStr, unit] = ctx.value.split(" ");
    if (!amountStr || !unit) {
        return undefined;
    }

    const amount = Number.parseInt(amountStr, 10);
    if (Number.isNaN(amount)) {
        return undefined;
    }

    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (unit) {
        case "days":
            startDate = startOfDay(addDays(today, amount));
            endDate = endOfDay(startDate);
            break;
        case "weeks":
            startDate = startOfDay(addDays(today, amount * 7));
            endDate = endOfDay(addDays(startDate, 6));
            break;
        case "months":
            // Approximate: 30 days per month
            startDate = startOfDay(addDays(today, amount * 30));
            endDate = endOfDay(addDays(startDate, 29));
            break;
        default:
            return undefined;
    }

    return and(gte(ctx.column, startDate), lte(ctx.column, endDate));
}

/**
 * Handles isEmpty operator (value is empty/null)
 */
export function handleIsEmpty(ctx: OperatorContext): SQL | undefined {
    return isEmpty(ctx.column);
}

/**
 * Handles isNotEmpty operator (value is not empty/null)
 */
export function handleIsNotEmpty(ctx: OperatorContext): SQL | undefined {
    return not(isEmpty(ctx.column));
}

/**
 * Operator registry - maps operator names to handler functions
 */
export const OPERATOR_REGISTRY: Record<FilterOperator, OperatorHandler> = {
    iLike: handleILike,
    notILike: handleNotILike,
    eq: handleEq,
    ne: handleNe,
    inArray: handleInArray,
    notInArray: handleNotInArray,
    lt: handleLt,
    lte: handleLte,
    gt: handleGt,
    gte: handleGte,
    isBetween: handleIsBetween,
    isRelativeToToday: handleIsRelativeToToday,
    isEmpty: handleIsEmpty,
    isNotEmpty: handleIsNotEmpty,
};
