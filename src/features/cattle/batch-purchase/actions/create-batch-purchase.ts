/**
 * Server Action: Create Batch Purchase
 * Thin orchestration layer that handles auth, validation, and cache invalidation
 */

'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { completeBatchPurchaseSchema } from '../validations/batch-purchase-schema'
import { BatchPurchaseService } from '@/services/BatchPurchaseService'
import type { CompleteBatchPurchaseFormValues } from '../validations/batch-purchase-schema'

interface CreateBatchPurchaseResult {
    success: boolean
    data?: {
        totalCattle: number
        totalInvestment: number
        purchaseDate: string
        marketName: string
    }
    error?: string
}

export async function createBatchPurchaseAction(
    data: unknown
): Promise<CreateBatchPurchaseResult> {
    try {
        // 1. Authentication check
        const { userId } = await auth()
        if (!userId) {
            return {
                success: false,
                error: 'You must be logged in to create a batch purchase',
            }
        }

        // 2. Validate input data
        const validated = completeBatchPurchaseSchema.parse(data) as CompleteBatchPurchaseFormValues

        // 3. Delegate to service layer
        const service = new BatchPurchaseService()
        const result = await service.createBatchPurchase({
            data: validated,
            userId,
        })

        // 4. Revalidate cache
        revalidatePath('/dashboard/cattle')

        return {
            success: true,
            data: result,
        }
    } catch (error) {
        console.error('Failed to create batch purchase:', error)

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message,
            }
        }

        return {
            success: false,
            error: 'Failed to create batch purchase. Please try again.',
        }
    }
}

