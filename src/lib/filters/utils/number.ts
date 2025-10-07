/**
 * Number utility functions for filter operations
 * Handles number parsing and validation
 */

/**
 * Converts a value to a number or returns null if invalid
 */
export function toNumberOrNull(value: unknown): number | null {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    if (typeof value === "number") {
        return Number.isNaN(value) ? null : value;
    }

    if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed === "") return null;
        const num = Number(trimmed);
        return Number.isNaN(num) ? null : num;
    }

    return null;
}

/**
 * Validates that a value is a valid number
 */
export function isValidNumber(value: unknown): value is number {
    return typeof value === "number" && !Number.isNaN(value);
}

/**
 * Parses a number range from an array, handling partial ranges
 * Returns [min, max] where either can be null
 */
export function parseNumberRange(
    values: unknown[],
): [number | null, number | null] {
    if (!Array.isArray(values) || values.length !== 2) {
        return [null, null];
    }

    const [first, second] = values;
    return [toNumberOrNull(first), toNumberOrNull(second)];
}
