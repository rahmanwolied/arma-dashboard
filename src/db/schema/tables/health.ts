import {
  boolean,
  decimal,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { animals } from "./animals";

// Health and Veterinary Tables

export const healthRecords = pgTable("health_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  animalId: uuid("animal_id").references(() => animals.id, {
    onDelete: "cascade",
  }).notNull(),
  veterinarianId: uuid("veterinarian_id"),
  diagnosis: text("diagnosis").notNull(),
  treatment: text("treatment").notNull(),
  notes: text("notes"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  occurredAt: timestamp("occurred_at").notNull(),
  recordedAt: timestamp("recorded_at").notNull(),
  attachmentUrls: text("attachment_urls"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
});

export const vaccines = pgTable("vaccines", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  manufacturer: text("manufacturer"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
});

export const vaccinationRecords = pgTable("vaccination_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  animalId: uuid("animal_id").references(() => animals.id, {
    onDelete: "cascade",
  }).notNull(),
  vaccineId: uuid("vaccine_id").references(() => vaccines.id).notNull(),
  vaccinationDate: timestamp("vaccination_date").notNull(),
  batchNumber: text("batch_number"),
  nextDueDate: timestamp("next_due_date"),
  administeredBy: uuid("administered_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
});

export const quarantineHistory = pgTable("quarantine_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  animalId: uuid("animal_id").references(() => animals.id, {
    onDelete: "cascade",
  }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  reason: text("reason").notNull(),
  handledBy: uuid("handled_by"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
});

export const veterinarians = pgTable("veterinarians", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  licenseNumber: text("license_number"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  specialization: text("specialization"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
});

export type HealthRecord = typeof healthRecords.$inferSelect;
export type Vaccine = typeof vaccines.$inferSelect;
export type VaccinationRecord = typeof vaccinationRecords.$inferSelect;
export type QuarantineHistory = typeof quarantineHistory.$inferSelect;
export type Veterinarian = typeof veterinarians.$inferSelect;
