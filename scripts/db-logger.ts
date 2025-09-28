/**
 * Database Error Logger Utility for Drizzle ORM
 * Provides structured error logging with context and PostgreSQL error details
 */

interface DatabaseErrorContext {
    operation: string;
    table?: string;
    entityId?: string;
    entityName?: string;
    userId?: string;
    [key: string]: string | number | boolean | undefined;
}

interface PostgreSQLError extends Error {
    code?: string;
    constraint?: string;
    detail?: string;
    hint?: string;
    position?: string;
    schema?: string;
    table?: string;
    column?: string;
    dataType?: string;
    file?: string;
    line?: string;
    routine?: string;
    severity?: string;
}

function formatError(
    error: PostgreSQLError,
    context: DatabaseErrorContext,
) {
    const baseError = {
        timestamp: new Date().toISOString(),
        errorMessage: error.message,
        errorCode: error.code || "UNKNOWN",
        ...context,
    };

    // Add PostgreSQL specific error details if available
    const pgErrorDetails: Partial<PostgreSQLError> = {};
    if (error.constraint) pgErrorDetails.constraint = error.constraint;
    if (error.detail) pgErrorDetails.detail = error.detail;
    if (error.hint) pgErrorDetails.hint = error.hint;
    if (error.schema) pgErrorDetails.schema = error.schema;
    if (error.table) pgErrorDetails.table = error.table;
    if (error.column) pgErrorDetails.column = error.column;
    if (error.severity) pgErrorDetails.severity = error.severity;

    return {
        ...baseError,
        ...(Object.keys(pgErrorDetails).length > 0 &&
            { pgError: pgErrorDetails }),
    };
}

export function logError(
    error: PostgreSQLError,
    context: DatabaseErrorContext,
) {
    const formattedError = formatError(error, context);

    // Color-coded console output for better readability
    console.error(
        `❌ Database Error [${context.operation}]:`,
        formattedError,
    );

    // In production, you might want to send this to a logging service
    if (process.env.NODE_ENV === "production") {
        // Example: Send to Sentry, Winston, or other logging service
        // logger.error('Database Error', formattedError);
    }
}

export function logSuccess(context: DatabaseErrorContext) {
    console.log(`✅ Success [${context.operation}]:`, {
        timestamp: new Date().toISOString(),
        ...context,
    });
}

export function logWarning(message: string, context: DatabaseErrorContext) {
    console.warn(`⚠️  Warning [${context.operation}]:`, {
        message,
        timestamp: new Date().toISOString(),
        ...context,
    });
}

/**
 * Common PostgreSQL Error Codes and their meanings
 */
export function getErrorDescription(code: string): string {
    const errorCodes: Record<string, string> = {
        "23505": "Unique constraint violation",
        "23503": "Foreign key constraint violation",
        "23502": "Not null constraint violation",
        "23514": "Check constraint violation",
        "42P01": "Undefined table",
        "42703": "Undefined column",
        "42883": "Undefined function",
        "08006": "Connection failure",
        "57P01": "Admin shutdown",
        "53300": "Too many connections",
        "40001": "Serialization failure",
        "40P01": "Deadlock detected",
    };

    return errorCodes[code] || "Unknown error";
}

export type { DatabaseErrorContext, PostgreSQLError };
