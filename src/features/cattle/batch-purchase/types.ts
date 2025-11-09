/**
 * Batch Purchase Feature Types
 * Defines the data structures for the multi-step batch cattle purchase flow
 */

export interface BatchCattleItem {
    id: number
    tagNo: string
    weight: string
    purchasePrice: string
}

export interface BatchPurchaseData {
    // Step 1: Purchase Setup
    purchaseDate: string
    marketName: string
    numberOfCattle: string

    // Step 2: Cattle Details
    cattle: BatchCattleItem[]

    // Step 3: Batch Costs
    transportCost: string
    hasilFee: string
    miscCost: string
}

export const BATCH_PURCHASE_STEPS = {
    SETUP: 'setup',
    DETAILS: 'details',
    COSTS: 'costs',
    REVIEW: 'review',
    SUCCESS: 'success',
} as const

export type BatchPurchaseStep = typeof BATCH_PURCHASE_STEPS[keyof typeof BATCH_PURCHASE_STEPS]

