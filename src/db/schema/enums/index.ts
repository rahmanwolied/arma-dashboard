import { pgEnum } from "drizzle-orm/pg-core";

// Animal-related enums
export const animalTypeEnum = pgEnum("animal_type", [
    "CATTLE",
    "POULTRY",
    "FISH",
    "OTHER",
]);
export const animalStatusEnum = pgEnum("animal_status", [
    "ON_FARM",
    "SOLD",
    "SLAUGHTERED",
]);
export const genderEnum = pgEnum("gender", ["MALE", "FEMALE"]);

// Health-related enums
export const healthStatusEnum = pgEnum("health_status", [
    "HEALTHY",
    "MINOR_ISSUE",
    "SICK",
    "CRITICAL",
]);

// Cattle-specific enums
export const cattleClassEnum = pgEnum("cattle_class", [
    "GOLD",
    "SILVER",
    "PLATINUM",
]);

// Address-related enums
export const addressTypeEnum = pgEnum("address_type_enum", [
    "HOME",
    "BUSINESS",
    "DELIVERY",
]);

// Financial-related enums
export const discountTypeEnum = pgEnum("discount_type", ["FLAT", "PERCENT"]);
export const paymentMethodEnum = pgEnum("payment_method", [
    "CASH",
    "CREDIT_CARD",
    "BANK_TRANSFER",
    "MOBILE_MONEY",
]);

// Inventory-related enums
export const meatInventoryStatusEnum = pgEnum("meat_inventory_status", [
    "AVAILABLE",
    "SOLD",
    "RESERVED",
]);
