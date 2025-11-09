/**
 * BatchPurchaseService - Service for batch cattle purchase operations
 * Handles database transactions and business logic for creating batch purchases
 */

import { db } from '@/db'
import { animals, cattle, animalPurchases, purchases, weightRecords, markets } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { CompleteBatchPurchaseFormValues } from '@/features/cattle/batch-purchase/validations/batch-purchase-schema'

export interface BatchPurchaseResult {
    totalCattle: number
    totalInvestment: number
    purchaseDate: string
    marketName: string
}

export interface BatchPurchaseInput {
    data: CompleteBatchPurchaseFormValues
    userId: string
}

export class BatchPurchaseService {
    /**
     * Creates a batch purchase with all associated records
     */
    async createBatchPurchase(input: BatchPurchaseInput): Promise<BatchPurchaseResult> {
        const { data, userId } = input

        // Calculate costs
        const costs = this.calculateCosts(data)

        // Parse and validate purchase date
        const purchaseDate = this.parsePurchaseDate(data.purchaseDate)

        // Execute transaction
        const totalInvestment = await db.transaction(async (tx) => {
            // Create or get market
            const marketId = await this.ensureMarket(tx, data.marketValue)

            // Create batch purchase record
            const purchase = await this.createPurchaseRecord(tx, {
                purchaseDate,
                marketId,
                totalBasePrice: costs.totalBaseCost,
                hasilFee: costs.hasilFee,
                transportCost: costs.transportCost,
                miscCost: costs.miscCost,
                perHeadShare: costs.perHeadShare,
                marketName: data.marketValue.name,
            })

            // Create each cattle entry
            let totalInvestment = 0
            for (const cattleItem of data.cattle) {
                const adjustedPrice = await this.createCattleEntry(tx, {
                    cattleItem,
                    purchaseId: purchase.id,
                    purchaseDate,
                    perHeadShare: costs.perHeadShare,
                    userId,
                })
                totalInvestment += adjustedPrice
            }

            return totalInvestment
        })

        return {
            totalCattle: Number.parseInt(data.numberOfCattle, 10),
            totalInvestment,
            purchaseDate: data.purchaseDate,
            marketName: data.marketValue.name,
        }
    }

    /**
     * Calculates all costs for the batch purchase
     */
    private calculateCosts(data: CompleteBatchPurchaseFormValues) {
        const transportCost = Number.parseFloat(data.transportCost) || 0
        const hasilFee = Number.parseFloat(data.hasilFee) || 0
        const miscCost = Number.parseFloat(data.miscCost) || 0
        const totalSharedCost = transportCost + hasilFee + miscCost

        const totalBaseCost = data.cattle.reduce(
            (sum, cattle) => sum + (Number.parseFloat(cattle.purchasePrice) || 0),
            0
        )

        const numCattle = Number.parseInt(data.numberOfCattle, 10)
        const perHeadShare = totalSharedCost / numCattle

        return {
            transportCost,
            hasilFee,
            miscCost,
            totalSharedCost,
            totalBaseCost,
            perHeadShare,
        }
    }

    /**
     * Parses and validates the purchase date string (DD/MM/YYYY)
     */
    private parsePurchaseDate(dateString: string): Date {
        const [day, month, year] = dateString.split('/')
        const purchaseDate = new Date(`${year}-${month}-${day}`)

        if (Number.isNaN(purchaseDate.getTime())) {
            throw new Error('Invalid purchase date format')
        }

        return purchaseDate
    }

    /**
     * Ensures market exists, creates if needed
     */
    private async ensureMarket(
        tx: unknown,
        marketValue: CompleteBatchPurchaseFormValues['marketValue']
    ): Promise<string> {
        const t = tx as typeof db

        // Check if market exists
        const existingMarket = await t
            .select({ marketId: markets.id })
            .from(markets)
            .where(eq(markets.name, marketValue.name))
            .limit(1)

        if (existingMarket[0]?.marketId) {
            return existingMarket[0].marketId
        }

        // Create new market
        const [market] = await t
            .insert(markets)
            .values({
                name: marketValue.name,
                location: marketValue.location || '',
                phone: marketValue.phone || '',
            })
            .returning({ id: markets.id })

        return market.id
    }

    /**
     * Creates the batch purchase record
     */
    private async createPurchaseRecord(
        tx: unknown,
        params: {
            purchaseDate: Date
            marketId: string
            totalBasePrice: number
            hasilFee: number
            transportCost: number
            miscCost: number
            perHeadShare: number
            marketName: string
        }
    ) {
        const t = tx as typeof db

        const [purchase] = await t
            .insert(purchases)
            .values({
                purchaseDate: params.purchaseDate,
                marketId: params.marketId,
                totalBasePrice: params.totalBasePrice.toString(),
                hasilCost: params.hasilFee.toString(),
                miscellaneousCost: params.miscCost.toString(),
                pickupCost: params.transportCost.toString(),
                notes: `Batch Purchase from ${params.marketName}. Transport: ${params.transportCost}, Hasil: ${params.hasilFee}, Misc: ${params.miscCost}. Per-head share: ${params.perHeadShare.toFixed(2)}`,
            })
            .returning()

        return purchase
    }

    /**
     * Creates a single cattle entry with all related records
     */
    private async createCattleEntry(
        tx: unknown,
        params: {
            cattleItem: CompleteBatchPurchaseFormValues['cattle'][0]
            purchaseId: string
            purchaseDate: Date
            perHeadShare: number
            userId: string
        }
    ): Promise<number> {
        const t = tx as typeof db
        const { cattleItem, purchaseId, purchaseDate, perHeadShare, userId } = params

        const basePrice = Number.parseFloat(cattleItem.purchasePrice) || 0
        const adjustedPrice = basePrice + perHeadShare

        // Create animal record
        const [animal] = await t
            .insert(animals)
            .values({
                animalType: 'CATTLE',
                status: 'ON_FARM',
            })
            .returning()

        // Create cattle-specific record
        await t.insert(cattle).values({
            animalId: animal.id,
            tagNumber: cattleItem.tagNo,
            gender: 'MALE', // Default, can be updated later
            healthStatus: 'HEALTHY',
            isQuarantined: false,
            isPregnant: false,
            isLactating: false,
        })

        // Create animal purchase record
        await t.insert(animalPurchases).values({
            purchaseId,
            animalId: animal.id,
            purchasePrice: basePrice.toString(),
            adjustedPrice: adjustedPrice.toString(),
            notes: `Base Price: ${basePrice.toFixed(2)}, Shared Costs: ${perHeadShare.toFixed(2)}`,
        })

        // Create initial weight record if provided
        if (cattleItem.weight) {
            await t.insert(weightRecords).values({
                animalId: animal.id,
                weightKg: cattleItem.weight,
                onPurchase: true,
                recordedAt: purchaseDate,
                notes: 'Initial weight at purchase',
            })
        }

        return adjustedPrice
    }
}

