/**
 * Array utility functions for filter operations
 * Handles value normalization and validation
 */

/**
 * Normalizes an array by removing null, undefined, and empty strings
 */
export function normalizeArray<T = unknown>(values: unknown[]): T[] {
    return values.filter(
        (value): value is T =>
            value !== null && value !== undefined && value !== "",
    ) as T[];
}

/**
 * Validates that all values in an array are strings
 */
export function validateStringArray(values: unknown[]): string[] {
    return normalizeArray<string>(values).filter(
        (value): value is string => typeof value === "string",
    );
}

/**
 * Validates that all values in an array are from an allowed set
 */
export function validateEnumArray<T extends string>(
    values: unknown[],
    allowedValues: readonly T[],
): T[] {
    const normalized = validateStringArray(values);
    const allowedSet = new Set(allowedValues);
    return normalized.filter((value): value is T => allowedSet.has(value as T));
}
