import {
  boolean,
  decimal,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { discountTypeEnum, paymentMethodEnum } from "../enums";
import { customers } from "./customers";
import { animals } from "./animals";

// Sales and Payment Management Tables

// Modified sales table - Requirement #2: Removed animal_id column
export const sales = pgTable("sales", {
  id: uuid("id").primaryKey().defaultRandom(),
  farmId: uuid("farm_id").notNull(),
  customerId: uuid("customer_id").references(() => customers.id),
  slaughterhouseId: uuid("slaughterhouse_id"),
  invoiceNumber: text("invoice_number").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }),
  discountType: discountTypeEnum("discount_type"),
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }).notNull(),
  amountDue: decimal("amount_due", { precision: 10, scale: 2 }).notNull(),
  isCredit: boolean("is_credit").notNull().default(false),
  paymentTerms: text("payment_terms"),
  saleDate: timestamp("sale_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
  updatedAt: timestamp("updated_at"),
  updatedBy: uuid("updated_by"),
});

// New junction table for multi-animal sales - Requirement #2
export const saleAnimalLinks = pgTable("sale_animal_links", {
  saleId: uuid("sale_id").references(() => sales.id, { onDelete: "cascade" })
    .notNull(),
  animalId: uuid("animal_id").references(() => animals.id, {
    onDelete: "cascade",
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.saleId, table.animalId] }),
}));

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  saleId: uuid("sale_id").references(() => sales.id, { onDelete: "cascade" })
    .notNull(),
  paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }).notNull(),
  paidAt: timestamp("paid_at").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  transactionReference: text("transaction_reference"),
  receivedBy: uuid("received_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
});

export type Sale = typeof sales.$inferSelect;
export type SaleAnimalLink = typeof saleAnimalLinks.$inferSelect;
export type Payment = typeof payments.$inferSelect;
