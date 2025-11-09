/**
 * Batch Purchase Validation Schemas
 * Zod schemas for validating batch cattle purchase data
 */

import { z } from 'zod'

/**
 * Step 1: Purchase Setup Schema
 */
export const purchaseSetupSchema = z.object({
    purchaseDate: z.string().min(1, 'Purchase date is required'),
    marketValue: z.object({
        name: z.string().min(1, 'Market name is required').max(200),
        location: z.string().nullable(),
        phone: z.string().nullable(),
        isNew: z.boolean(),
    }),
    numberOfCattle: z.string()
        .min(1, 'Number of cattle is required')
        .refine((val) => {
            const num = Number.parseInt(val, 10)
            return !Number.isNaN(num) && num > 0 && num <= 1000
        }, 'Must be a number between 1 and 1000'),
})

export type PurchaseSetupFormValues = z.infer<typeof purchaseSetupSchema>

/**
 * Individual Cattle Item Schema
 */
export const cattleItemSchema = z.object({
    id: z.number(),
    tagNo: z.string().min(1, 'Tag number is required'),
    weight: z.string().min(1, 'Weight is required'),
    purchasePrice: z.string().min(1, 'Purchase price is required'),
})

/**
 * Step 2: Cattle Details Schema
 */
export const cattleDetailsSchema = z.object({
    cattle: z.array(cattleItemSchema).min(1, 'At least one cattle entry is required'),
})

export type CattleDetailsFormValues = z.infer<typeof cattleDetailsSchema>

/**
 * Step 3: Batch Costs Schema
 */
export const batchCostsSchema = z.object({
    transportCost: z.string().refine((val) => {
        const num = Number.parseFloat(val)
        return !Number.isNaN(num) && num >= 0
    }, 'Must be a valid non-negative number'),
    hasilFee: z.string().refine((val) => {
        const num = Number.parseFloat(val)
        return !Number.isNaN(num) && num >= 0
    }, 'Must be a valid non-negative number'),
    miscCost: z.string().refine((val) => {
        const num = Number.parseFloat(val)
        return !Number.isNaN(num) && num >= 0
    }, 'Must be a valid non-negative number'),
})

export type BatchCostsFormValues = z.infer<typeof batchCostsSchema>

/**
 * Complete Batch Purchase Schema
 * Validates the entire purchase data before submission
 */
export const completeBatchPurchaseSchema = purchaseSetupSchema
    .merge(cattleDetailsSchema)
    .merge(batchCostsSchema)

export type CompleteBatchPurchaseFormValues = z.infer<typeof completeBatchPurchaseSchema>

