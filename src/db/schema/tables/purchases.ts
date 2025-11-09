import { decimal, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { animals } from "./animals";

export const markets = pgTable("markets", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  location: text("location"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
});

// Modified animalPurchases table - Requirement #1 & #5: animal_id unique, removed initialWeightKg
export const animalPurchases = pgTable("animal_purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  purchaseId: uuid("purchase_id")
    .references(() => purchases.id, { onDelete: "cascade" })
    .notNull(),
  animalId: uuid("animal_id").references(() => animals.id, {
    onDelete: "cascade",
  }).notNull().unique(),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 })
    .notNull(),
  adjustedPrice: decimal("adjusted_price", { precision: 10, scale: 2 })
    .notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
});

export const purchases = pgTable("purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  marketId: uuid("market_id").references(() => markets.id),
  purchaseDate: timestamp("purchase_date").notNull(),
  notes: text("notes"), // Notes for the overall purchase
  totalBasePrice: decimal("total_base_price", { precision: 10, scale: 2 })
    .notNull(),
  pickupCost: decimal("pickup_cost", {
    precision: 10,
    scale: 2,
  }),
  hasilCost: decimal("hasil_cost", {
    precision: 10,
    scale: 2,
  }),
  miscellaneousCost: decimal("miscellaneous_cost", {
    precision: 10,
    scale: 2,
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
});

export type Market = typeof markets.$inferSelect;
export type AnimalPurchase = typeof animalPurchases.$inferSelect;
export type Purchase = typeof purchases.$inferSelect;
