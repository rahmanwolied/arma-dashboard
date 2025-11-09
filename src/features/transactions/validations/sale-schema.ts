import { z } from "zod";

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
        adjustedPrice: z.number().optional(),
    })).min(1, "At least one animal must be selected"),
    pricePerKg: z.coerce.number().positive("Price per kg must be positive"),
    saleDate: z.date().or(z.string()),
    discountType: z.enum(["FLAT", "PERCENT", "WEIGHT_BASED"]).optional(),
    discountInput: z.coerce.number().optional(), // Depends on discount type
    paymentMethod: z.enum([
        "CASH",
        "CREDIT_CARD",
        "BANK_TRANSFER",
        "MOBILE_MONEY",
    ]),
    amountPaid: z.coerce.number().min(0, "Amount paid must be non-negative"),
    paymentTerms: z.string().optional(),
    remarks: z.string().optional(),
});

export type SaleFormData = z.infer<typeof saleSchema>;
