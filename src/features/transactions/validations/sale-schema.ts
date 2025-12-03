import { z } from "zod";

// Pricing mode types
export const pricingModeEnum = z.enum(["PER_KG", "FIXED"]);
export const perKgModeEnum = z.enum(["SAME_RATE", "PER_ANIMAL"]);
export const fixedPriceModeEnum = z.enum(["TOTAL", "PER_ANIMAL"]);

export const saleSchema = z.object({
    customer: z.object({
        name: z.string().min(1, "Customer name is required"),
        phone: z.string().min(1, "Customer phone is required"),
        id: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        address: z.object({
            addressLine: z.string(),
            divisionId: z.string().optional(),
            districtId: z.string().optional(),
            zoneId: z.string().optional(),
            divisionName: z.string().optional(),
            districtName: z.string().optional(),
            zoneName: z.string().optional(),
        }).optional(),
        isNew: z.boolean().optional(),
    }),
    animals: z.array(z.object({
        id: z.string(),
        tagNumber: z.string(),
        liveWeight: z.number(),
        adjustedPrice: z.number().optional(), // Cost price
        fixedSalePrice: z.number().optional(), // Individual fixed sale price (when fixedPriceMode is PER_ANIMAL)
        individualPricePerKg: z.number().optional(), // Individual price per kg (when perKgMode is PER_ANIMAL)
    })).min(1, "At least one animal must be selected"),

    // Pricing mode selection
    pricingMode: pricingModeEnum.default("PER_KG"),

    // Per KG pricing options
    perKgMode: perKgModeEnum.optional(), // Only when pricingMode is PER_KG
    pricePerKg: z.coerce.number().optional(), // Only required when pricingMode is PER_KG and perKgMode is SAME_RATE

    // Fixed price mode options
    fixedPriceMode: fixedPriceModeEnum.optional(), // Only when pricingMode is FIXED
    totalFixedPrice: z.coerce.number().optional(), // Only when fixedPriceMode is TOTAL

    saleDate: z.date().or(z.string()),
    discountType: z.enum(["FLAT", "PERCENT", "WEIGHT_BASED"]).optional(),
    discountInput: z.coerce.number().optional(), // Depends on discount type
    payments: z.array(z.object({
        paymentMethod: z.enum([
            "CASH",
            "CREDIT_CARD",
            "BANK_TRANSFER",
            "MOBILE_MONEY",
        ]),
        paidAmount: z.coerce.number().positive("Amount must be positive"),
    })).optional().default([]),
    paymentTerms: z.string().optional(),
    remarks: z.string().optional(),
}).superRefine((data, ctx) => {
    // Validate based on pricing mode
    if (data.pricingMode === "PER_KG") {
        const perKgMode = data.perKgMode || "SAME_RATE";

        if (perKgMode === "SAME_RATE") {
            if (!data.pricePerKg || data.pricePerKg <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Price per kg must be positive",
                    path: ["pricePerKg"],
                });
            }
        } else if (perKgMode === "PER_ANIMAL") {
            // Check that each animal has an individual price per kg
            const animalsWithoutPrice = data.animals.filter(
                animal => !animal.individualPricePerKg || animal.individualPricePerKg <= 0
            );
            if (animalsWithoutPrice.length > 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Each animal must have a positive price per kg",
                    path: ["animals"],
                });
            }
        }
    } else if (data.pricingMode === "FIXED") {
        if (!data.fixedPriceMode) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please select a fixed price mode",
                path: ["fixedPriceMode"],
            });
        } else if (data.fixedPriceMode === "TOTAL") {
            if (!data.totalFixedPrice || data.totalFixedPrice <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Total fixed price must be positive",
                    path: ["totalFixedPrice"],
                });
            }
        } else if (data.fixedPriceMode === "PER_ANIMAL") {
            // Check that each animal has a fixed sale price
            const animalsWithoutPrice = data.animals.filter(
                animal => !animal.fixedSalePrice || animal.fixedSalePrice <= 0
            );
            if (animalsWithoutPrice.length > 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Each animal must have a positive fixed sale price",
                    path: ["animals"],
                });
            }
        }
    }
});

export type SaleFormData = z.infer<typeof saleSchema>;
export type PricingMode = z.infer<typeof pricingModeEnum>;
export type PerKgMode = z.infer<typeof perKgModeEnum>;
export type FixedPriceMode = z.infer<typeof fixedPriceModeEnum>;
