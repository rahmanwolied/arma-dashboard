/**
 * Date utility functions for filter operations
 * Provides consistent date parsing and boundary handling
 */

/**
 * Parses a timestamp to the start of the day (00:00:00.000)
 */
export function parseDateStart(timestamp: string | number): Date {
    const date = new Date(Number(timestamp));
    date.setHours(0, 0, 0, 0);
    return date;
}

/**
 * Parses a timestamp to the end of the day (23:59:59.999)
 */
export function parseDateEnd(timestamp: string | number): Date {
    const date = new Date(Number(timestamp));
    date.setHours(23, 59, 59, 999);
    return date;
}

/**
 * Validates that a timestamp is a valid date
 */
export function isValidTimestamp(value: unknown): value is string | number {
    if (typeof value !== "string" && typeof value !== "number") {
        return false;
    }
    const date = new Date(Number(value));
    return !Number.isNaN(date.getTime());
}
