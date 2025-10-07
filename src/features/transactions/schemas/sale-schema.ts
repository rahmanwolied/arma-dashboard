import { z } from "zod";

export const saleSchema = z.object({
    customer: z.object({
        name: z.string().min(1, "Customer name is required"),
        phone: z.string().min(1, "Customer phone is required"),
        id: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
    }),
    animals: z.array(z.object({
        id: z.string(),
        tagNumber: z.string(),
        liveWeight: z.number(),
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
