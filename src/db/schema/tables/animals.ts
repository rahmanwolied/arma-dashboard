import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  animalStatusEnum,
  animalTypeEnum,
  cattleClassEnum,
  genderEnum,
  healthStatusEnum,
} from "../enums";

// Core Animal Management Tables
export const animals = pgTable("animals", {
  id: uuid("id").primaryKey().defaultRandom(),
  animalType: animalTypeEnum("animal_type").notNull(),
  status: animalStatusEnum("status").notNull().default("ON_FARM"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
  updatedAt: timestamp("updated_at"),
  updatedBy: uuid("updated_by"),
  deletedAt: timestamp("deleted_at"),
});

// Cattle table with animal_id as both PK and FK (Requirement #3)
export const cattle = pgTable("cattle", {
  animalId: uuid("animal_id").primaryKey().references(() => animals.id, {
    onDelete: "cascade",
  }),
  tagNumber: text("tag_number").notNull(),
  gender: genderEnum("gender").notNull(),
  healthStatus: healthStatusEnum("health_status").notNull().default("HEALTHY"),
  isQuarantined: boolean("is_quarantined").notNull().default(false),
  isPregnant: boolean("is_pregnant").notNull().default(false),
  isLactating: boolean("is_lactating").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
  updatedAt: timestamp("updated_at"),
  updatedBy: uuid("updated_by"),
  deletedAt: timestamp("deleted_at"),
});

export const weightRecords = pgTable("weight_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  animalId: uuid("animal_id").references(() => animals.id, {
    onDelete: "cascade",
  }).notNull(),
  weightKg: decimal("weight_kg", { precision: 10, scale: 2 }).notNull(),
  onPurchase: boolean("on_purchase").notNull().default(false),
  onSale: boolean("on_sale").notNull().default(false),
  recordedAt: timestamp("recorded_at").notNull(),
  recordedBy: uuid("recorded_by"),
  notes: text("notes"),
});

export const cattleClassThresholds = pgTable("cattle_class_thresholds", {
  id: uuid("id").primaryKey().defaultRandom(),
  className: cattleClassEnum("class_name").notNull(),
  minWeightKg: decimal("min_weight_kg", { precision: 10, scale: 2 }).notNull(),
  maxWeightKg: decimal("max_weight_kg", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
  updatedAt: timestamp("updated_at"),
  updatedBy: uuid("updated_by"),
});

// Image Management
export const images = pgTable("images", {
  id: uuid("id").primaryKey().defaultRandom(),
  animalId: uuid("animal_id").references(() => animals.id, {
    onDelete: "cascade",
  }).notNull(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  uploadedBy: uuid("uploaded_by"),
});

export type Animal = typeof animals.$inferSelect;
export type Cattle = typeof cattle.$inferSelect;
export type WeightRecord = typeof weightRecords.$inferSelect;
export type CattleClassThreshold = typeof cattleClassThresholds.$inferSelect;
export type Image = typeof images.$inferSelect;
