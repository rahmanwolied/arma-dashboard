import { relations } from "drizzle-orm";
import {
  addresses,
  // Purchases
  animalPurchases,
  // Animals
  animals,
  calvingEvents,
  cattle,
  // Customers
  customers,
  districts,
  // Customers
  divisions,
  // Health
  healthRecords,
  images,
  // Breeding
  inseminationRecords,
  lactationPeriods,
  markets,
  meatCategories,
  meatInventories,
  meatYields,
  payments,
  purchases,
  quarantineHistory,
  saleAnimalLinks,
  // Sales
  sales,
  // Slaughter
  slaughterHouses,
  slaughterRecords,
  vaccinationRecords,
  vaccines,
  vendors,
  veterinarians,
  weightRecords,
  zones,
} from "../tables";

// Animal Relations
export const animalsRelations = relations(animals, ({ one, many }) => ({
  cattle: one(cattle, {
    fields: [animals.id],
    references: [cattle.animalId],
  }),
  weightRecords: many(weightRecords),
  healthRecords: many(healthRecords),
  vaccinationRecords: many(vaccinationRecords),
  quarantineHistory: many(quarantineHistory),
  images: many(images),
  animalPurchase: one(animalPurchases, {
    fields: [animals.id],
    references: [animalPurchases.animalId],
  }),
  slaughterRecord: one(slaughterRecords, {
    fields: [animals.id],
    references: [slaughterRecords.animalId],
  }),
  saleAnimalLinks: many(saleAnimalLinks),
}));

export const cattleRelations = relations(cattle, ({ one, many }) => ({
  animal: one(animals, {
    fields: [cattle.animalId],
    references: [animals.id],
  }),
  inseminationRecords: many(inseminationRecords),
  calvingEventsAsMother: many(calvingEvents, {
    relationName: "motherId",
  }),
  calvingEventsAsCalf: many(calvingEvents, {
    relationName: "calfId",
  }),
  lactationPeriods: many(lactationPeriods),
}));

export const weightRecordsRelations = relations(weightRecords, ({ one }) => ({
  animal: one(animals, {
    fields: [weightRecords.animalId],
    references: [animals.id],
  }),
}));

export const imagesRelations = relations(images, ({ one }) => ({
  animal: one(animals, {
    fields: [images.animalId],
    references: [animals.id],
  }),
}));

// Health Relations
export const healthRecordsRelations = relations(healthRecords, ({ one }) => ({
  animal: one(animals, {
    fields: [healthRecords.animalId],
    references: [animals.id],
  }),
  veterinarian: one(veterinarians, {
    fields: [healthRecords.veterinarianId],
    references: [veterinarians.id],
  }),
}));

export const vaccinationRecordsRelations = relations(
  vaccinationRecords,
  ({ one }) => ({
    animal: one(animals, {
      fields: [vaccinationRecords.animalId],
      references: [animals.id],
    }),
    vaccine: one(vaccines, {
      fields: [vaccinationRecords.vaccineId],
      references: [vaccines.id],
    }),
  }),
);

export const quarantineHistoryRelations = relations(
  quarantineHistory,
  ({ one }) => ({
    animal: one(animals, {
      fields: [quarantineHistory.animalId],
      references: [animals.id],
    }),
  }),
);

export const vaccinesRelations = relations(vaccines, ({ many }) => ({
  vaccinationRecords: many(vaccinationRecords),
}));

export const veterinariansRelations = relations(veterinarians, ({ many }) => ({
  healthRecords: many(healthRecords),
  inseminationRecords: many(inseminationRecords),
}));

// Purchase Relations
export const purchasesRelations = relations(purchases, ({ one, many }) => ({
  vendor: one(vendors, {
    fields: [purchases.vendorId],
    references: [vendors.id],
  }),
  market: one(markets, {
    fields: [purchases.marketId],
    references: [markets.id],
  }),
  animalPurchases: many(animalPurchases),
}));

export const animalPurchasesRelations = relations(
  animalPurchases,
  ({ one }) => ({
    animal: one(animals, {
      fields: [animalPurchases.animalId],
      references: [animals.id],
    }),
    purchase: one(purchases, {
      fields: [animalPurchases.purchaseId],
      references: [purchases.id],
    }),
  }),
);

export const vendorsRelations = relations(vendors, ({ many }) => ({
  purchases: many(purchases),
}));

export const marketsRelations = relations(markets, ({ many }) => ({
  purchases: many(purchases),
}));

// Customer Relations
export const customersRelations = relations(customers, ({ many }) => ({
  addresses: many(addresses),
  sales: many(sales),
}));

// Sales Relations
export const salesRelations = relations(sales, ({ one, many }) => ({
  customer: one(customers, {
    fields: [sales.customerId],
    references: [customers.id],
  }),
  slaughterhouse: one(slaughterHouses, {
    fields: [sales.slaughterhouseId],
    references: [slaughterHouses.id],
  }),
  payments: many(payments),
  saleAnimalLinks: many(saleAnimalLinks),
}));

export const saleAnimalLinksRelations = relations(
  saleAnimalLinks,
  ({ one }) => ({
    sale: one(sales, {
      fields: [saleAnimalLinks.saleId],
      references: [sales.id],
    }),
    animal: one(animals, {
      fields: [saleAnimalLinks.animalId],
      references: [animals.id],
    }),
  }),
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  sale: one(sales, {
    fields: [payments.saleId],
    references: [sales.id],
  }),
}));

// Slaughter Relations
export const slaughterHousesRelations = relations(
  slaughterHouses,
  ({ many }) => ({
    slaughterRecords: many(slaughterRecords),
    sales: many(sales),
  }),
);

export const slaughterRecordsRelations = relations(
  slaughterRecords,
  ({ one, many }) => ({
    animal: one(animals, {
      fields: [slaughterRecords.animalId],
      references: [animals.id],
    }),
    slaughterhouse: one(slaughterHouses, {
      fields: [slaughterRecords.slaughterhouseId],
      references: [slaughterHouses.id],
    }),
    meatYields: many(meatYields),
  }),
);

export const meatCategoriesRelations = relations(
  meatCategories,
  ({ many }) => ({
    meatYields: many(meatYields),
  }),
);

export const meatYieldsRelations = relations(meatYields, ({ one, many }) => ({
  slaughterRecord: one(slaughterRecords, {
    fields: [meatYields.slaughterRecordId],
    references: [slaughterRecords.id],
  }),
  meatCategory: one(meatCategories, {
    fields: [meatYields.meatCategoryId],
    references: [meatCategories.id],
  }),
  meatInventories: many(meatInventories),
}));

export const meatInventoriesRelations = relations(
  meatInventories,
  ({ one }) => ({
    meatYield: one(meatYields, {
      fields: [meatInventories.meatYieldId],
      references: [meatYields.id],
    }),
  }),
);

// Breeding Relations
export const inseminationRecordsRelations = relations(
  inseminationRecords,
  ({ one }) => ({
    cattle: one(cattle, {
      fields: [inseminationRecords.cattleId],
      references: [cattle.animalId],
    }),
    veterinarian: one(veterinarians, {
      fields: [inseminationRecords.veterinarianId],
      references: [veterinarians.id],
    }),
  }),
);

export const calvingEventsRelations = relations(calvingEvents, ({ one }) => ({
  mother: one(cattle, {
    fields: [calvingEvents.motherId],
    references: [cattle.animalId],
    relationName: "motherId",
  }),
  calf: one(cattle, {
    fields: [calvingEvents.calfId],
    references: [cattle.animalId],
    relationName: "calfId",
  }),
}));

export const lactationPeriodsRelations = relations(
  lactationPeriods,
  ({ one }) => ({
    cattle: one(cattle, {
      fields: [lactationPeriods.cattleId],
      references: [cattle.animalId],
    }),
  }),
);

// --- Address Relations (for ORM-level access) ---

export const divisionRelations = relations(divisions, ({ many }) => ({
  districts: many(districts),
}));

export const districtRelations = relations(districts, ({ one, many }) => ({
  division: one(divisions, {
    fields: [districts.divisionId],
    references: [divisions.id],
  }),
  zones: many(zones),
}));

export const zoneRelations = relations(zones, ({ one }) => ({
  district: one(districts, {
    fields: [zones.districtId],
    references: [districts.id],
  }),
}));

export const addressRelations = relations(addresses, ({ one }) => ({
  customer: one(customers, {
    fields: [addresses.customerId],
    references: [customers.id],
  }),
  division: one(divisions, {
    fields: [addresses.divisionId],
    references: [divisions.id],
  }),
  district: one(districts, {
    fields: [addresses.districtId],
    references: [districts.id],
  }),
  zone: one(zones, {
    fields: [addresses.zoneId],
    references: [zones.id],
  }),
}));
