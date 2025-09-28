/**
 * Main schema module - exports all database schema components
 * 
 * This is the central entry point for all schema-related exports.
 * Import from this file to access tables, enums, relations, and types.
 * 
 * Usage:
 * ```typescript
 * import { animals, cattle, customers } from '@/db/schema';
 * import { animalTypeEnum, genderEnum } from '@/db/schema';
 * import type { Animal, NewAnimal } from '@/db/schema';
 * ```
 */

// Export all enums
export * from './enums';

// Export all tables
export * from './tables';

// Export all relations
export * from './relations';

// Export all types
export * from './types';
