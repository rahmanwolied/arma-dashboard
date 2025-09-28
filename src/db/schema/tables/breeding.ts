import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { cattle } from "./animals";
import { veterinarians } from "./health";

// Breeding and Reproduction Tables (Cattle-specific)

export const inseminationRecords = pgTable("insemination_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  cattleId: uuid("cattle_id").references(() => cattle.animalId, {
    onDelete: "cascade",
  }).notNull(),
  inseminationDate: timestamp("insemination_date").notNull(),
  bullId: uuid("bull_id"), // Reference to another cattle record
  semenSource: text("semen_source"),
  veterinarianId: uuid("veterinarian_id").references(() => veterinarians.id),
  expectedCalvingDate: timestamp("expected_calving_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
});

export const calvingEvents = pgTable("calving_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  motherId: uuid("mother_id").references(() => cattle.animalId, {
    onDelete: "cascade",
  }).notNull(),
  calfId: uuid("calf_id").references(() => cattle.animalId), // May be null if calf didn't survive
  calvingDate: timestamp("calving_date").notNull(),
  calvingDifficulty: text("calving_difficulty"), // EASY, MODERATE, DIFFICULT
  veterinarianAssisted: boolean("veterinarian_assisted").notNull().default(
    false,
  ),
  calfWeight: decimal("calf_weight", { precision: 10, scale: 2 }),
  complications: text("complications"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
});

export const lactationPeriods = pgTable("lactation_periods", {
  id: uuid("id").primaryKey().defaultRandom(),
  cattleId: uuid("cattle_id").references(() => cattle.animalId, {
    onDelete: "cascade",
  }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  peakMilkYield: decimal("peak_milk_yield", { precision: 10, scale: 2 }),
  totalMilkYield: decimal("total_milk_yield", { precision: 10, scale: 2 }),
  lactationNumber: integer("lactation_number"), // 1st, 2nd, 3rd lactation, etc.
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
});

export type InseminationRecord = typeof inseminationRecords.$inferSelect;
export type CalvingEvent = typeof calvingEvents.$inferSelect;
export type LactationPeriod = typeof lactationPeriods.$inferSelect;
