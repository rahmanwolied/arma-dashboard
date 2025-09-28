import {
  boolean,
  decimal,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { meatInventoryStatusEnum } from "../enums";
import { animals } from "./animals";

// Slaughter and Meat Processing Tables

export const slaughterHouses = pgTable("slaughter_houses", {
  id: uuid("id").primaryKey().defaultRandom(),
  farmId: uuid("farm_id").notNull(),
  name: text("name").notNull(),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
  updatedAt: timestamp("updated_at"),
  updatedBy: uuid("updated_by"),
});

export const slaughterRecords = pgTable("slaughter_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  animalId: uuid("animal_id").references(() => animals.id, {
    onDelete: "cascade",
  }).notNull(),
  slaughterhouseId: uuid("slaughterhouse_id").references(() =>
    slaughterHouses.id
  ).notNull(),
  slaughterDate: timestamp("slaughter_date").notNull(),
  slaughteredBy: uuid("slaughtered_by"),
  batchNumber: text("batch_number"),
  liveWeightKg: decimal("live_weight_kg", { precision: 10, scale: 2 })
    .notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
});

export const meatCategories = pgTable("meat_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // FAT, LEAN_MEAT, LIVER, etc
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
});

export const meatYields = pgTable("meat_yields", {
  id: uuid("id").primaryKey().defaultRandom(),
  slaughterRecordId: uuid("slaughter_record_id").references(
    () => slaughterRecords.id,
    { onDelete: "cascade" },
  ).notNull(),
  meatCategoryId: uuid("meat_category_id").references(() => meatCategories.id)
    .notNull(),
  grossWeightKg: decimal("gross_weight_kg", { precision: 10, scale: 2 })
    .notNull(),
  netWeightKg: decimal("net_weight_kg", { precision: 10, scale: 2 }).notNull(),
  pricePerKg: decimal("price_per_kg", { precision: 10, scale: 2 }).notNull(),
  batchNumber: text("batch_number"),
  inventoryId: text("inventory_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
});

// New meatInventory table - Requirement #6
export const meatInventories = pgTable("meat_inventories", {
  id: uuid("id").primaryKey().defaultRandom(),
  meatYieldId: uuid("meat_yield_id").references(() => meatYields.id, {
    onDelete: "cascade",
  }).notNull(),
  quantityKg: decimal("quantity_kg", { precision: 10, scale: 2 }).notNull(),
  pricePerKg: decimal("price_per_kg", { precision: 10, scale: 2 }).notNull(),
  status: meatInventoryStatusEnum("status").notNull().default("AVAILABLE"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
  updatedAt: timestamp("updated_at"),
  updatedBy: uuid("updated_by"),
});

export type SlaughterHouse = typeof slaughterHouses.$inferSelect;
export type SlaughterRecord = typeof slaughterRecords.$inferSelect;
export type MeatCategory = typeof meatCategories.$inferSelect;
export type MeatYield = typeof meatYields.$inferSelect;
export type MeatInventory = typeof meatInventories.$inferSelect;
