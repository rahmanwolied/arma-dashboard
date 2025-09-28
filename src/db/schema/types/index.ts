// Type definitions for all tables using Drizzle's inference utilities

import type {
  // Animals
  animals,
  cattle,
  weightRecords,
  cattleClassThresholds,
  images,
  
  // Health
  healthRecords,
  vaccines,
  vaccinationRecords,
  quarantineHistory,
  veterinarians,
  
  // Purchases
  vendors,
  markets,
  animalPurchases,
  
  // Customers
  customers,
  addresses,
  
  // Sales
  sales,
  saleAnimalLinks,
  payments,
  
  // Slaughter
  slaughterHouses,
  slaughterRecords,
  meatCategories,
  meatYields,
  meatInventories,
  
  // Breeding
  inseminationRecords,
  calvingEvents,
  lactationPeriods,
} from '../tables';

// Animal Types
export type Animal = typeof animals.$inferSelect;
export type NewAnimal = typeof animals.$inferInsert;

export type Cattle = typeof cattle.$inferSelect;
export type NewCattle = typeof cattle.$inferInsert;

export type WeightRecord = typeof weightRecords.$inferSelect;
export type NewWeightRecord = typeof weightRecords.$inferInsert;

export type CattleClassThreshold = typeof cattleClassThresholds.$inferSelect;
export type NewCattleClassThreshold = typeof cattleClassThresholds.$inferInsert;

export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;

// Health Types
export type HealthRecord = typeof healthRecords.$inferSelect;
export type NewHealthRecord = typeof healthRecords.$inferInsert;

export type Vaccine = typeof vaccines.$inferSelect;
export type NewVaccine = typeof vaccines.$inferInsert;

export type VaccinationRecord = typeof vaccinationRecords.$inferSelect;
export type NewVaccinationRecord = typeof vaccinationRecords.$inferInsert;

export type QuarantineHistory = typeof quarantineHistory.$inferSelect;
export type NewQuarantineHistory = typeof quarantineHistory.$inferInsert;

export type Veterinarian = typeof veterinarians.$inferSelect;
export type NewVeterinarian = typeof veterinarians.$inferInsert;

// Purchase Types
export type Vendor = typeof vendors.$inferSelect;
export type NewVendor = typeof vendors.$inferInsert;

export type Market = typeof markets.$inferSelect;
export type NewMarket = typeof markets.$inferInsert;

export type AnimalPurchase = typeof animalPurchases.$inferSelect;
export type NewAnimalPurchase = typeof animalPurchases.$inferInsert;

// Customer Types
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;

// Sales Types
export type Sale = typeof sales.$inferSelect;
export type NewSale = typeof sales.$inferInsert;

export type SaleAnimalLink = typeof saleAnimalLinks.$inferSelect;
export type NewSaleAnimalLink = typeof saleAnimalLinks.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

// Slaughter Types
export type SlaughterHouse = typeof slaughterHouses.$inferSelect;
export type NewSlaughterHouse = typeof slaughterHouses.$inferInsert;

export type SlaughterRecord = typeof slaughterRecords.$inferSelect;
export type NewSlaughterRecord = typeof slaughterRecords.$inferInsert;

export type MeatCategory = typeof meatCategories.$inferSelect;
export type NewMeatCategory = typeof meatCategories.$inferInsert;

export type MeatYield = typeof meatYields.$inferSelect;
export type NewMeatYield = typeof meatYields.$inferInsert;

export type MeatInventory = typeof meatInventories.$inferSelect;
export type NewMeatInventory = typeof meatInventories.$inferInsert;

// Breeding Types
export type InseminationRecord = typeof inseminationRecords.$inferSelect;
export type NewInseminationRecord = typeof inseminationRecords.$inferInsert;

export type CalvingEvent = typeof calvingEvents.$inferSelect;
export type NewCalvingEvent = typeof calvingEvents.$inferInsert;

export type LactationPeriod = typeof lactationPeriods.$inferSelect;
export type NewLactationPeriod = typeof lactationPeriods.$inferInsert;

// Union Types for commonly used entities
export type AnyTable = 
  | Animal 
  | Cattle 
  | WeightRecord 
  | Customer 
  | Address 
  | Sale 
  | Payment 
  | SlaughterRecord 
  | MeatYield 
  | MeatInventory;

export type AnyNewTable = 
  | NewAnimal 
  | NewCattle 
  | NewWeightRecord 
  | NewCustomer 
  | NewAddress 
  | NewSale 
  | NewPayment 
  | NewSlaughterRecord 
  | NewMeatYield 
  | NewMeatInventory;
