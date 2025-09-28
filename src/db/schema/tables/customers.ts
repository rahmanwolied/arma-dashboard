import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { addressTypeEnum } from "../enums";

// --- CORE CUSTOMER TABLE (Unchanged) ---

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // Encrypted PII
  primaryPhone: text("primary_phone").notNull(), // Encrypted PII
  secondaryPhone: text("secondary_phone"), // Encrypted PII
  email: text("email"), // Encrypted PII
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
});

// --- NORMALIZED GEOGRAPHICAL TABLES ---

/**
 * Divisions: The highest level of administrative territory in Bangladesh.
 * e.g., Dhaka, Chattogram, Rajshahi
 */
export const divisions = pgTable("divisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  nameBengali: varchar("name_bengali", { length: 255 }).unique(),
});

/**
 * Districts (Zila): Each district belongs to a single division.
 * e.g., Dhaka, Gazipur, Narayanganj (all under Dhaka Division)
 */
export const districts = pgTable("districts", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  divisionId: uuid("division_id").references(() => divisions.id, {
    onDelete: "cascade",
  }).notNull(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  nameBengali: varchar("name_bengali", { length: 255 }).unique(),
});

/**
 * Upazilas (Sub-districts) / Thanas: Each upazila belongs to a single district.
 * e.g., Mirpur, Gulshan, Savar (all under Dhaka District)
 */
export const zones = pgTable("zones", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  districtId: uuid("district_id").references(() => districts.id, {
    onDelete: "cascade",
  }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  nameBengali: varchar("name_bengali", { length: 255 }),
  postCode: varchar("post_code", { length: 10 }),
});

// --- REVISED ADDRESSES TABLE ---

/**
 * Stores specific customer addresses.
 * It references the normalized geographical tables for structured data (Division, District, Upazila)
 * and uses a JSONB column for unstructured, fine-grained details like house number, road, and landmark.
 */
export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => customers.id, {
    onDelete: "cascade",
  }).notNull(),
  addressType: addressTypeEnum("address_type").default("HOME").notNull(),

  // Foreign keys for structured, hierarchical data
  divisionId: uuid("division_id").references(() => divisions.id).notNull(),
  districtId: uuid("district_id").references(() => districts.id).notNull(),
  zoneId: uuid("zone_id").references(() => zones.id).notNull(),

  // Detailed address line (the part that varies the most)
  addressLine: text("address_line").notNull(),
  // For things like 'C/O', 'Near...' etc.
  landmark: text("landmark"),

  /**
   * For unstructured or non-uniform data that can't be neatly put into columns.
   * This provides flexibility to store various address formats (urban vs. rural).
   * Example:
   * {
   * "holding_number": "123/A",
   * "road_number": "45",
   * "block": "C",
   * "area": "Dhanmondi",
   * "village": "Amtoli",
   * "landmark": "Near the old post office"
   * }
   */
  details: jsonb("details"),

  // Audit fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
});

export type Customer = typeof customers.$inferSelect;
export type Address = typeof addresses.$inferSelect;
export type Division = typeof divisions.$inferSelect;
export type District = typeof districts.$inferSelect;
export type Zone = typeof zones.$inferSelect;
